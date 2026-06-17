import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Icon = ({ n, size = 16, className = "", style = {} }) => {
  const paths = {
    bar: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
    trend: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    box: <><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[n]}</svg>;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  
  .report-root { 
    min-height: 100%; 
    background: var(--bg-app); 
    color: var(--text-main); 
    font-family: 'Plus Jakarta Sans', sans-serif; 
    padding: 24px; 
    overflow-y: auto; 
    animation: fadeIn 0.5s ease;
    transition: background 0.3s;
  }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .report-page-header { 
    margin-bottom: 32px; 
    padding-bottom: 16px; 
    border-bottom: 1px solid var(--border); 
    display: flex; 
    align-items: flex-start; 
    justify-content: space-between; 
    flex-wrap: wrap; 
    gap: 20px; 
  }
  
  .header-left { display: flex; align-items: center; gap: 14px; text-align: left; }
  .report-page-icon { 
    width: 48px; height: 48px; background: var(--primary); border-radius: 14px; 
    display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; 
    box-shadow: 0 4px 12px var(--primary-soft);
  }
  .report-page-title { font-size: 22px; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px; }
  .report-page-sub { font-size: 13px; color: var(--text-sub); font-weight: 600; margin-top: 4px; }

  .action-container { display: flex; flex-direction: column; gap: 12px; }
  .preset-filters { display: flex; gap: 8px; flex-wrap: wrap; }
  .btn-preset { 
    background: var(--bg-card); border: 2px solid var(--border); color: var(--text-sub); 
    padding: 8px 14px; border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; 
    font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; 
    display: flex; align-items: center; gap: 6px; 
  }
  .btn-preset:hover { border-color: var(--primary); color: var(--primary); }
  .btn-preset.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 12px var(--primary-soft); }

  .filter-group { 
    display: flex; align-items: center; gap: 12px; background: var(--bg-card); 
    padding: 12px 16px; border-radius: 14px; border: 1px solid var(--border); 
    flex-wrap: wrap; box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }
  .filter-label { font-size: 12px; color: var(--text-sub); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
  .filter-input { 
    background: var(--bg-app); border: 2px solid var(--border); color: var(--text-main); 
    padding: 8px 12px; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; 
    font-size: 13px; outline: none; font-weight: 700; transition: 0.2s; 
  }
  .filter-input:focus { border-color: var(--primary); background: var(--bg-card); }

  .export-group { display: flex; gap: 12px; align-items: stretch; }
  .export-btn { 
    color: white; border: none; padding: 12px 20px; border-radius: 14px; 
    font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; 
    cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  .export-btn:hover { transform: translateY(-2px); opacity: 0.9; }
  .btn-csv { background: #10B981; } .btn-pdf { background: #EF4444; }

  .summary-grid { 
    display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
    gap: 20px; margin-bottom: 32px; 
  }
  .summary-card { 
    position: relative; padding: 24px; border-radius: 24px; color: white; 
    box-shadow: 0 10px 20px rgba(0,0,0,0.05); transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.1); text-align: left; overflow: hidden;
  }
  .summary-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
  .summary-card.emerald { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
  .summary-card.blue { background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); }
  .summary-card.amber { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }
  .summary-card.violet { background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); }
  
  .glass-overlay {
    position: absolute; top: -15px; right: -15px; width: 90px; height: 90px;
    background: rgba(255,255,255,0.15); border-radius: 50%; backdrop-filter: blur(10px);
  }

  .summary-label { font-size: 12px; font-weight: 800; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .summary-value { font-size: 24px; font-weight: 800; }

  .chart-card { 
    background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; 
    padding: 24px; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    text-align: left;
    transition: background 0.3s, border 0.3s;
  }
  .chart-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .chart-icon { background: var(--primary-soft); color: var(--primary); padding: 10px; border-radius: 12px; }
  .chart-title { font-size: 18px; font-weight: 800; color: var(--text-main); }
  .chart-wrap { height: 320px; width: 100%; }

  .table-card { 
    background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border); 
    overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02);
    transition: background 0.3s, border 0.3s;
  }
  .table-header { 
    padding: 20px 24px; border-bottom: 1px solid var(--border); background: var(--bg-app);
    display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--text-main); font-size: 15px;
  }
  .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { width: 100%; border-collapse: collapse; min-width: 800px; }
  thead tr { background: var(--bg-card); border-bottom: 1px solid var(--border); }
  thead th { padding: 16px 24px; font-size: 12px; color: var(--text-sub); font-weight: 800; text-transform: uppercase; text-align: left; }
  
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
  tbody tr:nth-child(even) { background: var(--bg-app); }
  tbody tr:hover { background: var(--primary-soft); }
  tbody td { padding: 18px 24px; font-size: 14px; color: var(--text-main); vertical-align: middle; text-align: left; }

  .trx-id { font-weight: 800; color: var(--text-main); font-size: 13px; }
  .trx-time { font-size: 12px; color: var(--text-sub); font-weight: 600; margin-top: 4px; }
  .cust-cell { display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--primary); }
  .item-pill { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; padding: 6px; background: var(--bg-card); border-radius: 10px; border: 1px solid var(--border); }
  .item-img { width: 32px; height: 32px; border-radius: 6px; background: var(--bg-field); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
  .item-img img { width: 100%; height: 100%; object-fit: cover; }
  .item-name { font-weight: 700; font-size: 13px; color: var(--text-main); }
  
  .method-badge { 
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; 
    border-radius: 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; border: 1px solid transparent;
  }
  .method-cash { background: #ECFDF5; color: #059669; border-color: #A7F3D0; }
  .method-qris { background: #EFF6FF; color: #3B82F6; border-color: #BFDBFE; }
  .method-transfer { background: #FFFBEB; color: #D97706; border-color: #FDE68A; }
  
  [data-theme='dark'] .method-cash { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
  [data-theme='dark'] .method-qris { background: #1e3a8a; color: #93c5fd; border-color: #1e40af; }
  [data-theme='dark'] .method-transfer { background: #451a03; color: #fbbf24; border-color: #78350f; }

  .td-total { font-weight: 800; color: var(--text-main); font-size: 15px; text-align: right !important; }

  .pagination-controls { 
    display: flex; align-items: center; justify-content: center; gap: 16px; 
    padding: 20px; border-top: 1px solid var(--border); background: var(--bg-card);
  }
  .page-btn { 
    padding: 10px 20px; background: var(--bg-card); border: 2px solid var(--border); 
    border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; 
    font-size: 13px; font-weight: 800; cursor: pointer; color: var(--text-sub); transition: 0.2s; 
  }
  .page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
  .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  @media (max-width: 1024px) {
    .report-page-header { flex-direction: column; align-items: stretch; }
    .summary-grid { grid-template-columns: repeat(2, 1fr); }
  }
  
  @media (max-width: 640px) {
    .report-root { padding: 16px; }
    .summary-grid { grid-template-columns: 1fr; }
    .filter-group { flex-direction: column; align-items: stretch; }
    .export-group { flex-direction: column; }
    .chart-wrap { height: 260px; }
    .summary-card { padding: 20px; }
  }
`;

const getMethodClass = (m) => ({ cash: 'method-cash', QRIS: 'method-qris', transfer: 'method-transfer' }[m] || 'method-cash');
const formatID = (id, prefix) => id ? `${prefix}-${String(id).substring(0, 5).toUpperCase()}` : '';

const getCurrentAccount = () => {
  const savedCustom = localStorage.getItem('custom_service_session');
  if (savedCustom) {
    try { return JSON.parse(savedCustom).user?.email || "custom_role"; } catch (e) { }
  }
  return "owner";
};

export default function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [summary, setSummary] = useState({ totalRevenue: 0, totalProfit: 0, totalOrders: 0, avgOrder: 0 });
  const [chartData, setChartData] = useState([]);
  const [activePreset, setActivePreset] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const currentAccount = getCurrentAccount();
      const res = await api.get(`/transactions?account=${currentAccount}`);
      setTransactions(res.data);
    } catch { }
  };

  const handlePreset = (preset) => {
    const today = dayjs().format('YYYY-MM-DD');
    setActivePreset(preset);
    setCurrentPage(1);
    if (preset === 'today') {
      setStartDate(today); setEndDate(today);
    } else if (preset === '7days') {
      setStartDate(dayjs().subtract(6, 'day').format('YYYY-MM-DD')); setEndDate(today);
    } else if (preset === '30days') {
      setStartDate(dayjs().subtract(29, 'day').format('YYYY-MM-DD')); setEndDate(today);
    } else {
      setStartDate(''); setEndDate('');
    }
  };

  const handleDateChange = (type, value) => {
    setActivePreset('custom');
    setCurrentPage(1);
    if (type === 'start') setStartDate(value);
    if (type === 'end') setEndDate(value);
  };

  useEffect(() => {
    const filtered = transactions.filter(t => {
      if (!startDate && !endDate) return true;
      const trxDate = dayjs(t.created_at);
      const start = startDate ? dayjs(startDate).startOf('day') : null;
      const end = endDate ? dayjs(endDate).endOf('day') : null;
      if (start && end) return trxDate.isAfter(start) && trxDate.isBefore(end.add(1, 'day'));
      if (start) return trxDate.isAfter(start);
      if (end) return trxDate.isBefore(end.add(1, 'day'));
      return true;
    });

    const totalRev = filtered.reduce((sum, t) => sum + Number(t.grand_total), 0);
    let totalCost = 0;
    filtered.forEach(t => {
      if (t.transaction_details) {
        t.transaction_details.forEach(d => {
          totalCost += (Number(d.products?.cost_price || 0) * Number(d.quantity));
        });
      }
    });

    setSummary({
      totalRevenue: totalRev,
      totalProfit: totalRev - totalCost,
      totalOrders: filtered.length,
      avgOrder: filtered.length > 0 ? Math.round(totalRev / filtered.length) : 0
    });

    const chronologicalData = [...filtered].reverse();
    const grouped = chronologicalData.reduce((acc, t) => {
      const label = dayjs(t.created_at).format('DD MMM');
      acc[label] = (acc[label] || 0) + Number(t.grand_total);
      return acc;
    }, {});

    setChartData(Object.keys(grouped).map(d => ({ tanggal: d, pendapatan: grouped[d] })));
  }, [startDate, endDate, transactions]);

  const exportToCSV = () => {
    if (summary.totalOrders === 0) return;
    const filtered = transactions.filter(t => {
      if (!startDate && !endDate) return true;
      const trxDate = dayjs(t.created_at);
      const start = startDate ? dayjs(startDate).startOf('day') : null;
      const end = endDate ? dayjs(endDate).endOf('day') : null;
      if (start && end) return trxDate.isAfter(start) && trxDate.isBefore(end.add(1, 'day'));
      return true;
    });
    const headers = ["ID TRX", "Waktu", "Pelanggan", "Detail Item", "Metode", "Diskon", "Total"];
    const rows = filtered.map(t => {
      const items = t.transaction_details?.map(d => `${d.quantity}x [${formatID(d.product_id || d.products?.id, 'PRD')}] ${d.products?.product_name || 'Terhapus'}`).join(" | ");
      return `"${formatID(t.id, 'TRX')}","${dayjs(t.created_at).format('YYYY-MM-DD HH:mm')}","${t.customer_name || 'Umum'}","${items}","${t.payment_method}","${t.discount}","${t.grand_total}"`;
    });
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Laporan_Penjualan.csv`);
    link.click();
  };

  const exportToPDF = () => {
    if (summary.totalOrders === 0) return;
    const filtered = transactions.filter(t => {
      if (!startDate && !endDate) return true;
      const trxDate = dayjs(t.created_at);
      const start = startDate ? dayjs(startDate).startOf('day') : null;
      const end = endDate ? dayjs(endDate).endOf('day') : null;
      if (start && end) return trxDate.isAfter(start) && trxDate.isBefore(end.add(1, 'day'));
      return true;
    });
    const doc = new jsPDF();
    doc.setFontSize(14); doc.text("Laporan Penjualan Putro Sales", 14, 20);
    doc.setFontSize(10); doc.text(`Periode: ${startDate || 'Semua'} s/d ${endDate || 'Semua'}`, 14, 28);
    doc.text(`Pendapatan Kotor: Rp ${summary.totalRevenue.toLocaleString()} | Keuntungan Bersih: Rp ${summary.totalProfit.toLocaleString()}`, 14, 34);
    const rows = filtered.map(t => [
      formatID(t.id, 'TRX'),
      dayjs(t.created_at).format('DD/MM/YY HH:mm'),
      t.customer_name || 'Umum',
      t.transaction_details?.map(d => `${d.quantity}x [${formatID(d.product_id || d.products?.id, 'PRD')}] ${d.products?.product_name || 'Terhapus'}`).join(",\n"),
      t.payment_method.toUpperCase(),
      `Rp ${t.discount || 0}`,
      `Rp ${Number(t.grand_total).toLocaleString()}`
    ]);
    autoTable(doc, { head: [["ID TRX", "Waktu", "Pelanggan", "Detail Item", "Metode", "Diskon", "Total"]], body: rows, startY: 40, styles: { fontSize: 9 }, headStyles: { fillColor: [44, 62, 80] } });
    doc.save(`Laporan_Penjualan.pdf`);
  };

  const filteredTransactions = transactions.filter(t => {
    if (!startDate && !endDate) return true;
    const trxDate = dayjs(t.created_at);
    const start = startDate ? dayjs(startDate).startOf('day') : null;
    const end = endDate ? dayjs(endDate).endOf('day') : null;
    if (start && end) return trxDate.isAfter(start) && trxDate.isBefore(end.add(1, 'day'));
    if (start) return trxDate.isAfter(start);
    if (end) return trxDate.isBefore(end.add(1, 'day'));
    return true;
  });

  return (
    <>
      <style>{styles}</style>
      <div className="report-root">
        <div className="report-page-header">
          <div className="header-left">
            <div className="report-page-icon"><Icon n="bar" size={24} /></div>
            <div>
              <div className="report-page-title">Laporan Penjualan</div>
              <div className="report-page-sub">Putro Sales • {dayjs().format('DD MMM YYYY')}</div>
            </div>
          </div>

          <div className="action-container">
            <div className="preset-filters">
              <button className={`btn-preset ${activePreset === 'today' ? 'active' : ''}`} onClick={() => handlePreset('today')}><Icon n="clock" size={14} /> Hari Ini</button>
              <button className={`btn-preset ${activePreset === '7days' ? 'active' : ''}`} onClick={() => handlePreset('7days')}><Icon n="calendar" size={14} /> 7 Hari</button>
              <button className={`btn-preset ${activePreset === '30days' ? 'active' : ''}`} onClick={() => handlePreset('30days')}><Icon n="calendar" size={14} /> 30 Hari</button>
              <button className={`btn-preset ${activePreset === 'all' ? 'active' : ''}`} onClick={() => handlePreset('all')}><Icon n="filter" size={14} /> Semua</button>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <div className="filter-group">
                <span className="filter-label">Periode:</span>
                <input type="date" className="filter-input" value={startDate} onChange={e => handleDateChange('start', e.target.value)} />
                <span style={{ color: '#E5E7EB', fontWeight: 800 }}>—</span>
                <input type="date" className="filter-input" value={endDate} onChange={e => handleDateChange('end', e.target.value)} />
              </div>
              <div className="export-group">
                <button className="export-btn btn-csv" onClick={exportToCSV}><Icon n="download" size={16} /> CSV</button>
                <button className="export-btn btn-pdf" onClick={exportToPDF}><Icon n="fileText" size={16} /> PDF</button>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-card emerald"><div className="glass-overlay" /><div className="summary-label">Pendapatan Kotor</div><div className="summary-value">Rp {summary.totalRevenue.toLocaleString('id-ID')}</div></div>
          <div className="summary-card blue"><div className="glass-overlay" /><div className="summary-label">Keuntungan Bersih</div><div className="summary-value">Rp {summary.totalProfit.toLocaleString('id-ID')}</div></div>
          <div className="summary-card amber"><div className="glass-overlay" /><div className="summary-label">Total Transaksi</div><div className="summary-value">{summary.totalOrders}</div></div>
          <div className="summary-card violet"><div className="glass-overlay" /><div className="summary-label">Rata-rata Order</div><div className="summary-value">Rp {summary.avgOrder.toLocaleString('id-ID')}</div></div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-icon"><Icon n="trend" size={20} /></div>
            <div className="chart-title">Analisis Tren Pendapatan</div>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="tanggal" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-sub)', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-sub)', fontSize: 11, fontWeight: 700 }} tickFormatter={v => `${v / 1000}k`} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-app)' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', background: 'var(--bg-card)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 800, color: 'var(--text-main)' }} 
                  itemStyle={{ color: 'var(--primary)' }} 
                />
                <Bar dataKey="pendapatan" fill="var(--primary)" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header"><Icon n="clipboard" size={18} /> Riwayat Transaksi Penjualan</div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '180px' }}>Waktu / ID TRX</th>
                  <th style={{ width: '200px' }}>Pelanggan</th>
                  <th>Detail Pesanan</th>
                  <th style={{ width: '140px' }}>Pembayaran</th>
                  <th style={{ width: '160px', textAlign: 'right' }}>Total Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: '#9CA3AF', fontWeight: '700' }}>Tidak ada riwayat transaksi pada periode ini.</td></tr>
                ) : filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(t => (
                  <tr key={t.id}>
                    <td>
                      <div className="trx-id">{formatID(t.id, 'TRX')}</div>
                      <div className="trx-time">{dayjs(t.created_at).format('DD MMM YYYY, HH:mm')}</div>
                    </td>
                    <td>
                      <div className="cust-cell"><Icon n="user" size={14} /> {t.customer_name || 'Umum'}</div>
                    </td>
                    <td>
                      {t.transaction_details?.map((d, idx) => (
                        <div key={idx} className="item-pill">
                          <div className="item-img">
                            {d.products?.image_url ? <img src={d.products.image_url} alt="" /> : <Icon n="box" size={16} style={{ color: '#D97706' }} />}
                          </div>
                          <div style={{ textAlign: 'left' }}>
                            <div className="item-name">{d.products?.product_name || 'Item Terhapus'}</div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '700' }}>{d.quantity}x @ Rp {Number(d.subtotal / d.quantity).toLocaleString('id-ID')}</div>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td><span className={`method-badge ${getMethodClass(t.payment_method)}`}>{t.payment_method}</span></td>
                    <td className="td-total">Rp {Number(t.grand_total).toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTransactions.length > itemsPerPage && (() => {
            const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
            return (
              <div className="pagination-controls">
                <button className="page-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>Sebelumnya</button>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#6B7280' }}>Halaman {currentPage} dari {totalPages}</span>
                <button className="page-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Berikutnya</button>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
