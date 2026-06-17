import React, { useState, useEffect } from "react";
import api from "../services/api";

const Icon = ({ n, size = 16, className = "", style = {} }) => {
  const paths = {
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </>
    ),
    edit: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    plus: (
      <>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </>
    ),
    save: (
      <>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </>
    ),
    clipboard: (
      <>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
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
  .admin-root { min-height: 100%; background: var(--bg-app); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; padding: 24px; transition: background 0.3s; }
  .admin-page-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 14px; }
  .admin-page-icon { width: 42px; height: 42px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
  .admin-page-title { font-size: 18px; font-weight: 800; color: var(--text-main); }
  .admin-page-sub { font-size: 12px; color: var(--text-sub); font-weight: 600; margin-top: 2px; }
  .admin-form-card { background: var(--bg-card); border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid var(--border); transition: all 0.3s; }
  .admin-form-card.edit-mode { border-color: var(--primary); box-shadow: 0 8px 20px var(--primary-soft); }
  .form-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .form-card-title { font-size: 15px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
  .edit-badge { background: var(--header-role-bg); color: var(--primary); font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 800; }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; text-align: left; }
  .form-label { font-size: 12px; font-weight: 700; color: var(--text-sub); }
  .form-input { padding: 12px 14px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 10px; color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; outline: none; transition: all 0.2s; width: 100%; }
  .form-input:focus { border-color: var(--primary); background: var(--bg-card); box-shadow: 0 0 0 3px var(--primary-soft); }
  select.form-input option { background: var(--bg-card); color: var(--text-main); }
  .image-upload-wrapper { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .image-upload-btn-box { position: relative; overflow: hidden; display: inline-block; flex-shrink: 0; }
  .image-upload-btn-box input[type="file"] { position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; height: 100%; width: 100%; }
  .btn-upload-trigger { background: var(--header-role-bg); border: 2px solid var(--primary-soft); color: var(--primary); padding: 11px 14px; border-radius: 10px; font-weight: 800; font-size: 12px; display: flex; align-items: center; gap: 6px; cursor: pointer; white-space: nowrap; }
  .form-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn-primary { padding: 14px 24px; background: var(--primary); border: none; border-radius: 10px; color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .btn-primary:hover { background: var(--primary-hover); }
  .btn-secondary { padding: 14px 20px; background: var(--bg-field); border: none; border-radius: 10px; color: var(--text-sub); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; }
  .btn-secondary:hover { background: var(--border); }
  .table-card { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; transition: background 0.3s, border 0.3s; }
  .table-card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg-app); }
  .table-card-title { font-size: 14px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
  .table-count { font-size: 11px; color: var(--text-sub); font-weight: 700; }
  .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { width: 100%; border-collapse: collapse; min-width: 700px; }
  thead tr { background: var(--bg-card); border-bottom: 1px solid var(--border); }
  thead th { padding: 14px 16px; font-size: 11px; font-weight: 800; color: var(--text-sub); text-transform: uppercase; text-align: left; white-space: nowrap; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
  tbody tr:hover { background: var(--bg-app); }
  tbody td { padding: 14px 16px; font-size: 13px; color: var(--text-main); text-align: left; vertical-align: middle; }
  .col-center { text-align: center !important; }
  .td-thumb-box { width: 40px; height: 40px; border-radius: 8px; background: var(--bg-field); display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--border); flex-shrink: 0; }
  .td-thumb-box img { width: 100%; height: 100%; object-fit: cover; }
  .td-product-cell { display: flex; align-items: center; gap: 12px; }
  .td-id { font-size: 11px; color: var(--text-sub); font-weight: 700; }
  .td-name { font-weight: 800; color: var(--text-main); font-size: 13px; }
  .cat-tag { display: inline-block; padding: 3px 10px; background: var(--bg-field); border-radius: 6px; font-size: 11px; color: var(--text-sub); font-weight: 700; border: 1px solid var(--border); }
  .td-sell { color: var(--primary); font-weight: 800; font-size: 13px; }
  .stock-badge { display: inline-flex; gap: 4px; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; }
  .stock-ok { background: #ECFDF5; color: #059669; }
  [data-theme='dark'] .stock-ok { background: #064e3b; color: #6ee7b7; }
  .stock-low { background: #FFFBEB; color: #D97706; }
  [data-theme='dark'] .stock-low { background: #451a03; color: #fbbf24; }
  .stock-out { background: #FEF2F2; color: #EF4444; }
  [data-theme='dark'] .stock-out { background: #450a0a; color: #f87171; }
  .action-btns { display: flex; gap: 6px; justify-content: center; }
  .btn-edit { padding: 7px 12px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; color: #3B82F6; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s; }
  .btn-edit:hover { background: #EFF6FF; border-color: #BFDBFE; }
  [data-theme='dark'] .btn-edit:hover { background: #1e3a8a; }
  .btn-delete { padding: 7px 12px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; color: #EF4444; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s; }
  .btn-delete:hover { background: #FEF2F2; border-color: #FECACA; }
  [data-theme='dark'] .btn-delete:hover { background: #450a0a; }
  .search-input-table { padding: 10px 14px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--text-main); outline: none; transition: 0.2s; width: 220px; }
  .search-input-table:focus { border-color: var(--primary); background: var(--bg-card); }
  .search-input-table::placeholder { color: var(--text-sub); opacity: 0.7; }
  .pagination-controls { display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px 20px; border-top: 1px solid var(--border); }
  .page-btn { padding: 8px 16px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; color: var(--text-sub); transition: 0.2s; }
  .page-btn:hover:not(:disabled) { background: var(--primary); color: white; border-color: var(--primary); }
  .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  @media (max-width: 768px) {
    .admin-root { padding: 16px; }
    .admin-form-card { padding: 18px; }
    .form-grid { grid-template-columns: 1fr; }
    .form-actions { flex-direction: column; }
    .btn-primary, .btn-secondary { width: 100%; }
    .image-upload-wrapper { flex-direction: column; align-items: stretch; }
    .action-btns { flex-direction: column; gap: 4px; }
  }
`;

const formatID = (id, prefix) =>
  id ? `${prefix}-${String(id).substring(0, 5).toUpperCase()}` : "";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [hppTemplates, setHppTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    cost_price: "",
    stock: "",
    category: "",
    hpp_template_id: "",
    image_url: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const categoryOptions = [
    "Makanan",
    "Minuman",
    "Kopi",
    "Snack",
    "Dessert",
    "Sembako",
    "Bumbu Dapur",
    "Pembersih",
    "Kesehatan",
    "Lainnya",
  ];

  useEffect(() => {
    fetchProducts();
    fetchHppTemplates();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {}
  };

  const fetchHppTemplates = async () => {
    try {
      const res = await api.get("/hpp-templates");
      setHppTemplates(res.data);
    } catch {}
  };

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const tmpl = hppTemplates.find((t) => t.id === selectedId);
      setFormData({
        ...formData,
        cost_price: tmpl.amount,
        hpp_template_id: tmpl.id,
      });
    } else {
      setFormData({ ...formData, hpp_template_id: "" });
    }
  };

  const handleEditClick = (p) => {
    setIsEdit(true);
    setCurrentId(p.id);
    setFormData({
      product_name: p.product_name,
      price: p.price,
      cost_price: p.cost_price,
      stock: p.stock,
      category: p.category,
      hpp_template_id: p.hpp_template_id || "",
      image_url: p.image_url || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData({
      product_name: "",
      price: "",
      cost_price: "",
      stock: "",
      category: "",
      hpp_template_id: "",
      image_url: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      hpp_template_id: formData.hpp_template_id || null,
    };
    try {
      if (isEdit) {
        await api.put(`/products/${currentId}`, payload);
        alert("Produk berhasil diperbarui!");
      } else {
        await api.post("/products", payload);
        alert("Produk baru berhasil ditambahkan!");
      }
      cancelEdit();
      fetchProducts();
    } catch (err) {
      alert(
        "Gagal menyimpan produk: " +
          (err.response?.data?.error ||
            err.message ||
            "Periksa koneksi atau struktur tabel di Supabase Anda."),
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini secara permanen?")) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch {
        alert("Gagal menghapus produk.");
      }
    }
  };

  const getStockClass = (s) =>
    s === 0 ? "stock-out" : s <= 5 ? "stock-low" : "stock-ok";
  const getStockLabel = (s) =>
    s === 0 ? "Habis" : s <= 5 ? `Sisa ${s}` : `Stok ${s}`;

  return (
    <>
      <style>{styles}</style>
      <div className="admin-root">
        <div className="admin-page-header">
          <div className="admin-page-icon">
            <Icon n="settings" size={24} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div className="admin-page-title">Manajemen Produk</div>
          </div>
        </div>
        <div className={`admin-form-card ${isEdit ? "edit-mode" : ""}`}>
          <div className="form-card-header">
            <div className="form-card-title">
              <Icon n={isEdit ? "edit" : "plus"} />{" "}
              {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
            </div>
            {isEdit && <span className="edit-badge">EDIT MODE</span>}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">
                  Terapkan Template HPP (Opsional)
                </label>
                <select
                  className="form-input"
                  onChange={handleTemplateSelect}
                  value={formData.hpp_template_id || ""}
                >
                  <option value="">Input Manual (Tanpa Template)</option>
                  {hppTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} - Rp {Number(t.amount).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                <label className="form-label">Gambar Produk / Thumbnail</label>
                <div className="image-upload-wrapper">
                  <div className="image-upload-btn-box">
                    <span className="btn-upload-trigger">
                      <Icon n="image" size={16} /> Pilih File Gambar
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <input
                    className="form-input"
                    style={{ flex: 1 }}
                    type="text"
                    name="image_url"
                    placeholder="Atau tempel tautan (URL) gambar di sini..."
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {[
                {
                  label: "Nama Produk",
                  name: "product_name",
                  type: "text",
                  readOnly: false,
                },
                {
                  label: "Harga Jual",
                  name: "price",
                  type: "number",
                  readOnly: false,
                },
                {
                  label: "Harga Modal (HPP)",
                  name: "cost_price",
                  type: "number",
                  readOnly: formData.hpp_template_id ? true : false,
                },
                {
                  label: "Stok",
                  name: "stock",
                  type: "number",
                  readOnly: false,
                },
              ].map((f) => (
                <div key={f.name} className="form-group">
                  <label className="form-label">
                    {f.label}{" "}
                    {f.readOnly && (
                      <span style={{ color: "#10b981" }}>
                        (Terkunci Template)
                      </span>
                    )}
                  </label>
                  <input
                    className="form-input"
                    type={f.type}
                    name={f.name}
                    value={formData[f.name]}
                    onChange={handleInputChange}
                    readOnly={f.readOnly}
                    required
                  />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Kategori</label>
                <select
                  className="form-input"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    Pilih Kategori
                  </option>
                  {categoryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <Icon n="save" /> {isEdit ? "Update Produk" : "Simpan Produk"}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={cancelEdit}
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="table-card">
          <div className="table-card-header">
            <div className="table-card-title">
              <Icon n="clipboard" /> Daftar Produk Aktif
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                className="search-input-table"
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
              <div className="table-count">{products.length} items</div>
            </div>
          </div>
          <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga Jual</th>
                <th>Modal (HPP)</th>
                <th>Untung / Pcs</th>
                <th className="col-center">Stok</th>
                <th className="col-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filtered = products.filter(p => p.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
                const totalPages = Math.ceil(filtered.length / itemsPerPage);
                const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                return paginated;
              })().map((p) => {
                const margin = Number(p.price) - Number(p.cost_price);
                const pct =
                  Number(p.cost_price) > 0
                    ? ((margin / Number(p.cost_price)) * 100).toFixed(0)
                    : 0;
                const tmpl = p.hpp_template_id
                  ? hppTemplates.find((t) => t.id === p.hpp_template_id)
                  : null;

                return (
                  <tr key={p.id}>
                    <td>
                      <div className="td-product-cell">
                        <div className="td-thumb-box">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" />
                          ) : (
                            <Icon
                              n="image"
                              size={20}
                              style={{ color: "#D1D5DB" }}
                            />
                          )}
                        </div>
                        <div>
                          <div className="td-name">{p.product_name}</div>
                          <div className="td-id">{formatID(p.id, "PRD")}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="cat-tag">{p.category || "-"}</span>
                    </td>
                    <td className="td-sell">
                      Rp {Number(p.price).toLocaleString()}
                    </td>
                    <td>
                      <div
                        style={{
                          color: "#4B5563",
                          fontWeight: "800",
                          fontSize: "14px",
                        }}
                      >
                        Rp {Number(p.cost_price).toLocaleString()}
                      </div>
                      {tmpl && (
                        <div
                          style={{
                            fontSize: "11px",
                            color: "#10b981",
                            marginTop: "2px",
                            fontWeight: "800",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <Icon n="link" size={10} /> {tmpl.name}
                        </div>
                      )}
                    </td>
                    <td className="col-center">
                      <span className={`stock-badge ${getStockClass(p.stock)}`}>
                        {getStockLabel(p.stock)}
                      </span>
                    </td>
                    <td className="col-center">
                      <div className="action-btns">
                        <button
                          className="btn-edit"
                          onClick={() => handleEditClick(p)}
                        >
                          <Icon n="edit" size={14} /> Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(p.id)}
                        >
                          <Icon n="trash" size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          {(() => {
            const filtered = products.filter(p => p.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
            const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
            return (
              <div className="pagination-controls">
                <button className="page-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#4B5563' }}>Page {currentPage} of {totalPages}</span>
                <button className="page-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
              </div>
            );
          })()}
        </div>
      </div>
    </>
  );
}
