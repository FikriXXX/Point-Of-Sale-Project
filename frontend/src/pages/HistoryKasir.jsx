import React, { useState, useEffect } from "react";
import api from "../services/api";
import dayjs from "dayjs";

const Icon = ({ n, size = 16, className = "", style = {} }) => {
  const paths = {
    clipboard: (
      <>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </>
    ),
    user: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    fileText: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    chevronUp: <polyline points="18 15 12 9 6 15" />,
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
    dollarSign: (
      <>
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </>
    ),
    shoppingBag: (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
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
  .hk-root { min-height: 100%; background: var(--bg-app); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; padding: 24px; transition: background 0.3s; }
  .hk-header { margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
  .hk-header-info { display: flex; align-items: center; gap: 16px; }
  .hk-icon { width: 48px; height: 48px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px var(--primary-soft); }
  .hk-title { font-size: 22px; font-weight: 800; color: var(--text-main); }
  .hk-sub { font-size: 12px; color: var(--text-sub); font-weight: 600; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
  
  .hk-filter-bar { background: transparent; padding: 0; border: none; display: flex; align-items: center; gap: 12px; margin-bottom: 24px; box-shadow: none; }
  .hk-search-wrap { position: relative; flex: 1; max-width: 400px; }
  .hk-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-sub); }
  .hk-search-input { width: 100%; padding: 12px 16px 12px 48px; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; font-family: inherit; font-size: 14px; font-weight: 600; color: var(--text-main); outline: none; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
  .hk-search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-soft); }
  .hk-search-input::placeholder { color: var(--text-sub); opacity: 0.7; }

  .hk-list { display: flex; flex-direction: column; gap: 16px; }
  .hk-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
  .hk-card:hover { border-color: var(--text-sub); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  
  .hk-card-main { padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
  .hk-card-info { display: flex; flex-direction: column; gap: 4px; }
  .hk-cashier-name { font-size: 16px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
  .hk-time { font-size: 12px; color: var(--text-sub); font-weight: 600; display: flex; align-items: center; gap: 6px; }
  
  .hk-card-stats { display: flex; gap: 24px; align-items: center; }
  .hk-stat-item { text-align: right; }
  .hk-stat-label { font-size: 11px; color: var(--text-sub); font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
  .hk-stat-value { font-size: 15px; font-weight: 800; color: var(--text-main); }
  .hk-stat-value.revenue { color: var(--primary); }
  
  .hk-expand-btn { color: var(--text-sub); transition: all 0.2s; }
  .hk-card:hover .hk-expand-btn { color: var(--primary); }

  .hk-details { background: var(--bg-app); border-top: 1px solid var(--border); padding: 24px; }
  .hk-details-title { font-size: 13px; font-weight: 800; color: var(--text-main); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  
  .hk-trx-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
  .hk-trx-item { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
  .hk-trx-main { flex: 1; }
  .hk-trx-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
  .hk-trx-id { font-size: 12px; font-weight: 700; color: var(--text-sub); }
  .hk-trx-cust { font-size: 14px; font-weight: 800; color: var(--text-main); }
  
  .hk-trx-badge { padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; text-transform: uppercase; border: 1px solid transparent; }
  .hk-trx-badge.cash { background: #ECFDF5; color: #059669; border-color: #A7F3D0; }
  .hk-trx-badge.qris { background: #EEF2FF; color: #4F46E5; border-color: #C7D2FE; }
  .hk-trx-badge.transfer { background: #FFF7ED; color: #C2410C; border-color: #FFEDD5; }
  
  [data-theme='dark'] .hk-trx-badge.cash { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
  [data-theme='dark'] .hk-trx-badge.qris { background: #1e1b4b; color: #a5b4fc; border-color: #312e81; }
  [data-theme='dark'] .hk-trx-badge.transfer { background: #431407; color: #fdba74; border-color: #7c2d12; }

  .hk-trx-prods { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
  .hk-prod-pill { background: var(--bg-field); color: var(--text-main); padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid var(--border); }
  .hk-prod-qty { color: var(--primary); font-weight: 800; margin-right: 4px; }
  
  .hk-trx-total { text-align: right; }
  .hk-trx-price { font-size: 15px; font-weight: 800; color: #10B981; }

  .hk-empty { padding: 80px 24px; text-align: center; background: var(--bg-card); border-radius: 24px; border: 1px dashed var(--border); }
  .hk-empty-icon { width: 64px; height: 64px; background: var(--bg-field); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--text-sub); margin: 0 auto 16px; }
  .hk-empty-text { font-size: 16px; font-weight: 700; color: var(--text-sub); }

  @media (max-width: 768px) {
    .hk-root { padding: 16px; }
    .hk-card-main { flex-direction: column; align-items: flex-start; gap: 16px; }
    .hk-card-stats { width: 100%; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 16px; }
    .hk-trx-list { grid-template-columns: 1fr; }
    .hk-stat-item { text-align: left; }
  }
`;

export default function HistoryKasir() {
  const [closings, setClosings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClosings();
  }, []);

  const fetchClosings = async () => {
    try {
      const res = await api.get("/shift-closings");
      setClosings(res.data || []);
    } catch (e) {}
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredClosings = closings.filter(c => 
    c.cashier_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatID = (id, prefix) =>
    id ? `${prefix}-${String(id).substring(0, 5).toUpperCase()}` : "";

  const getMethodClass = (method) => {
    const m = String(method).toLowerCase();
    if (m.includes("cash") || m.includes("tunai")) return "cash";
    if (m.includes("qris")) return "qris";
    return "transfer";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="hk-root">
        <div className="hk-header">
          <div className="hk-header-info">
            <div className="hk-icon">
              <Icon n="clipboard" size={24} />
            </div>
            <div>
              <div className="hk-title">History Input Tutup Kasir</div>
              <div className="hk-sub">Panel Audit & Laporan Penutupan Shift</div>
            </div>
          </div>
        </div>

        <div className="hk-filter-bar">
          <div className="hk-search-wrap">
            <span className="hk-search-icon"><Icon n="search" size={18} /></span>
            <input 
              type="text" 
              className="hk-search-input" 
              placeholder="Cari nama kasir..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="hk-list">
          {filteredClosings.length === 0 ? (
            <div className="hk-empty">
              <div className="hk-empty-icon">
                <Icon n="clipboard" size={32} />
              </div>
              <div className="hk-empty-text">
                {searchTerm ? "Tidak ada hasil pencarian." : "Belum ada data input tutup kasir."}
              </div>
            </div>
          ) : (
            filteredClosings.map((c) => {
              let parsedTrx = [];
              if (c.transactions_detail) {
                try {
                  parsedTrx = JSON.parse(c.transactions_detail);
                } catch (e) {}
              }
              const isExpanded = expandedId === c.id;

              return (
                <div key={c.id} className="hk-card">
                  <div className="hk-card-main" onClick={() => toggleExpand(c.id)}>
                    <div className="hk-card-info">
                      <div className="hk-cashier-name">
                        <Icon n="user" size={18} style={{ color: "#D97706" }} /> 
                        {c.cashier_name}
                      </div>
                      <div className="hk-time">
                        <Icon n="calendar" size={14} />
                        {dayjs(c.closed_at).format("DD MMM YYYY • HH:mm:ss")}
                      </div>
                    </div>
                    
                    <div className="hk-card-stats">
                      <div className="hk-stat-item">
                        <div className="hk-stat-label">Total Transaksi</div>
                        <div className="hk-stat-value">
                          <Icon n="shoppingBag" size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
                          {c.total_orders} Order
                        </div>
                      </div>
                      <div className="hk-stat-item">
                        <div className="hk-stat-label">Pendapatan Shift</div>
                        <div className="hk-stat-value revenue">
                          Rp {Number(c.total_revenue).toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div className="hk-expand-btn">
                        <Icon n={isExpanded ? "chevronUp" : "chevronDown"} size={20} />
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="hk-details">
                      <div className="hk-details-title">
                        <Icon n="fileText" size={16} /> Rincian Transaksi Shift
                      </div>

                      {parsedTrx.length === 0 ? (
                        <div style={{ fontSize: "13px", color: "#94A3B8", fontWeight: "600", padding: "12px" }}>
                          Rincian item tidak tersedia untuk sesi ini.
                        </div>
                      ) : (
                        <div className="hk-trx-list">
                          {parsedTrx.map((t) => (
                            <div key={t.id} className="hk-trx-item">
                              <div className="hk-trx-main">
                                <div className="hk-trx-head">
                                  <span className="hk-trx-cust">{t.customer_name || "Umum"}</span>
                                  <span className={`hk-trx-badge ${getMethodClass(t.payment_method)}`}>
                                    {t.payment_method}
                                  </span>
                                </div>
                                <div className="hk-trx-id">{formatID(t.id, "TRX")}</div>
                                <div className="hk-trx-prods">
                                  {t.transaction_details?.map((d, idx) => (
                                    <div key={idx} className="hk-prod-pill">
                                      <span className="hk-prod-qty">{d.quantity}x</span>
                                      {d.products?.product_name || "Item"}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="hk-trx-total">
                                <div className="hk-trx-price">
                                  Rp {Number(t.grand_total).toLocaleString("id-ID")}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
