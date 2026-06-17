import React, { useState, useEffect } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const Icon = ({ n, size = 18, className = "", style = {} }) => {
  const paths = {
    trendingUp: <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />,
    shoppingCart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>,
    package: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
    alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      {paths[n]}
    </svg>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  
  .dash-root { 
    min-height: 100%; 
    background: var(--bg-app); 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    padding: 24px; 
    color: var(--text-main);
    animation: fadeIn 0.5s ease;
    transition: background 0.3s;
  }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .dash-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .dash-title-box { text-align: left; }
  .dash-title { font-size: 24px; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px; }
  .dash-sub { font-size: 13px; color: var(--text-sub); font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 8px; }
  .dash-status-dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }

  .dash-grid { 
    display: grid; 
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
    gap: 20px; 
    margin-bottom: 32px; 
  }
  
  .stat-card {
    position: relative;
    padding: 24px;
    border-radius: 24px;
    overflow: hidden;
    color: white;
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 140px;
    border: 1px solid rgba(255,255,255,0.1);
  }
  
  .stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
  
  .stat-card.emerald { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
  .stat-card.blue { background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); }
  .stat-card.amber { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }
  .stat-card.violet { background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); }
  
  .stat-card-glass {
    position: absolute;
    top: -20px;
    right: -20px;
    width: 100px;
    height: 100px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    backdrop-filter: blur(10px);
  }
  
  .stat-label { font-size: 12px; font-weight: 800; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value { font-size: 26px; font-weight: 800; margin-top: 8px; }
  .stat-icon { position: absolute; bottom: 20px; right: 20px; opacity: 0.3; }

  .main-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    margin-bottom: 32px;
  }

  .glass-panel {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    text-align: left;
    transition: background 0.3s, border 0.3s;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .panel-title { font-size: 16px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px; }
  .panel-title-icon { color: var(--primary); background: var(--primary-soft); padding: 8px; border-radius: 10px; }

  .chart-container { height: 300px; width: 100%; margin-top: 10px; }

  .dash-list { display: flex; flex-direction: column; gap: 12px; }
  .dash-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    background: var(--bg-app);
    border-radius: 16px;
    border: 1px solid var(--border);
    transition: all 0.2s;
  }
  
  .dash-item:hover { background: var(--primary-soft); transform: translateX(5px); }
  
  .item-info { display: flex; align-items: center; gap: 12px; }
  .item-rank { 
    width: 32px; height: 32px; background: var(--primary-soft); border-radius: 10px; 
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: var(--primary);
  }
  .item-name { font-size: 14px; font-weight: 700; color: var(--text-main); }
  .item-val { font-size: 14px; font-weight: 800; color: #10B981; }

  .low-stock-item { border-left: 4px solid #EF4444; }
  .stock-val { font-size: 12px; font-weight: 800; color: #EF4444; background: #FEF2F2; padding: 4px 10px; border-radius: 8px; }
  [data-theme='dark'] .stock-val { background: #450a0a; color: #f87171; }

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin-top: 24px;
  }
  
  .action-btn {
    background: var(--bg-card);
    border: 2px solid var(--border);
    padding: 16px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    color: var(--text-sub);
  }
  
  .action-btn:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-3px); }
  .action-icon { background: var(--primary-soft); color: var(--primary); padding: 10px; border-radius: 12px; }
  .action-label { font-size: 12px; font-weight: 800; }

  .btn-primary { 
    padding: 12px 24px; 
    background: var(--primary); 
    border: none; 
    border-radius: 12px; 
    color: white; 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    font-size: 14px; 
    font-weight: 800; 
    cursor: pointer; 
    transition: all 0.2s; 
    display: inline-flex; 
    align-items: center; 
    gap: 8px;
    box-shadow: 0 4px 12px rgba(217,119,6,0.2);
  }
  .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }

  .loading-box { 
    display: flex; flex-direction: column; align-items: center; justify-content: center; 
    height: 400px; color: var(--text-sub); 
  }
  .spinner { 
    width: 40px; height: 40px; border: 4px solid var(--border); border-top: 4px solid var(--primary); 
    border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  @media (max-width: 1024px) {
    .main-grid { grid-template-columns: 1fr; }
  }
  
  @media (max-width: 768px) {
    .dash-root { padding: 16px; }
    .dash-grid { grid-template-columns: 1fr; }
    .stat-card { min-height: 120px; }
    .stat-value { font-size: 22px; }
  }
`;

const StatCard = ({ label, value, color, icon }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-card-glass" />
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-icon"><Icon n={icon} size={48} /></div>
  </div>
);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [trxRes, prodRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/products')
      ]);
      const transactions = trxRes.data || [];
      const products = prodRes.data || [];
      
      // ... (rest of the processing logic)

      const today = dayjs().startOf('day');
      const todayTrx = transactions.filter(t => dayjs(t.created_at).isAfter(today));
      const omsetHariIni = todayTrx.reduce((s, t) => s + Number(t.grand_total), 0);
      const orderHariIni = todayTrx.length;

      // Produk terlaris
      const productSales = {};
      transactions.forEach(t => {
        (t.transaction_details || []).forEach(d => {
          const name = d.products?.product_name || 'Unknown';
          productSales[name] = (productSales[name] || 0) + d.quantity;
        });
      });
      const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));

      // Stok menipis
      const lowStock = products
        .filter(p => p.stock <= 5 && p.stock >= 0)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

      // Omset 7 hari (Chart Data)
      const last7Days = [];
      for(let i = 6; i >= 0; i--) {
        const d = dayjs().subtract(i, 'day');
        const label = d.format('DD MMM');
        const dailyTrx = transactions.filter(t => dayjs(t.created_at).isSame(d, 'day'));
        const total = dailyTrx.reduce((s, t) => s + Number(t.grand_total), 0);
        last7Days.push({ date: label, revenue: total });
      }

      const totalOmset7Hari = last7Days.reduce((s, d) => s + d.revenue, 0);

      setData({ 
        omsetHariIni, 
        orderHariIni, 
        omset7Hari: totalOmset7Hari, 
        totalProduk: products.length, 
        topProducts, 
        lowStock,
        chartData: last7Days
      });
    } catch (e) { 
      console.error(e); 
      setErrorMsg(e.response?.data?.error || e.message || 'Gagal terhubung ke server.');
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="dash-root">
      <style>{styles}</style>
      <div className="loading-box">
        <div className="spinner" />
        <p>Menyiapkan dashboard ceria Anda...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="dash-root">
      <style>{styles}</style>
      <div className="loading-box">
        <Icon n="alert" size={48} style={{ color: '#EF4444', marginBottom: '16px' }} />
        <p style={{ color: '#EF4444', fontWeight: 'bold' }}>Gagal Memuat Data Dashboard</p>
        <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '8px', maxWidth: '300px', textAlign: 'center' }}>
          Error: {errorMsg}
        </p>
        <button onClick={fetchDashboard} className="btn-primary" style={{ marginTop: '24px' }}>Coba Lagi</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="dash-root">
        <header className="dash-header">
          <div className="dash-title-box">
            <h1 className="dash-title">Halo, Admin!</h1>
            <div className="dash-sub">
              <span className="dash-status-dot" />
              Kasir Aktif • {dayjs().format('dddd, DD MMMM YYYY')}
            </div>
          </div>
        </header>

        <div className="dash-grid">
          <StatCard 
            label="Omset Hari Ini" 
            value={`Rp ${data.omsetHariIni.toLocaleString('id-ID')}`} 
            color="emerald" 
            icon="dollar" 
          />
          <StatCard 
            label="Order Hari Ini" 
            value={`${data.orderHariIni} Order`} 
            color="amber" 
            icon="shoppingCart" 
          />
          <StatCard 
            label="Total Pendapatan (7 Hari)" 
            value={`Rp ${data.omset7Hari.toLocaleString('id-ID')}`} 
            color="blue" 
            icon="trendingUp" 
          />
          <StatCard 
            label="Katalog Produk" 
            value={`${data.totalProduk} Item`} 
            color="violet" 
            icon="package" 
          />
        </div>

        <div className="main-grid">
          <div className="glass-panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="panel-title-icon"><Icon n="trendingUp" /></div>
                Grafik Penjualan Mingguan
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97706" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-sub)', fontSize: 12, fontWeight: 700 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-sub)', fontSize: 11, fontWeight: 700 }}
                    tickFormatter={(v) => `Rp ${v/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', background: 'var(--bg-card)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 800, color: 'var(--text-main)' }}
                    itemStyle={{ color: 'var(--primary)' }}
                    formatter={(v) => [`Rp ${v.toLocaleString('id-ID')}`, 'Pendapatan']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--primary)" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="panel-title-icon"><Icon n="star" /></div>
                Produk Terlaris
              </div>
            </div>
            <div className="dash-list">
              {data.topProducts.map((p, i) => (
                <div key={i} className="dash-item">
                  <div className="item-info">
                    <div className="item-rank">{i + 1}</div>
                    <span className="item-name">{p.name}</span>
                  </div>
                  <span className="item-val">{p.qty}x</span>
                </div>
              ))}
              {data.topProducts.length === 0 && <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '13px' }}>Belum ada penjualan</p>}
            </div>
          </div>
        </div>

        <div className="main-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
          <div className="glass-panel">
            <div className="panel-header">
              <div className="panel-title">
                <div className="panel-title-icon"><Icon n="alert" /></div>
                Peringatan Stok
              </div>
            </div>
            <div className="dash-list">
              {data.lowStock.map(p => (
                <div key={p.id} className="dash-item low-stock-item">
                  <span className="item-name">{p.product_name}</span>
                  <span className="stock-val">Sisa {p.stock}</span>
                </div>
              ))}
              {data.lowStock.length === 0 && <p style={{ textAlign: 'center', color: '#10B981', fontSize: '13px', fontWeight: 700 }}>Semua stok aman ✅</p>}
            </div>
          </div>

          <div className="glass-panel">
            <div className="panel-header">
              <div className="panel-title">Aksi Cepat</div>
            </div>
            <div className="quick-actions">
              <div className="action-btn">
                <div className="action-icon"><Icon n="shoppingCart" /></div>
                <span className="action-label">Buka Kasir</span>
              </div>
              <div className="action-btn">
                <div className="action-icon"><Icon n="plus" /></div>
                <span className="action-label">Tambah Produk</span>
              </div>
              <div className="action-btn">
                <div className="action-icon"><Icon n="dollar" /></div>
                <span className="action-label">Laporan Laba</span>
              </div>
              <div className="action-btn">
                <div className="action-icon"><Icon n="package" /></div>
                <span className="action-label">Kelola Stok</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
