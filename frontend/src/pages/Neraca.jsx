import React, { useState, useEffect } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Icon = ({ n, size = 16, className = "", style = {} }) => {
    const paths = {
        fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>
    };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[n]}</svg>;
};

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
    .neraca-root { min-height: 100%; background: var(--bg-app); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; padding: 24px; display: flex; flex-direction: column; align-items: center; overflow-y: auto; transition: background 0.3s; }
    .neraca-paper { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 750px; padding: 40px; text-align: left; transition: background 0.3s, border 0.3s; }
    .neraca-header { text-align: center; margin-bottom: 36px; border-bottom: 2px solid var(--border); padding-bottom: 24px; }
    .neraca-title { font-size: 22px; font-weight: 800; color: var(--text-main); margin: 0 0 6px 0; }
    .neraca-subtitle { font-size: 12px; color: var(--text-sub); margin: 0; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .neraca-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; gap: 14px; flex-wrap: wrap; }
    .filter-group { display: flex; gap: 12px; flex-wrap: wrap; }
    .neraca-controls select { padding: 12px 16px; background: var(--bg-app); border: 2px solid var(--border); color: var(--text-main); border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; outline: none; cursor: pointer; font-size: 13px; }
    .neraca-controls select:focus { border-color: var(--primary); background: var(--bg-card); }
    .btn-print-pdf { background: #EF4444; color: white; border: none; padding: 12px 22px; border-radius: 10px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; }
    .btn-print-pdf:hover { background: #DC2626; }
    .neraca-section { margin-bottom: 28px; }
    .section-title { font-size: 12px; font-weight: 800; color: var(--primary); text-transform: uppercase; margin-bottom: 14px; letter-spacing: 1px; border-bottom: 2px dashed var(--border); padding-bottom: 8px; }
    .neraca-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; color: var(--text-main); font-weight: 600; }
    .neraca-row.indent { padding-left: 20px; color: var(--text-sub); font-size: 13px; }
    .neraca-value { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: var(--text-main); }
    .neraca-value.negative { color: #EF4444; }
    [data-theme='dark'] .neraca-value.negative { color: #f87171; }
    .neraca-subtotal { display: flex; justify-content: space-between; padding: 14px 0; margin-top: 12px; border-top: 2px solid var(--border); font-size: 15px; font-weight: 800; color: var(--text-main); }
    .neraca-grandtotal { display: flex; justify-content: space-between; padding: 24px; margin-top: 24px; background: #ECFDF5; border: 2px solid #A7F3D0; border-radius: 14px; font-size: 18px; font-weight: 800; color: #059669; }
    [data-theme='dark'] .neraca-grandtotal { background: #064e3b; border-color: #065f46; color: #6ee7b7; }
    .neraca-grandtotal.loss { background: #FEF2F2; border-color: #FECACA; color: #EF4444; }
    [data-theme='dark'] .neraca-grandtotal.loss { background: #450a0a; border-color: #7f1d1d; color: #f87171; }
    @media (max-width: 768px) {
        .neraca-root { padding: 16px; }
        .neraca-paper { padding: 24px; }
        .neraca-controls { flex-direction: column; align-items: stretch; }
        .filter-group { flex-direction: row; width: 100%; }
        .filter-group select { flex: 1; }
        .btn-print-pdf { width: 100%; justify-content: center; }
        .neraca-grandtotal { flex-direction: column; gap: 8px; text-align: center; font-size: 16px; padding: 20px; }
        .neraca-title { font-size: 18px; }
    }
`;

export default function Neraca() {
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MM'));
    const [selectedYear, setSelectedYear] = useState(dayjs().format('YYYY'));
    const [reportData, setReportData] = useState(null);

    const months = [
        { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' }, { value: '03', label: 'Maret' },
        { value: '04', label: 'April' }, { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' }, { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' }
    ];

    const years = ['2024', '2025', '2026', '2027'];

    useEffect(() => { fetchTransactions(); }, []);
    useEffect(() => { if (transactions.length >= 0) calculateNeraca(); }, [transactions, selectedMonth, selectedYear]);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch { }
    };

    const calculateNeraca = () => {
        const filtered = transactions.filter(t => {
            const trxDate = dayjs(t.created_at);
            return trxDate.format('MM') === selectedMonth && trxDate.format('YYYY') === selectedYear;
        });
        let totalKotor = 0; let totalDiskon = 0; let totalHPP = 0;
        filtered.forEach(t => {
            totalKotor += Number(t.total_price);
            totalDiskon += Number(t.discount || 0);
            if (t.transaction_details) {
                t.transaction_details.forEach(d => {
                    totalHPP += (Number(d.products?.cost_price || 0) * Number(d.quantity));
                });
            }
        });
        const penjualanBersih = totalKotor - totalDiskon;
        const labaKotor = penjualanBersih - totalHPP;
        const bebanOps = 0;
        const labaBersih = labaKotor - bebanOps;
        setReportData({ penjualanKotor: totalKotor, diskon: totalDiskon, penjualanBersih, hpp: totalHPP, labaKotor, bebanOps, labaBersih, totalOrders: filtered.length });
    };

    const formatRp = (num) => {
        const val = Math.abs(num).toLocaleString('id-ID');
        return num < 0 ? `(Rp ${val})` : `Rp ${val}`;
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const bulanNama = months.find(m => m.value === selectedMonth).label;
        doc.setFontSize(18);
        doc.text("LAPORAN LABA RUGI", 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Periode: ${bulanNama} ${selectedYear}`, 105, 28, { align: 'center' });
        doc.line(14, 35, 196, 35);
        const rows = [
            ["1. PENDAPATAN", ""],
            ["   Penjualan Kotor", formatRp(reportData.penjualanKotor)],
            ["   Potongan/Diskon", `(${formatRp(reportData.diskon)})`],
            ["TOTAL PENDAPATAN BERSIH", formatRp(reportData.penjualanBersih)],
            ["", ""],
            ["2. BEBAN POKOK PENJUALAN", ""],
            ["   Total Harga Modal (HPP)", `(${formatRp(reportData.hpp)})`],
            ["LABA KOTOR", formatRp(reportData.labaKotor)],
            ["", ""],
            ["3. PENGELUARAN OPERASIONAL", ""],
            ["   Biaya Operasional", formatRp(reportData.bebanOps)],
            ["", ""],
            ["LABA BERSIH USAHA", formatRp(reportData.labaBersih)]
        ];
        autoTable(doc, {
            body: rows, startY: 40, theme: 'plain', styles: { fontSize: 11, cellPadding: 2 },
            columnStyles: { 1: { halign: 'right', fontStyle: 'bold' } },
            didParseCell: (data) => {
                if (data.row.index === 3 || data.row.index === 7 || data.row.index === 12) {
                    data.cell.styles.fontStyle = 'bold';
                    if (data.row.index === 12) data.cell.styles.fontSize = 13;
                }
            }
        });
        doc.save(`Laba_Rugi_${bulanNama}_${selectedYear}.pdf`);
    };

    return (
        <>
            <style>{styles}</style>
            <div className="neraca-root">
                <div className="neraca-paper">
                    <div className="neraca-header">
                        <h1 className="neraca-title">LAPORAN LABA RUGI</h1>
                        <p className="neraca-subtitle">SISTEM KASIR | INTERNAL REPORT</p>
                    </div>
                    <div className="neraca-controls">
                        <div className="filter-group">
                            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <button className="btn-print-pdf" onClick={exportPDF}><Icon n="fileText" /> Cetak PDF</button>
                    </div>
                    {reportData && (
                        <div>
                            <div className="neraca-section">
                                <div className="section-title">I. Pendapatan</div>
                                <div className="neraca-row indent"><span>Penjualan Kotor</span><span className="neraca-value">{formatRp(reportData.penjualanKotor)}</span></div>
                                <div className="neraca-row indent"><span>Diskon Diberikan</span><span className="neraca-value negative">({formatRp(reportData.diskon)})</span></div>
                                <div className="neraca-subtotal"><span>Total Pendapatan Bersih</span><span className="neraca-value">{formatRp(reportData.penjualanBersih)}</span></div>
                            </div>
                            <div className="neraca-section">
                                <div className="section-title">II. Harga Pokok Penjualan</div>
                                <div className="neraca-row indent"><span>Total Harga Modal Barang</span><span className="neraca-value negative">({formatRp(reportData.hpp)})</span></div>
                                <div className="neraca-subtotal" style={{ color: '#D97706' }}><span>LABA KOTOR</span><span className="neraca-value">{formatRp(reportData.labaKotor)}</span></div>
                            </div>
                            <div className="neraca-section">
                                <div className="section-title">III. Operasional</div>
                                <div className="neraca-row indent"><span>Beban Operasional</span><span className="neraca-value">Rp 0</span></div>
                            </div>
                            <div className={`neraca-grandtotal ${reportData.labaBersih < 0 ? 'loss' : ''}`}>
                                <span>{reportData.labaBersih >= 0 ? 'LABA BERSIH USAHA' : 'RUGI BERSIH USAHA'}</span>
                                <span className="neraca-value">{formatRp(reportData.labaBersih)}</span>
                            </div>
                            <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '12px', color: '#9CA3AF', fontWeight: '700' }}>
                                Total Transaksi: {reportData.totalOrders} Order | Dicetak: {dayjs().format('DD/MM/YY HH:mm')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}