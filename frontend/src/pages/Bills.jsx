import React, { useState, useEffect } from "react";
import api from "../services/api";
import dayjs from "dayjs";

const CATEGORY_ICONS = {
  Makanan: "food",
  Minuman: "coffee",
  Kopi: "coffee",
  Snack: "box",
  Dessert: "food",
  Sembako: "box",
  default: "box",
};

const Icon = ({ n, size = 16, className = "", style = {} }) => {
  const paths = {
    list: (
      <>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    cash: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01" />
        <path d="M18 12h.01" />
      </>
    ),
    qris: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </>
    ),
    bank: (
      <>
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </>
    ),
    check: (
      <>
        <polyline points="20 6 9 17 4 12" />
      </>
    ),
    box: (
      <>
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </>
    ),
    coffee: (
      <>
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </>
    ),
    food: (
      <>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      {paths[n]}
    </svg>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  .bl-root { display: flex; height: 100%; background: var(--bg-app); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; overflow: hidden; transition: background 0.3s; }
  
  /* Left Panel */
  .bl-left { flex: 1.2; display: flex; flex-direction: column; background: var(--bg-card); border-right: 1px solid var(--border); z-index: 10; transition: background 0.3s, border 0.3s; }
  .bl-left-header { padding: 24px; border-bottom: 1px solid var(--border); }
  .bl-title { font-size: 18px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  
  .bl-search-wrap { position: relative; }
  .bl-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-sub); }
  .bl-search-input { width: 100%; padding: 10px 10px 10px 42px; background: var(--bg-app); border: 1px solid var(--border); border-radius: 10px; font-family: inherit; font-size: 13px; font-weight: 600; color: var(--text-main); outline: none; transition: all 0.2s; }
  .bl-search-input:focus { border-color: var(--primary); background: var(--bg-card); box-shadow: 0 0 0 4px var(--primary-soft); }

  .bl-list { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
  .bl-card { padding: 16px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 14px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; gap: 8px; }
  .bl-card:hover { border-color: var(--text-sub); background: var(--bg-app); }
  .bl-card.active { border-color: var(--primary); background: var(--primary-soft); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  
  .bl-card-top { display: flex; justify-content: space-between; align-items: center; }
  .bl-cust-name { font-size: 14px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 6px; }
  .bl-time { font-size: 11px; color: var(--text-sub); font-weight: 700; display: flex; align-items: center; gap: 4px; }
  
  .bl-card-btm { display: flex; justify-content: space-between; align-items: center; }
  .bl-items-count { font-size: 11px; color: var(--text-sub); font-weight: 700; text-transform: uppercase; }
  .bl-total { font-size: 14px; font-weight: 800; color: var(--primary); }

  /* Right Panel */
  .bl-right { flex: 2; display: flex; flex-direction: column; background: var(--bg-app); position: relative; transition: background 0.3s; }
  .bl-empty-right { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; color: var(--text-sub); }
  
  .bl-detail-head { padding: 24px 32px; background: var(--bg-card); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; transition: background 0.3s, border 0.3s; }
  .bl-head-info { display: flex; flex-direction: column; gap: 2px; }
  .bl-head-title { font-size: 20px; font-weight: 800; color: var(--text-main); }
  .bl-head-sub { font-size: 12px; color: var(--text-sub); font-weight: 600; display: flex; align-items: center; gap: 6px; }

  .bl-items-list { flex: 1; overflow-y: auto; padding: 24px 32px; display: flex; flex-direction: column; gap: 12px; }
  .bl-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; }
  .bl-item-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
  .bl-item-thumb { width: 44px; height: 44px; border-radius: 10px; background: var(--primary-soft); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--border); flex-shrink: 0; }
  .bl-item-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .bl-item-qty { width: 28px; height: 28px; background: var(--bg-app); border: 1px solid var(--border); color: var(--text-main); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; }
  .bl-item-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
  .bl-item-name { font-size: 14px; font-weight: 800; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bl-item-price { font-size: 12px; color: var(--text-sub); font-weight: 600; }
  .bl-item-sub { font-size: 14px; font-weight: 800; color: var(--text-main); flex-shrink: 0; }

  /* Payment Panel */
  .bl-pay-panel { padding: 24px 32px; background: var(--bg-card); border-top: 1px solid var(--border); box-shadow: 0 -4px 20px rgba(0,0,0,0.02); transition: background 0.3s, border 0.3s; }
  .bl-summary { margin-bottom: 24px; padding: 16px; background: var(--bg-app); border-radius: 16px; border: 1px solid var(--border); }
  .bl-sum-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; font-weight: 700; color: var(--text-sub); }
  .bl-sum-row.grand { margin-top: 12px; padding-top: 12px; border-top: 2px dashed var(--border); color: var(--text-main); }
  .bl-grand-val { font-size: 20px; font-weight: 800; color: var(--primary); }

  .bl-methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
  .bl-method-btn { padding: 12px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
  .bl-method-btn:hover { border-color: var(--text-sub); background: var(--bg-app); }
  .bl-method-btn.active { border-color: var(--primary); background: var(--primary-soft); }
  .bl-method-icon { color: var(--text-sub); }
  .bl-method-btn.active .bl-method-icon { color: var(--primary); }
  .bl-method-lbl { font-size: 11px; font-weight: 800; color: var(--text-sub); }
  .bl-method-btn.active .bl-method-lbl { color: var(--primary); }

  .bl-cash-input-wrap { position: relative; margin-bottom: 16px; }
  .bl-cash-input { width: 100%; padding: 16px 16px 16px 48px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 14px; font-family: inherit; font-size: 16px; font-weight: 800; color: var(--text-main); outline: none; transition: all 0.2s; }
  .bl-cash-input:focus { border-color: #10B981; background: var(--bg-card); box-shadow: 0 0 0 4px rgba(16,185,129,0.1); }
  .bl-cash-icon { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--text-sub); }

  .bl-change-box { padding: 14px 20px; background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; color: #059669; font-weight: 800; font-size: 14px; margin-bottom: 20px; }
  [data-theme='dark'] .bl-change-box { background: #064e3b; color: #6ee7b7; border-color: #065f46; }

  .bl-actions { display: flex; gap: 12px; }
  .bl-btn-del { flex: 1; padding: 16px; background: #FEF2F2; color: #EF4444; border: none; border-radius: 14px; font-weight: 800; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
  .bl-btn-del:hover { background: #FEE2E2; }
  [data-theme='dark'] .bl-btn-del { background: #450a0a; color: #f87171; }
  [data-theme='dark'] .bl-btn-del:hover { background: #f87171; color: white; }

  .bl-btn-pay { flex: 2; padding: 16px; background: #10B981; color: white; border: none; border-radius: 14px; font-weight: 800; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
  .bl-btn-pay:hover { background: #059669; transform: translateY(-1px); }
  .bl-btn-pay:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

  .bl-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .bl-modal { background: var(--bg-card); border-radius: 24px; padding: 32px; width: 100%; max-width: 400px; text-align: center; border: 1px solid var(--border); }
  .bl-modal-icon { width: 64px; height: 64px; background: var(--primary-soft); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); margin: 0 auto 20px; }
  .bl-modal-title { font-size: 20px; font-weight: 800; color: var(--text-main); margin-bottom: 12px; }
  .bl-qris-amount { font-size: 26px; font-weight: 800; color: var(--primary); margin-bottom: 24px; }
  .bl-qris-img { background: white; border: 2px solid #F1F5F9; padding: 16px; border-radius: 20px; margin-bottom: 24px; display: inline-block; }
  .bl-qris-img img { width: 180px; height: 180px; }
  .bl-modal-btn { width: 100%; padding: 14px; border-radius: 12px; font-size: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; border: none; transition: all 0.2s; margin-bottom: 10px; }
  .bl-btn-confirm { background: #10B981; color: white; }
  .bl-btn-confirm:hover { background: #059669; }
  .bl-btn-close { background: var(--bg-field); color: var(--text-sub); }

  @media (max-width: 1024px) {
    .bl-root { flex-direction: column; overflow-y: auto; }
    .bl-left { flex: none; width: 100%; border-right: none; height: auto; max-height: 400px; }
    .bl-right { flex: 1; min-height: 500px; }
  }
  @media (max-width: 480px) {
    .bl-detail-head { padding: 16px 20px; }
    .bl-items-list { padding: 16px 20px; }
    .bl-pay-panel { padding: 20px; }
    .bl-methods { grid-template-columns: repeat(2, 1fr); }
    .bl-actions { flex-direction: column; }
  }
`;

const formatID = (id, prefix) =>
  id ? `${prefix}-${String(id).substring(0, 5).toUpperCase()}` : "";

const getCurrentAccount = () => {
  const savedCustom = localStorage.getItem("custom_service_session");
  if (savedCustom) {
    try {
      return JSON.parse(savedCustom).user?.email || "custom_role";
    } catch (e) {}
  }
  return "owner";
};

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [qrisStatus, setQrisStatus] = useState("waiting");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = () => {
    const currentAccount = getCurrentAccount();
    const saved = JSON.parse(localStorage.getItem("pos_bills") || "[]");
    setBills(saved.filter((b) => b.account === currentAccount || !b.account));
  };

  const handleSelectBill = (bill) => {
    setSelectedBill(bill);
    setPaymentMethod(bill.paymentMethod || "cash");
    setCashReceived("");
  };

  const handleDeleteBill = (id, skipConfirm = false) => {
    if (
      !skipConfirm &&
      !window.confirm("Yakin ingin membatalkan dan menghapus bill ini?")
    )
      return;
    const allBills = JSON.parse(localStorage.getItem("pos_bills") || "[]");
    const updated = allBills.filter((b) => b.id !== id);
    localStorage.setItem("pos_bills", JSON.stringify(updated));
    loadBills();
    if (selectedBill?.id === id) setSelectedBill(null);
  };

  const cashNum = Number(cashReceived) || 0;
  const kembalian = selectedBill ? cashNum - selectedBill.grandTotal : 0;

  const filteredBills = bills.filter(b => 
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const printReceipt = (cartItems, total, disc, grand, method, cash, change, trxId, custName) => {
    const printWindow = window.open("", "", "width=350,height=600");
    if (!printWindow) return;
    const itemsHtml = cartItems.map(item => `
        <tr><td colspan="2" style="padding-top:6px; font-weight:bold; font-size:12px;">${item.name}</td></tr>
        <tr><td style="color:#555; font-size:11px;">${item.quantity} × ${item.price.toLocaleString("id-ID")}</td><td style="text-align:right; font-size:11px;">${item.subtotal.toLocaleString("id-ID")}</td></tr>
    `).join("");
    
    printWindow.document.write(`
        <html><head><title>Struk</title><style>
        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 24px; color: #1a1a1a; }
        .center { text-align: center; } .right { text-align: right; }
        .line { border: none; border-top: 1px dashed #bbb; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; }
        h2 { font-size: 15px; margin-bottom: 4px; letter-spacing: 1px; }
        </style></head><body>
        <div class="center">
          <h2>☕ PUTRO SALES</h2>
          <p style="margin:0; font-size:11px; color:#555;">${new Date().toLocaleString("id-ID")}</p>
          <p style="margin-top:5px; font-size:11px;">ID: ${formatID(trxId, "TRX")}</p>
        </div>
        <hr class="line" />
        <p style="margin-bottom:8px; font-size:11px;">Pelanggan: <strong>${custName}</strong></p>
        <table>${itemsHtml}</table>
        <hr class="line" />
        <table>
          <tr><td style="font-size:11px;">Subtotal</td><td class="right" style="font-size:11px;">${total.toLocaleString("id-ID")}</td></tr>
          ${disc > 0 ? `<tr><td style="font-size:11px;">Diskon</td><td class="right" style="font-size:11px;">-${disc.toLocaleString("id-ID")}</td></tr>` : ""}
          <tr><td style="font-weight:bold; font-size:13px;">TOTAL</td><td class="right" style="font-weight:bold; font-size:13px;">${grand.toLocaleString("id-ID")}</td></tr>
        </table>
        <hr class="line" />
        <table>
          <tr><td style="font-size:11px;">Metode</td><td class="right" style="font-size:11px; text-transform:uppercase;">${method}</td></tr>
          ${method === "cash" ? `<tr><td style="font-size:11px;">Tunai</td><td class="right" style="font-size:11px;">${cash.toLocaleString("id-ID")}</td></tr><tr><td style="font-size:11px;">Kembali</td><td class="right" style="font-size:11px;">${change.toLocaleString("id-ID")}</td></tr>` : ""}
        </table>
        <div class="center" style="margin-top:20px; font-size:12px; color:#555;"><p>— Terima Kasih —</p></div>
        <script>window.onload = function(){ window.print(); window.close(); }</script>
        </body></html>
    `);
    printWindow.document.close();
  };

  const processTransaction = async () => {
    if (!selectedBill) return;
    const currentAccount = getCurrentAccount();
    const payload = {
      total_price: selectedBill.totalHarga,
      discount: selectedBill.discount,
      grand_total: selectedBill.grandTotal,
      payment_method: paymentMethod,
      cash_received: paymentMethod === "cash" ? cashNum : selectedBill.grandTotal,
      change_amount: paymentMethod === "cash" ? kembalian : 0,
      customer_name: selectedBill.customerName,
      items: selectedBill.cart,
      created_by_account: currentAccount,
    };
    try {
      const res = await api.post("/transactions", payload);
      const trxId = res.data && res.data[0]?.id ? res.data[0].id : "NEW";
      printReceipt(
        selectedBill.cart,
        selectedBill.totalHarga,
        selectedBill.discount,
        selectedBill.grandTotal,
        paymentMethod,
        paymentMethod === "cash" ? cashNum : selectedBill.grandTotal,
        kembalian,
        trxId,
        selectedBill.customerName,
      );
      handleDeleteBill(selectedBill.id, true);
      setShowQRISModal(false);
    } catch (e) {}
  };

  const handleCheckoutInitiate = () => {
    if (paymentMethod === "cash" && cashNum < selectedBill.grandTotal) return;
    if (paymentMethod === "QRIS") {
      setQrisStatus("waiting");
      setShowQRISModal(true);
    } else {
      processTransaction();
    }
  };

  return (
    <>
      <style>{styles}</style>
      
      {showQRISModal && (
        <div className="bl-modal-overlay">
          <div className="bl-modal">
            <div className="bl-modal-icon"><Icon n="qris" size={32} /></div>
            <div className="bl-modal-title">Pembayaran QRIS</div>
            <div className="bl-qris-amount">Rp {selectedBill.grandTotal.toLocaleString("id-ID")}</div>
            
            {qrisStatus === "waiting" ? (
              <>
                <div className="bl-qris-img">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PutroSales_${selectedBill.grandTotal}`} alt="QR" />
                </div>
                <button className="bl-modal-btn bl-btn-confirm" onClick={() => { setQrisStatus("success"); setTimeout(processTransaction, 1500); }}>
                  <Icon n="check" /> Konfirmasi Bayar
                </button>
                <button className="bl-modal-btn bl-btn-close" onClick={() => setShowQRISModal(false)}>Batalkan</button>
              </>
            ) : (
              <div style={{ padding: '20px' }}>
                <Icon n="check" size={48} style={{ color: '#10B981', marginBottom: '16px' }} />
                <div style={{ fontWeight: '800', color: '#10B981' }}>Berhasil! Mencetak struk...</div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bl-root">
        <div className="bl-left">
          <div className="bl-left-header">
            <div className="bl-title"><Icon n="list" size={22} /> Daftar Tagihan</div>
            <div className="bl-search-wrap">
              <span className="bl-search-icon"><Icon n="search" size={16} /></span>
              <input 
                type="text" 
                className="bl-search-input" 
                placeholder="Cari pelanggan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bl-list">
            {filteredBills.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-sub)' }}>
                <Icon n="alert" size={32} style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '13px', fontWeight: '700' }}>Tagihan tidak ditemukan</div>
              </div>
            ) : (
              filteredBills.map((bill) => (
                <div key={bill.id} className={`bl-card ${selectedBill?.id === bill.id ? "active" : ""}`} onClick={() => handleSelectBill(bill)}>
                  <div className="bl-card-top">
                    <span className="bl-cust-name"><Icon n="user" size={14} style={{ color: 'var(--primary)' }} /> {bill.customerName}</span>
                    <span className="bl-time"><Icon n="clock" size={12} /> {bill.time}</span>
                  </div>
                  <div className="bl-card-btm">
                    <span className="bl-items-count">{bill.cart.length} Item</span>
                    <span className="bl-total">Rp {bill.grandTotal.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bl-right">
          {selectedBill ? (
            <>
              <div className="bl-detail-head">
                <div className="bl-head-info">
                  <div className="bl-head-title">Rincian: {selectedBill.customerName}</div>
                  <div className="bl-head-sub"><Icon n="clock" size={14} /> Disimpan pada {selectedBill.time}</div>
                </div>
                <div style={{ background: 'var(--header-role-bg)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', border: '1px solid var(--primary-soft)' }}>
                  ID: {formatID(selectedBill.id, 'BILL')}
                </div>
              </div>
              
              <div className="bl-items-list">
                {selectedBill.cart.map((c, i) => (
                  <div key={i} className="bl-item">
                    <div className="bl-item-left">
                      <div className="bl-item-thumb">
                        {c.image_url ? (
                          <img src={c.image_url} alt="" />
                        ) : (
                          <Icon n={CATEGORY_ICONS[c.category] || "box"} size={22} style={{ color: "#D97706" }} />
                        )}
                      </div>
                      <div className="bl-item-info">
                        <div className="bl-item-name">{c.name}</div>
                        <div className="bl-item-price">
                          <span className="bl-item-qty">{c.quantity}x</span> @ Rp {Number(c.price).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                    <div className="bl-item-sub">Rp {Number(c.subtotal).toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>

              <div className="bl-pay-panel">
                <div className="bl-summary">
                  <div className="bl-sum-row"><span>Subtotal</span><span>Rp {selectedBill.totalHarga.toLocaleString("id-ID")}</span></div>
                  {selectedBill.discount > 0 && (
                    <div className="bl-sum-row"><span>Diskon</span><span style={{ color: '#EF4444' }}>- Rp {selectedBill.discount.toLocaleString("id-ID")}</span></div>
                  )}
                  <div className="bl-sum-row grand"><span>Total Tagihan</span><span className="bl-grand-val">Rp {selectedBill.grandTotal.toLocaleString("id-ID")}</span></div>
                </div>

                <div className="bl-methods">
                  {[ { k: 'cash', l: 'Tunai', i: 'cash' }, { k: 'QRIS', l: 'QRIS', i: 'qris' }, { k: 'transfer', l: 'Bank', i: 'bank' } ].map(m => (
                    <div key={m.k} className={`bl-method-btn ${paymentMethod === m.k ? "active" : ""}`} onClick={() => setPaymentMethod(m.k)}>
                      <Icon n={m.i} size={18} className="bl-method-icon" />
                      <span className="bl-method-lbl">{m.l}</span>
                    </div>
                  ))}
                </div>

                {paymentMethod === 'cash' && (
                  <>
                    <div className="bl-cash-input-wrap">
                      <Icon n="cash" size={20} className="bl-cash-icon" />
                      <input 
                        type="number" 
                        className="bl-cash-input" 
                        placeholder="Uang Tunai Diterima..." 
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                      />
                    </div>
                    {cashNum > 0 && kembalian >= 0 && (
                      <div className="bl-change-box">
                        <span>Kembalian</span>
                        <span>Rp {kembalian.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                  </>
                )}

                <div className="bl-actions">
                  <button className="bl-btn-del" onClick={() => handleDeleteBill(selectedBill.id)}>
                    <Icon n="trash" size={18} /> Hapus
                  </button>
                  <button className="bl-btn-pay" onClick={handleCheckoutInitiate} disabled={paymentMethod === 'cash' && cashNum < selectedBill.grandTotal}>
                    <Icon n="check" size={20} /> Proses Pembayaran
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bl-empty-right">
              <Icon n="list" size={64} style={{ opacity: 0.2 }} />
              <div style={{ fontWeight: '700' }}>Pilih tagihan untuk memproses pembayaran</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
