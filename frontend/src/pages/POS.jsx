import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';

const Icon = ({ n, size = 16, className = "", style = {} }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    minus: <><line x1="5" y1="12" x2="19" y2="12" /></>,
    cash: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01" /><path d="M18 12h.01" /></>,
    qris: <><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></>,
    bank: <><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    pause: <><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    coffee: <><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></>,
    food: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></>,
    box: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[n]}</svg>;
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
.pos-root { display: flex; height: 100%; background: var(--bg-app); font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text-main); overflow: hidden; transition: background 0.3s; }
.pos-left { flex: 2.5; display: flex; flex-direction: column; background: var(--bg-app); border-right: 1px solid var(--border); overflow: hidden; transition: background 0.3s, border 0.3s; }
.pos-header { padding: 16px 20px; background: var(--bg-card); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; transition: background 0.3s, border 0.3s; }
.pos-header-left { display: flex; align-items: center; gap: 12px; }
.pos-logo { width: 36px; height: 36px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: 800; font-size: 15px; }
.pos-title-box { display: flex; flex-direction: column; text-align: left; }
.pos-title { font-size: 16px; font-weight: 800; color: var(--text-main); }
.pos-subtitle { font-size: 11px; color: var(--text-sub); font-weight: 600; margin-top: 1px; }
.pos-search { padding: 12px 20px; background: var(--bg-card); border-bottom: 1px solid var(--border); position: relative; display: flex; align-items: center; flex-shrink: 0; transition: background 0.3s, border 0.3s; }
.pos-search-icon { position: absolute; left: 36px; color: var(--text-sub); display: flex; }
.pos-search input { width: 100%; padding: 12px 16px 12px 44px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 10px; color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; outline: none; transition: all 0.2s; }
.pos-search input:focus { border-color: var(--primary); background: var(--bg-card); box-shadow: 0 0 0 3px var(--primary-soft); }
.pos-search input::placeholder { color: var(--text-sub); opacity: 0.7; }
.pos-category-bar { display: flex; gap: 8px; padding: 12px 20px; border-bottom: 1px solid var(--border); overflow-x: auto; background: var(--bg-app); flex-shrink: 0; }
.pos-category-bar::-webkit-scrollbar { height: 0; display: none; }
.cat-btn { padding: 8px 16px; border-radius: 10px; border: 2px solid var(--border); background: var(--bg-card); color: var(--text-sub); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
.cat-btn:hover { border-color: var(--primary); color: var(--primary); }
.cat-btn.active { background: var(--primary); border-color: var(--primary); color: #FFFFFF; }
.pos-grid { flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; padding: 16px 20px; overflow-y: auto; align-content: start; }
.product-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; padding: 12px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px; }
.product-card:hover { border-color: var(--primary); box-shadow: 0 4px 12px var(--primary-soft); }
.product-card.out-of-stock { opacity: 0.4; pointer-events: none; }
.product-img-box { width: 56px; height: 56px; border-radius: 10px; background: var(--primary-soft); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--border); flex-shrink: 0; }
.product-img-box img { width: 100%; height: 100%; object-fit: cover; display: block; }
.product-info { display: flex; flex-direction: column; flex: 1; min-width: 0; text-align: left; }
.product-name { font-size: 13px; font-weight: 800; color: var(--text-main); margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-price { font-size: 14px; font-weight: 800; color: var(--primary); }
.product-stock { font-size: 10px; color: var(--text-sub); font-weight: 700; margin-top: 4px; }
.product-stock.low { color: #EF4444; }
.pos-right { flex: 1; display: flex; flex-direction: column; background: var(--bg-card); min-width: 360px; max-width: 420px; box-shadow: -2px 0 12px rgba(0,0,0,0.03); z-index: 10; transition: background 0.3s; }
.cart-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg-app); flex-shrink: 0; }
.cart-title { font-size: 16px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
.cart-clear { background: #FEF2F2; border: none; color: #EF4444; padding: 6px 12px; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: all 0.2s; }
[data-theme='dark'] .cart-clear { background: #450a0a; color: #f87171; }
.cart-clear:hover { background: #FEE2E2; }
.customer-box { padding: 16px 20px 0; flex-shrink: 0; }
.customer-input-wrap { position: relative; display: flex; align-items: center; }
.customer-icon { position: absolute; left: 14px; color: var(--text-sub); display: flex; }
.customer-input { width: 100%; padding: 12px 14px 12px 42px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; color: var(--text-main); outline: none; transition: all 0.2s; }
.customer-input:focus { border-color: var(--primary); background: var(--bg-card); box-shadow: 0 0 0 3px var(--primary-soft); }
.customer-input::placeholder { color: var(--text-sub); opacity: 0.7; }
.cart-items { flex: 1; overflow-y: auto; padding: 8px 20px; }
.cart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 8px; color: var(--text-sub); font-weight: 600; font-size: 13px; }
.cart-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); gap: 10px; }
.cart-item-thumb { width: 40px; height: 40px; border-radius: 8px; background: var(--primary-soft); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--border); flex-shrink: 0; }
.cart-item-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cart-item-left { display: flex; flex-direction: column; gap: 2px; text-align: left; flex: 1; min-width: 0; }
.cart-item-name { font-size: 13px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-item-price { font-size: 12px; font-weight: 800; color: var(--primary); }
.qty-control { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.qty-btn { width: 30px; height: 30px; background: var(--bg-app); border: none; border-radius: 8px; color: var(--text-main); font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; border: 1px solid var(--border); }
.qty-btn:hover { background: var(--border); }
.qty-value { width: 22px; text-align: center; font-size: 13px; font-weight: 800; color: var(--text-main); }
.payment-section { padding: 16px 20px; background: var(--bg-app); border-top: 1px solid var(--border); flex-shrink: 0; transition: background 0.3s; }
.total-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; font-size: 13px; font-weight: 700; color: var(--text-sub); }
.discount-input { width: 110px; padding: 8px 10px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; color: var(--text-main); text-align: right; outline: none; transition: 0.2s; }
.discount-input:focus { border-color: var(--primary); }
.grand-total-box { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; margin: 12px 0; border-top: 2px dashed var(--border); border-bottom: 2px dashed var(--border); }
.grand-total-label { font-size: 15px; font-weight: 800; color: var(--text-main); }
.grand-total-val { font-size: 20px; font-weight: 800; color: var(--primary); }
.pay-methods { display: flex; gap: 8px; margin-bottom: 12px; }
.pay-btn { flex: 1; padding: 10px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 10px; color: var(--text-sub); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
.pay-btn:hover { border-color: var(--primary); color: var(--primary); }
.pay-btn.active { background: var(--primary); border-color: var(--primary); color: #FFFFFF; }
.cash-input { width: 100%; padding: 12px 14px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; color: var(--text-main); outline: none; transition: all 0.2s; margin-bottom: 10px; }
.cash-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); }
.cash-input::placeholder { color: var(--text-sub); opacity: 0.7; }
.change-box { display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #ECFDF5; border: 2px solid #A7F3D0; border-radius: 10px; color: #059669; font-size: 13px; font-weight: 800; margin-bottom: 10px; }
[data-theme='dark'] .change-box { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
.pos-actions { display: flex; gap: 10px; margin-top: 6px; }
.btn-hold { flex: 1; padding: 14px; background: var(--header-role-bg); border: 2px solid var(--primary-soft); border-radius: 10px; color: var(--primary); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
.btn-hold:hover:not(:disabled) { background: var(--primary-soft); }
.btn-hold:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-checkout { flex: 2; padding: 14px; background: #10B981; border: none; border-radius: 10px; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
.btn-checkout:hover:not(:disabled) { background: #059669; }
.btn-checkout:disabled { background: var(--border); color: var(--text-sub); box-shadow: none; cursor: not-allowed; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(17,24,39,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); padding: 20px; }
.qris-modal { background: var(--bg-card); padding: 32px; border-radius: 20px; border: 1px solid var(--border); text-align: center; width: 100%; max-width: 360px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
.qris-title { font-size: 18px; font-weight: 800; color: var(--text-main); margin-bottom: 6px; }
.qris-amount { font-size: 24px; font-weight: 800; color: var(--primary); margin-bottom: 20px; }
.qris-box { background: white; padding: 16px; border-radius: 16px; border: 2px solid var(--border); display: inline-block; margin-bottom: 20px; }
.qris-box img { max-width: 180px; width: 100%; height: auto; }
.qris-btn-sim { width: 100%; padding: 14px; background: #10B981; border: none; border-radius: 10px; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; }
.qris-btn-sim:hover { background: #059669; }
.qris-btn-cancel { width: 100%; padding: 14px; background: #FEF2F2; border: none; border-radius: 10px; color: #EF4444; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; }
[data-theme='dark'] .qris-btn-cancel { background: #450a0a; color: #f87171; }
.qris-btn-cancel:hover { background: #FEE2E2; }
.mobile-cart-toggle { display: none; position: fixed; bottom: 80px; right: 16px; z-index: 99; width: 56px; height: 56px; border-radius: 50%; background: var(--primary); border: none; color: white; cursor: pointer; box-shadow: 0 4px 16px var(--primary-soft); align-items: center; justify-content: center; }
.mobile-cart-badge { position: absolute; top: -4px; right: -4px; background: #EF4444; color: white; font-size: 11px; font-weight: 800; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
@media (max-width: 1024px) {
  .pos-root { flex-direction: column; height: 100%; overflow-y: auto; }
  .pos-left { flex: none; width: 100%; border-right: none; border-bottom: 1px solid var(--border); min-height: 50vh; }
  .pos-right { flex: none; width: 100%; min-width: 0; max-width: none; }
  .pos-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .mobile-cart-toggle { display: flex; }
}
@media (max-width: 480px) {
  .pos-header { padding: 12px 16px; }
  .pos-logo { display: none; }
  .pos-search { padding: 10px 16px; }
  .pos-search-icon { left: 30px; }
  .pos-category-bar { padding: 10px 16px; gap: 6px; }
  .cat-btn { padding: 7px 12px; font-size: 11px; }
  .pos-grid { padding: 12px 16px; gap: 10px; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .product-card { padding: 10px; gap: 10px; }
  .product-img-box { width: 44px; height: 44px; border-radius: 8px; }
  .product-name { font-size: 12px; }
  .product-price { font-size: 13px; }
  .cart-header { padding: 12px 16px; }
  .customer-box { padding: 12px 16px 0; }
  .cart-items { padding: 8px 16px; }
  .payment-section { padding: 14px 16px; }
  .grand-total-val { font-size: 18px; }
}
.pos-toast { position: fixed; top: 20px; right: 20px; background: #10B981; color: #fff; padding: 12px 20px; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; z-index: 2000; animation: toastIn 0.3s ease; box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
@keyframes toastIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
.quick-cash-group { display: flex; gap: 8px; margin-bottom: 10px; }
.quick-cash-btn { flex: 1; padding: 8px; background: var(--header-role-bg); border: 2px solid var(--primary-soft); border-radius: 8px; color: var(--primary); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
.quick-cash-btn:hover { background: var(--primary-soft); border-color: var(--primary); }
.pos-loading-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 50; }
.pos-spinner { width: 36px; height: 36px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
`;

const CATEGORY_ICONS = { 'Makanan': 'food', 'Minuman': 'coffee', 'Kopi': 'coffee', 'Snack': 'box', 'Dessert': 'food', 'Sembako': 'box', 'default': 'box' };
const formatID = (id, prefix) => id ? `${prefix}-${String(id).substring(0, 5).toUpperCase()}` : '';

// Utility untuk mencegah XSS
const escapeHtml = (unsafe) => {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const getCurrentAccount = () => {
  const savedCustom = localStorage.getItem('custom_service_session');
  if (savedCustom) {
    try { return JSON.parse(savedCustom).user?.email || "custom_role"; } catch (e) { }
  }
  return "owner";
};

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cashReceived, setCashReceived] = useState('');
  const [discount, setDiscount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [customerName, setCustomerName] = useState('');
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [qrisStatus, setQrisStatus] = useState('waiting');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const lastKeyTime = useRef(0);
  const barcodeBuffer = useRef('');

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { if (searchRef.current) searchRef.current.focus(); }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'F2') { e.preventDefault(); searchRef.current?.focus(); }
      else if (e.key === 'Escape') { setCart([]); setDiscount(''); setCustomerName(''); }
      else if (e.key === 'Enter' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        if (cart.length > 0 && (paymentMethod !== 'cash' || cashNum >= grandTotal)) handleCheckoutInitiate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  // Barcode scanner detection
  const handleSearchKeyDown = (e) => {
    const now = Date.now();
    if (e.key === 'Enter' && barcodeBuffer.current.length > 2) {
      e.preventDefault();
      const code = barcodeBuffer.current;
      const found = products.find(p => p.product_name === code || p.barcode === code);
      if (found) { addToCart(found); setSearch(''); }
      barcodeBuffer.current = '';
      lastKeyTime.current = 0;
      return;
    }
    if (e.key.length === 1) {
      if (now - lastKeyTime.current < 50) { barcodeBuffer.current += e.key; }
      else { barcodeBuffer.current = e.key; }
      lastKeyTime.current = now;
    }
  };

  // Hold bill count
  const getHoldCount = () => {
    try {
      const bills = JSON.parse(localStorage.getItem('pos_bills') || '[]');
      return bills.filter(b => b.account === getCurrentAccount()).length;
    } catch { return 0; }
  };
  const holdCount = getHoldCount();

  const fetchProducts = async () => {
    setLoading(true);
    try { const res = await api.get('/products'); setProducts(res.data); }
    catch { }
    finally { setLoading(false); }
  };

  const categories = ['Semua', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filtered = products.filter(p => (activeCategory === 'Semua' || p.category === activeCategory) && p.product_name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (product) => {
    if (product.stock === 0) return;
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * Number(i.price) } : i);
      }
      return [...prev, {
        product_id: product.id,
        name: product.product_name,
        price: Number(product.price),
        quantity: 1,
        subtotal: Number(product.price),
        image_url: product.image_url,
        category: product.category,
        max_stock: product.stock
      }];
    });
    setToast(`+ ${product.product_name}`);
    setTimeout(() => setToast(''), 2000);
  };

  const changeQty = (id, delta) => setCart(prev => prev.map(i => {
    if (i.product_id !== id) return i;
    const newQty = i.quantity + delta;
    if (newQty > i.max_stock) return i;
    return { ...i, quantity: newQty, subtotal: newQty * i.price };
  }).filter(i => i.quantity > 0));

  const totalHarga = cart.reduce((sum, i) => sum + i.subtotal, 0);
  const discountNum = Math.max(0, Number(discount) || 0);
  const grandTotal = Math.max(0, totalHarga - discountNum);
  const cashNum = Number(cashReceived) || 0;
  const kembalian = cashNum - grandTotal;

  const handleSaveBill = () => {
    if (cart.length === 0) return;
    if (!customerName.trim()) return;
    const currentAccount = getCurrentAccount();
    const savedBills = JSON.parse(localStorage.getItem('pos_bills') || '[]');
    const newBill = {
      id: Date.now(),
      customerName: customerName.trim(),
      cart,
      discount: discountNum,
      totalHarga,
      grandTotal,
      paymentMethod,
      account: currentAccount,
      time: dayjs().format('DD MMM YYYY, HH:mm')
    };
    localStorage.setItem('pos_bills', JSON.stringify([...savedBills, newBill]));
    setCart([]); setCustomerName(''); setDiscount(''); setCashReceived('');
  };

  const printReceipt = (cartItems, total, disc, grand, method, cash, change, trxId, custName) => {
    const printWindow = window.open('', '', 'width=350,height=600');
    if (!printWindow) return;
    const itemsHtml = cartItems.map(item => `
            <tr><td colspan="2" style="padding-top:5px; font-weight:bold;">${escapeHtml(item.name)}</td></tr>
            <tr><td style="color:#555;">${item.quantity} x ${item.price.toLocaleString()}</td><td style="text-align:right;">${item.subtotal.toLocaleString()}</td></tr>
        `).join('');
    printWindow.document.write(`
            <html><head><title>Struk</title><style>
            body { font-family: monospace; font-size: 12px; padding: 20px; }
            .center { text-align: center; } .right { text-align: right; }
            .line { border-bottom: 1px dashed #000; margin: 10px 0; }
            table { width: 100%; font-size: 12px; border-collapse: collapse; }
            </style></head><body>
            <div class="center"><h2 style="margin-bottom: 5px;">STRUK PENJUALAN</h2><p style="margin: 0;">${new Date().toLocaleString('id-ID')}</p><p style="margin-top: 5px; font-weight: bold;">ID: ${formatID(trxId, 'TRX')}</p></div>
            <div class="line"></div>
            <div style="margin-bottom: 10px;">Pelanggan: <strong>${escapeHtml(custName)}</strong></div>
            <table>${itemsHtml}</table><div class="line"></div>
            <table>
                <tr><td>Subtotal</td><td class="right">${total.toLocaleString()}</td></tr>
                ${disc > 0 ? `<tr><td>Diskon</td><td class="right">-${disc.toLocaleString()}</td></tr>` : ''}
                <tr style="font-weight:bold;"><td style="font-size:14px;">TOTAL</td><td class="right" style="font-size:14px;">${grand.toLocaleString()}</td></tr>
            </table><div class="line"></div>
            <table>
                <tr><td>Metode</td><td class="right" style="text-transform:uppercase;">${method}</td></tr>
                ${method === 'cash' ? `<tr><td>Tunai</td><td class="right">${cash.toLocaleString()}</td></tr><tr><td>Kembali</td><td class="right">${change.toLocaleString()}</td></tr>` : ''}
            </table>
            <div class="center" style="margin-top:20px;"><p>Terima Kasih!</p></div>
            <script>window.onload = function() { window.print(); window.close(); }</script></body></html>
        `);
    printWindow.document.close();
  };

  const processTransaction = async () => {
    const finalName = customerName.trim() || 'Umum';
    const currentAccount = getCurrentAccount();
    const payload = {
      total_price: totalHarga, discount: discountNum, grand_total: grandTotal, payment_method: paymentMethod,
      cash_received: paymentMethod === 'cash' ? cashNum : grandTotal, change_amount: paymentMethod === 'cash' ? kembalian : 0,
      customer_name: finalName, items: cart, created_by_account: currentAccount
    };
    try {
      const res = await api.post('/transactions', payload);
      const trxId = (res.data && res.data[0] && res.data[0].id) ? res.data[0].id : 'NEW';
      printReceipt(cart, totalHarga, discountNum, grandTotal, paymentMethod, paymentMethod === 'cash' ? cashNum : grandTotal, kembalian, trxId, finalName);
      setCart([]); setCashReceived(''); setDiscount(''); setCustomerName(''); setShowQRISModal(false); fetchProducts();
    } catch (err) {
      const msg = err.response?.data?.error || 'Gagal memproses transaksi. Periksa koneksi.';
      alert(msg);
      setShowQRISModal(false);
    }
  };

  const handleCheckoutInitiate = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'cash' && cashNum < grandTotal) return;
    if (paymentMethod === 'QRIS') {
      setQrisStatus('waiting'); setShowQRISModal(true);
    } else {
      if (!window.confirm(`Proses pembayaran Rp ${grandTotal.toLocaleString()}?`)) return;
      processTransaction();
    }
  };

  return (
    <>
      <style>{styles}</style>
      {toast && <div className="pos-toast">{toast}</div>}
      {showQRISModal && (
        <div className="modal-overlay">
          <div className="qris-modal">
            <div className="qris-title">Scan QRIS</div>
            <div className="qris-amount">Rp {grandTotal.toLocaleString()}</div>
            {qrisStatus === 'waiting' ? (
              <>
                <div className="qris-box"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Tagihan_Kasir_Rp${grandTotal}`} alt="QRIS Code" /></div>
                <button className="qris-btn-sim" onClick={() => { setQrisStatus('success'); setTimeout(processTransaction, 1500); }}><Icon n="check" /> Simulasi Scan Berhasil</button>
                <button className="qris-btn-cancel" onClick={() => setShowQRISModal(false)}>Batalkan</button>
              </>
            ) : (<h3 style={{ color: '#10b981', marginTop: '20px' }}>Berhasil! Mencetak struk...</h3>)}
          </div>
        </div>
      )}
      <div className="pos-root">
        <div className="pos-left">
          <div className="pos-header">
            <div className="pos-header-left">
              <div className="pos-logo">PS</div>
              <div className="pos-title-box">
                <div className="pos-title">Putro Sales POS</div>
                <div className="pos-subtitle">KASIR AKTIF • {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </div>
          <div className="pos-search">
            <span className="pos-search-icon"><Icon n="search" size={18} /></span>
            <input ref={searchRef} placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={handleSearchKeyDown} />
          </div>
          <div className="pos-category-bar">{categories.map(c => <button key={c} className={`cat-btn ${activeCategory === c ? 'active' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>)}</div>
          <div className="pos-grid" style={{ position: 'relative' }}>
            {loading && <div className="pos-loading-overlay"><div className="pos-spinner" /></div>}
            {filtered.map(p => (
              <div key={p.id} className={`product-card ${p.stock === 0 ? 'out-of-stock' : ''}`} onClick={() => addToCart(p)}>
                <div className="product-img-box">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" />
                  ) : (
                    <Icon n={CATEGORY_ICONS[p.category] || 'box'} size={28} style={{ color: '#D97706' }} />
                  )}
                </div>
                <div className="product-info">
                  <div>
                    <div className="product-name">{p.product_name}</div>
                    <div className="product-price">Rp {Number(p.price).toLocaleString()}</div>
                  </div>
                  <div className={`product-stock ${p.stock <= 5 ? 'low' : ''}`}>
                    <span>Stok: {p.stock === 0 ? 'Habis' : p.stock}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pos-right">
          <div className="cart-header">
            <div className="cart-title"><Icon n="cart" /> Keranjang ({cart.reduce((s, i) => s + i.quantity, 0)})</div>
            {cart.length > 0 && <button className="cart-clear" onClick={() => { setCart([]); setDiscount(''); setCustomerName(''); }}><Icon n="x" size={14} /> Kosongkan</button>}
          </div>
          <div className="customer-box">
            <div className="customer-input-wrap">
              <span className="customer-icon"><Icon n="user" /></span>
              <input type="text" className="customer-input" placeholder="Nama Pembeli..." value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? <div className="cart-empty">Belum ada pesanan</div> : cart.map(c => (
              <div key={c.product_id} className="cart-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div className="cart-item-thumb">
                    {c.image_url ? (
                      <img src={c.image_url} alt="" />
                    ) : (
                      <Icon n={CATEGORY_ICONS[c.category] || 'box'} size={20} style={{ color: '#D97706' }} />
                    )}
                  </div>
                  <div className="cart-item-left">
                    <div className="cart-item-name">{c.name}</div>
                    <div className="cart-item-price">Rp {c.subtotal.toLocaleString()}</div>
                  </div>
                </div>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => changeQty(c.product_id, -1)}><Icon n="minus" size={14} /></button>
                  <span className="qty-value">{c.quantity}</span>
                  <button className="qty-btn" onClick={() => changeQty(c.product_id, 1)}><Icon n="plus" size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="payment-section">
            <div className="total-row"><span style={{ color: '#D97706' }}>Diskon (Rp)</span><input type="number" className="discount-input" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} /></div>
            <div className="grand-total-box"><span className="grand-total-label">Total</span><span className="grand-total-val">Rp {grandTotal.toLocaleString()}</span></div>
            <div className="pay-methods">
              {['cash', 'QRIS', 'transfer'].map(m => (
                <button key={m} className={`pay-btn ${paymentMethod === m ? 'active' : ''}`} onClick={() => setPaymentMethod(m)}>
                  <Icon n={m === 'cash' ? 'cash' : m === 'QRIS' ? 'qris' : 'bank'} size={14} /> {m === 'cash' ? 'Tunai' : m === 'QRIS' ? 'QRIS' : 'Transfer'}
                </button>
              ))}
            </div>
            {paymentMethod === 'cash' && <input type="number" className="cash-input" placeholder="Uang Tunai Diterima" value={cashReceived} onChange={e => setCashReceived(e.target.value)} />}
            {paymentMethod === 'cash' && (
              <div className="quick-cash-group">
                <button className="quick-cash-btn" onClick={() => setCashReceived('50000')}>Rp 50.000</button>
                <button className="quick-cash-btn" onClick={() => setCashReceived('100000')}>Rp 100.000</button>
                <button className="quick-cash-btn" onClick={() => setCashReceived(String(grandTotal))}>Uang Pas</button>
              </div>
            )}
            {kembalian >= 0 && paymentMethod === 'cash' && cashNum > 0 && (
              <div className="change-box"><span>Kembalian</span><span>Rp {kembalian.toLocaleString()}</span></div>
            )}
            <div className="pos-actions">
              <button className="btn-hold" onClick={handleSaveBill} disabled={cart.length === 0}><Icon n="pause" size={16} /> Hold{holdCount > 0 ? ` (${holdCount})` : ''}</button>
              <button className="btn-checkout" onClick={handleCheckoutInitiate} disabled={cart.length === 0}><Icon n="check" size={18} /> Bayar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}