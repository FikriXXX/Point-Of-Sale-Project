import React, { useState, useEffect } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';

const Icon = ({ n, size = 16, className = "", style = {} }) => {
    const paths = {
        check: <><polyline points="20 6 9 17 4 12" /></>,
        user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
        clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></>,
        clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
        dollar: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
        shopping: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
        alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
    };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[n]}</svg>;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  .tk-root { min-height: 100%; background: var(--bg-app); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; padding: 24px; display: flex; flex-direction: column; align-items: center; transition: background 0.3s; }
  
  .tk-header { width: 100%; max-width: 600px; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; }
  .tk-header-left { display: flex; align-items: center; gap: 16px; }
  .tk-icon-box { width: 48px; height: 48px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
  .tk-title { font-size: 22px; font-weight: 800; color: var(--text-main); }
  .tk-sub { font-size: 12px; color: var(--text-sub); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
  
  .tk-clock-box { background: var(--bg-card); padding: 8px 16px; border-radius: 10px; border: 1px solid var(--border); display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 700; color: var(--text-sub); }

  .tk-card { background: var(--bg-card); border-radius: 24px; padding: 32px; width: 100%; max-width: 600px; border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
  
  .tk-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .tk-summary-item { background: var(--bg-app); border: 1px solid var(--border); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 4px; }
  .tk-summary-item.highlight { background: var(--header-role-bg); border-color: var(--primary-soft); grid-column: span 2; }
  .tk-sum-label { font-size: 11px; font-weight: 700; color: var(--text-sub); text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
  .tk-sum-value { font-size: 18px; font-weight: 800; color: var(--text-main); }
  .tk-sum-value.large { font-size: 28px; color: var(--primary); }
  
  .tk-form { display: flex; flex-direction: column; gap: 20px; }
  .tk-input-group { display: flex; flex-direction: column; gap: 8px; }
  .tk-label { font-size: 13px; font-weight: 700; color: var(--text-sub); }
  .tk-input-wrap { position: relative; }
  .tk-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-sub); }
  .tk-input { width: 100%; padding: 14px 14px 14px 44px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 12px; font-family: inherit; font-size: 15px; font-weight: 700; color: var(--text-main); outline: none; transition: all 0.2s; }
  .tk-input:focus { border-color: #10B981; background: var(--bg-card); box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }
  .tk-input:disabled { opacity: 0.6; cursor: not-allowed; }

  .tk-btn-submit { width: 100%; padding: 16px; background: #10B981; border: none; border-radius: 12px; color: white; font-family: inherit; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
  .tk-btn-submit:hover:not(:disabled) { background: #059669; transform: translateY(-1px); }
  .tk-btn-submit:disabled { background: var(--border); color: var(--text-sub); cursor: not-allowed; box-shadow: none; }

  .tk-history-section { width: 100%; max-width: 600px; margin-top: 48px; }
  .tk-history-title { font-size: 16px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .tk-history-list { display: flex; flex-direction: column; gap: 12px; }
  .tk-history-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
  .tk-history-card:hover { border-color: var(--text-sub); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
  .tk-hist-name { font-size: 14px; font-weight: 800; color: var(--text-main); }
  .tk-hist-meta { font-size: 12px; color: var(--text-sub); font-weight: 600; margin-top: 2px; }
  .tk-hist-val { font-size: 15px; font-weight: 800; color: #10B981; }

  .tk-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .tk-modal { background: var(--bg-card); border-radius: 24px; padding: 32px; width: 100%; max-width: 400px; text-align: center; border: 1px solid var(--border); }
  .tk-modal-icon { width: 64px; height: 64px; background: var(--header-role-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 20px; }
  .tk-modal-title { font-size: 20px; font-weight: 800; color: var(--text-main); margin-bottom: 12px; }
  .tk-modal-desc { font-size: 14px; color: var(--text-sub); font-weight: 600; line-height: 1.6; margin-bottom: 24px; }
  .tk-modal-actions { display: flex; gap: 12px; }
  .tk-modal-btn { flex: 1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; border: none; }
  .tk-btn-cancel { background: var(--bg-field); color: var(--text-sub); }
  .tk-btn-confirm { background: #10B981; color: white; }
  .tk-btn-confirm:hover { background: #059669; }

  @media (max-width: 640px) {
    .tk-root { padding: 16px; }
    .tk-summary-grid { grid-template-columns: 1fr; }
    .tk-summary-item.highlight { grid-column: span 1; }
    .tk-header { flex-direction: column; align-items: flex-start; gap: 16px; }
    .tk-clock-box { width: 100%; justify-content: center; }
  }
`;

export default function TutupKasir() {
    const [cashierName, setCashierName] = useState('');
    const [shiftData, setShiftData] = useState({ totalRevenue: 0, totalOrders: 0, activeTransactions: [] });
    const [closings, setClosings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        loadDashboardData();
        const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
        return () => clearInterval(timer);
    }, []);

    const loadDashboardData = async () => {
        try {
            const clsRes = await api.get('/shift-closings');
            const closingList = clsRes.data || [];
            setClosings(closingList);

            const lastClosingTime = closingList.length > 0 ? dayjs(closingList[0].closed_at) : null;

            const currentAccountObj = localStorage.getItem('custom_service_session');
            let accountParam = '';
            if (currentAccountObj) {
                try {
                    const parsed = JSON.parse(currentAccountObj);
                    if (parsed && parsed.user && parsed.user.email) {
                        accountParam = `?account=${parsed.user.email}`;
                    }
                } catch (e) { }
            }

            const trxRes = await api.get(`/transactions${accountParam}`);
            const allTrx = trxRes.data || [];

            const activeTrx = allTrx.filter(t => {
                if (!lastClosingTime) return true;
                return dayjs(t.created_at).isAfter(lastClosingTime);
            });

            const totalRev = activeTrx.reduce((sum, t) => sum + Number(t.grand_total), 0);

            setShiftData({
                totalRevenue: totalRev,
                totalOrders: activeTrx.length,
                activeTransactions: activeTrx
            });
        } catch (e) { }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setShowConfirm(false);
        try {
            const slimTrx = shiftData.activeTransactions.map(t => ({
                id: t.id,
                customer_name: t.customer_name,
                grand_total: t.grand_total,
                payment_method: t.payment_method,
                created_at: t.created_at,
                transaction_details: (t.transaction_details || []).map(d => ({
                    quantity: d.quantity,
                    subtotal: d.subtotal,
                    products: d.products ? { product_name: d.products.product_name } : null
                }))
            }));

            await api.post('/shift-closings', {
                cashier_name: cashierName.trim(),
                total_revenue: shiftData.totalRevenue,
                total_orders: shiftData.totalOrders,
                transactions_detail: JSON.stringify(slimTrx)
            });

            setCashierName('');
            await loadDashboardData();
            alert('Penutupan kasir berhasil! Shift telah direset.');
        } catch (err) {
            const msg = err.response?.data?.error || 'Gagal mencatat penutupan kasir.';
            alert(msg);
        }
        setLoading(false);
    };

    const triggerConfirm = (e) => {
        e.preventDefault();
        if (!cashierName.trim()) return;
        if (shiftData.totalOrders === 0) {
            alert('Shift saat ini masih kosong.');
            return;
        }
        setShowConfirm(true);
    };

    return (
        <>
            <style>{styles}</style>
            <div className="tk-root">
                <div className="tk-header">
                    <div className="tk-header-left">
                        <div className="tk-icon-box"><Icon n="check" size={24} /></div>
                        <div style={{ textAlign: 'left' }}>
                            <div className="tk-title">Tutup Shift Kasir</div>
                            <div className="tk-sub">Rekapitulasi & Penutupan Harian</div>
                        </div>
                    </div>
                    <div className="tk-clock-box">
                        <Icon n="clock" size={18} style={{ color: '#10B981' }} />
                        {currentTime.format('HH:mm:ss')}
                    </div>
                </div>

                <div className="tk-card">
                    <div className="tk-summary-grid">
                        <div className="tk-summary-item">
                            <span className="tk-sum-label"><Icon n="shopping" size={14} /> Total Pesanan</span>
                            <span className="tk-sum-value">{shiftData.totalOrders} Order</span>
                        </div>
                        <div className="tk-summary-item">
                            <span className="tk-sum-label"><Icon n="user" size={14} /> Status Shift</span>
                            <span className="tk-sum-value" style={{ color: shiftData.totalOrders > 0 ? '#10B981' : '#64748B', fontSize: '14px' }}>
                                {shiftData.totalOrders > 0 ? 'Aktif Menunggu' : 'Tereset / Kosong'}
                            </span>
                        </div>
                        <div className="tk-summary-item highlight">
                            <span className="tk-sum-label"><Icon n="dollar" size={14} /> Total Pendapatan Shift Ini</span>
                            <span className="tk-sum-value large">Rp {shiftData.totalRevenue.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <form className="tk-form" onSubmit={triggerConfirm}>
                        <div className="tk-input-group">
                            <label className="tk-label">Nama Kasir yang Menutup</label>
                            <div className="tk-input-wrap">
                                <span className="tk-input-icon"><Icon n="user" size={18} /></span>
                                <input
                                    type="text"
                                    className="tk-input"
                                    placeholder="Ketik nama lengkap Anda..."
                                    value={cashierName}
                                    onChange={e => setCashierName(e.target.value)}
                                    disabled={shiftData.totalOrders === 0}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="tk-btn-submit" disabled={shiftData.totalOrders === 0 || loading}>
                            <Icon n="check" size={20} />
                            {loading ? 'Memproses...' : 'Tutup Shift & Reset Akumulator'}
                        </button>
                    </form>
                </div>

                <div className="tk-history-section">
                    <div className="tk-history-title">
                        <Icon n="clipboard" size={20} style={{ color: '#D97706' }} />
                        Riwayat Penutupan Terakhir
                    </div>
                    <div className="tk-history-list">
                        {closings.length === 0 ? (
                            <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '20px', border: '1px dashed #E2E8F0', color: '#94A3B8', fontWeight: '600', fontSize: '14px' }}>
                                Belum ada riwayat penutupan.
                            </div>
                        ) : (
                            closings.slice(0, 5).map(c => (
                                <div key={c.id} className="tk-history-card">
                                    <div style={{ textAlign: 'left' }}>
                                        <div className="tk-hist-name">{c.cashier_name}</div>
                                        <div className="tk-hist-meta">{dayjs(c.closed_at).format('DD MMM YYYY, HH:mm')} • {c.total_orders} Pesanan</div>
                                    </div>
                                    <div className="tk-hist-val">Rp {Number(c.total_revenue).toLocaleString('id-ID')}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {showConfirm && (
                    <div className="tk-modal-overlay">
                        <div className="tk-modal">
                            <div className="tk-modal-icon"><Icon n="alert" size={32} /></div>
                            <div className="tk-modal-title">Konfirmasi Tutup Shift?</div>
                            <div className="tk-modal-desc">
                                Anda akan menutup shift dengan total pendapatan 
                                <strong> Rp {shiftData.totalRevenue.toLocaleString('id-ID')}</strong>. 
                                Tindakan ini akan mereset data shift aktif.
                            </div>
                            <div className="tk-modal-actions">
                                <button className="tk-modal-btn tk-btn-cancel" onClick={() => setShowConfirm(false)}>Batal</button>
                                <button className="tk-modal-btn tk-btn-confirm" onClick={handleSubmit}>Ya, Tutup Shift</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}