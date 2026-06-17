const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./middleware/auth');
const { ownerOnly } = require('./middleware/rbac');
const supabase = require('./config/supabaseClient');

const app = express();

// Root route for health check and to prevent "Cannot GET /"
app.get('/', (req, res) => {
    res.json({ message: 'Sistem POS API is running', status: 'OK' });
});

// CORS — hanya izinkan origin yang terdaftar
const allowedOrigins = [
    'http://localhost:5173',
    'https://point-of-sale-project-xi.vercel.app'
];

app.use(cors({
    origin: (origin, cb) => {
        // Izinkan request tanpa origin (seperti mobile apps atau curl) atau yang ada di list
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            return cb(null, true);
        }
        cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body size limit — max 1MB
app.use(express.json({ limit: '1mb' }));

// Rate limit — global: 100 req/menit per IP
const globalLimiter = rateLimit({ windowMs: 60 * 1000, max: 100, message: { error: 'Terlalu banyak request, coba lagi nanti.' } });
app.use(globalLimiter);

// Rate limit ketat untuk login — 5 percobaan per 15 menit
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' } });

const createTransaction = async (req, res) => {
    const { discount = 0, payment_method, cash_received = 0, customer_name, items, created_by_account } = req.body;
    const account_identifier = created_by_account || 'owner';

    // 1. Validasi struktur dasar input
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Items tidak boleh kosong' });
    }
    if (discount < 0) {
        return res.status(400).json({ error: 'Diskon tidak boleh negatif' });
    }
    if (!['cash', 'QRIS', 'transfer'].includes(payment_method)) {
        return res.status(400).json({ error: 'Metode pembayaran tidak valid' });
    }

    try {
        // 2. Ambil data produk terbaru dari DB untuk verifikasi harga dan stok
        const productIds = items.map(item => item.product_id);
        const { data: productsData, error: fetchError } = await supabase
            .from('products')
            .select('id, price, stock, product_name')
            .in('id', productIds);

        if (fetchError || !productsData) {
            console.error('Fetch products error:', fetchError);
            return res.status(500).json({ error: 'Gagal memverifikasi produk' });
        }

        const productMap = productsData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
        
        let server_total_price = 0;
        const processedItems = [];

        // 3. Verifikasi tiap item
        for (let item of items) {
            const product = productMap[item.product_id];
            
            if (!product) {
                return res.status(400).json({ error: `Produk dengan ID ${item.product_id} tidak ditemukan` });
            }

            if (item.quantity <= 0) {
                return res.status(400).json({ error: `Quantity untuk "${product.product_name}" harus > 0` });
            }

            // Cek stok
            if (product.stock !== -999 && product.stock < item.quantity) {
                return res.status(400).json({ error: `Stok "${product.product_name}" tidak cukup (sisa: ${product.stock})` });
            }

            const itemSubtotal = product.price * item.quantity;
            server_total_price += itemSubtotal;

            processedItems.push({
                product_id: item.product_id,
                quantity: item.quantity,
                price: product.price,
                subtotal: itemSubtotal
            });
        }

        const server_grand_total = Math.max(0, server_total_price - discount);
        const server_change_amount = payment_method === 'cash' ? Math.max(0, cash_received - server_grand_total) : 0;

        // Validasi uang tunai cukup
        if (payment_method === 'cash' && cash_received < server_grand_total) {
            return res.status(400).json({ error: `Uang tunai tidak cukup. Total: ${server_grand_total}, Diterima: ${cash_received}` });
        }

        // 4. Simpan Transaksi (Header)
        const { data: trxData, error: trxError } = await supabase
            .from('transactions')
            .insert([{ 
                created_by_account: account_identifier,
                total_price: server_total_price, 
                discount, 
                grand_total: server_grand_total, 
                payment_method, 
                cash_received, 
                change_amount: server_change_amount,
                customer_name: customer_name || 'Umum'
            }])
            .select();

        if (trxError) {
            console.error('Insert transaction error:', trxError);
            return res.status(500).json({ error: 'Gagal menyimpan transaksi' });
        }

        const transaction_id = trxData[0].id;

        // 5. Simpan Detail Transaksi
        const details = processedItems.map(item => ({
            ...item,
            transaction_id
        }));

        const { error: detailsError } = await supabase
            .from('transaction_details')
            .insert(details);

        if (detailsError) {
            console.error('Insert details error:', detailsError);
            return res.status(500).json({ error: 'Gagal menyimpan detail transaksi' });
        }

        // 6. Update Stok (Potensi Race Condition - Disarankan menggunakan Database RPC untuk operasi atomik)
        for (let item of processedItems) {
            const product = productMap[item.product_id];
            if (product.stock !== -999) { 
                await supabase
                    .from('products')
                    .update({ stock: product.stock - item.quantity })
                    .eq('id', item.product_id);
            }
        }

        res.status(201).json(trxData);
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan internal pada server' });
    }
};

app.post('/login-service', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase
            .from('service_accounts')
            .select('*')
            .eq('email', email)
            .maybeSingle();

        if (error || !data) {
            return res.status(401).json({ error: "Kredensial tidak valid" });
        }

        const valid = await bcrypt.compare(password, data.password);
        if (!valid) {
            return res.status(401).json({ error: "Kredensial tidak valid" });
        }

        const token = jwt.sign(
            { id: data.id, email: data.email, role: data.role_name },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({ ...data, password: undefined, token });
    } catch (error) {
        console.error('Login service error:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
});

app.get('/products', verifyToken, async (req, res) => {
    const { data, error } = await supabase.from('products').select('*').neq('stock', -999).order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error });
    res.json(data);
});

app.post('/products', verifyToken, ownerOnly, async (req, res) => {
    const { product_name, price, cost_price, stock, category, barcode, hpp_template_id, image_url } = req.body;
    const { data, error } = await supabase.from('products').insert([{ product_name, price, cost_price, stock, category, barcode, hpp_template_id, image_url }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

app.put('/products/:id', verifyToken, ownerOnly, async (req, res) => {
    const { id } = req.params;
    const { product_name, price, cost_price, stock, category, barcode, hpp_template_id, image_url } = req.body;
    const { data, error } = await supabase.from('products').update({ product_name, price, cost_price, stock, category, barcode, hpp_template_id, image_url }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.delete('/products/:id', verifyToken, ownerOnly, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('products').update({ stock: -999 }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Produk diarsipkan" });
});

app.get('/hpp-templates', verifyToken, async (req, res) => {
    const { data, error } = await supabase.from('hpp_templates').select('*').order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/hpp-templates', verifyToken, ownerOnly, async (req, res) => {
    const { name, amount, ingredients } = req.body;
    const { data, error } = await supabase.from('hpp_templates').insert([{ name, amount, ingredients }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
});

app.put('/hpp-templates/:id', verifyToken, ownerOnly, async (req, res) => {
    const { id } = req.params;
    const { name, amount, ingredients } = req.body;
    const { data, error } = await supabase.from('hpp_templates').update({ name, amount, ingredients }).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    await supabase.from('products').update({ cost_price: amount }).eq('hpp_template_id', id);
    res.json(data);
});

app.post('/hpp-templates/:id/assign', verifyToken, ownerOnly, async (req, res) => {
    const { id } = req.params;
    const { product_ids, amount } = req.body;
    await supabase.from('products').update({ hpp_template_id: null }).eq('hpp_template_id', id);
    if (product_ids && product_ids.length > 0) {
        await supabase.from('products').update({ hpp_template_id: id, cost_price: amount }).in('id', product_ids);
    }
    res.json({ message: "Success" });
});

app.delete('/hpp-templates/:id', verifyToken, ownerOnly, async (req, res) => {
    const { id } = req.params;
    await supabase.from('products').update({ hpp_template_id: null }).eq('hpp_template_id', id);
    const { error } = await supabase.from('hpp_templates').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Template HPP dihapus" });
});

app.get('/service-accounts', verifyToken, ownerOnly, async (req, res) => {
    const { data, error } = await supabase.from('service_accounts').select('id, role_name, email, allowed_features, created_at').order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/service-accounts', verifyToken, ownerOnly, async (req, res) => {
    const { role_name, email, password, allowed_features } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from('service_accounts').insert([{ role_name, email, password: hashed, allowed_features }]).select();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data.map(d => ({ ...d, password: undefined })));
});

app.put('/service-accounts/:id', verifyToken, ownerOnly, async (req, res) => {
    const { id } = req.params;
    const { role_name, email, password, allowed_features } = req.body;
    const updateData = { role_name, email, allowed_features };
    if (password) {
        updateData.password = await bcrypt.hash(password, 10);
    }
    const { data, error } = await supabase.from('service_accounts').update(updateData).eq('id', id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data.map(d => ({ ...d, password: undefined })));
});

app.delete('/service-accounts/:id', verifyToken, ownerOnly, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('service_accounts').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Akun service dihapus" });
});

app.get('/shift-closings', verifyToken, async (req, res) => {
    const { data, error } = await supabase.from('shift_closings').select('*').order('closed_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/shift-closings', verifyToken, async (req, res) => {
    const { cashier_name } = req.body;
    
    if (!cashier_name) {
        return res.status(400).json({ error: 'Nama kasir harus diisi' });
    }

    try {
        // 1. Ambil waktu penutupan terakhir
        const { data: lastClosing, error: lastError } = await supabase
            .from('shift_closings')
            .select('closed_at')
            .order('closed_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (lastError) throw lastError;

        // 2. Hitung total revenue dan orders secara mandiri di server (Anti-Fraud)
        let query = supabase.from('transactions').select('id, grand_total, created_at');
        
        if (lastClosing) {
            query = query.gt('created_at', lastClosing.closed_at);
        }

        const { data: transactions, error: trxError } = await query;
        if (trxError) throw trxError;

        if (!transactions || transactions.length === 0) {
            return res.status(400).json({ error: 'Tidak ada transaksi baru untuk ditutup' });
        }

        const server_total_revenue = transactions.reduce((sum, t) => sum + Number(t.grand_total), 0);
        const server_total_orders = transactions.length;

        // 3. Simpan data penutupan dengan angka hasil perhitungan server
        const { data: closingData, error: closingError } = await supabase
            .from('shift_closings')
            .insert([{ 
                cashier_name: cashier_name.trim(), 
                total_revenue: server_total_revenue, 
                total_orders: server_total_orders,
                // Kita simpan snapshot ID transaksi yang ditutup untuk audit trail
                transactions_detail: JSON.stringify(transactions.map(t => t.id))
            }])
            .select();

        if (closingError) throw closingError;

        res.status(201).json({
            message: 'Penutupan kasir berhasil (Terverifikasi Server)',
            data: closingData[0]
        });
    } catch (error) {
        console.error('Shift closing error:', error);
        res.status(500).json({ error: 'Gagal memproses penutupan kasir secara aman' });
    }
});

app.get('/transactions', verifyToken, async (req, res) => {
    const { account } = req.query;
    let query = supabase.from('transactions').select(`*, transaction_details (quantity, subtotal, product_id, products (id, product_name, image_url, cost_price))`).order('created_at', { ascending: false });
    
    if (account) {
        query = query.eq('created_by_account', account);
    }

    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
});

app.post('/transactions', verifyToken, createTransaction);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;