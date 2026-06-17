import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Icon = ({ n, size = 16, className = "", style = {} }) => {
    const paths = {
        fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
        plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
        edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
        coffee: <><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></>,
        food: <><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></>,
        refresh: <><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></>,
        x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
        save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
        clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></>,
        link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
        trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>
    };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[n]}</svg>;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  .hpp-root { min-height: 100%; background: var(--bg-app); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; padding: 24px; transition: background 0.3s; }
  .hpp-page-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 14px; }
  .hpp-page-icon { width: 42px; height: 42px; background: #10B981; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; box-shadow: 0 4px 12px rgba(16,185,129,0.2); }
  .hpp-page-title { font-size: 18px; font-weight: 800; color: var(--text-main); }
  .hpp-page-sub { font-size: 12px; color: var(--text-sub); margin-top: 2px; font-weight: 600; }
  .hpp-form-card { background: var(--bg-card); border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid var(--border); transition: all 0.3s; }
  .hpp-form-card.edit-mode { border-color: #10B981; box-shadow: 0 8px 20px rgba(16,185,129,0.06); }
  .form-card-header { margin-bottom: 20px; font-size: 15px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
  .edit-badge { background: #ECFDF5; color: #059669; font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 800; }
  [data-theme='dark'] .edit-badge { background: #064e3b; color: #6ee7b7; }
  .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; text-align: left; }
  .form-label { font-size: 12px; font-weight: 700; color: var(--text-sub); }
  .form-input { padding: 12px 14px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 10px; color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box; }
  .form-input:focus { border-color: #10B981; background: var(--bg-card); box-shadow: 0 0 0 3px rgba(16,185,129,0.1); }
  .preset-group { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .btn-preset { background: var(--bg-card); border: 2px solid var(--border); padding: 10px 14px; border-radius: 10px; color: var(--text-sub); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 6px; }
  .btn-preset:hover { background: #ECFDF5; color: #059669; border-color: #A7F3D0; }
  [data-theme='dark'] .btn-preset:hover { background: #064e3b; color: #6ee7b7; border-color: #065f46; }
  .ingredient-row { display: flex; gap: 12px; margin-bottom: 12px; align-items: center; }
  .ing-name { flex: 2; }
  .ing-cost { flex: 1; }
  .btn-del-ing { background: #FEF2F2; color: #EF4444; border: none; cursor: pointer; border-radius: 8px; display: flex; align-items: center; justify-content: center; height: 44px; width: 44px; flex-shrink: 0; }
  [data-theme='dark'] .btn-del-ing { background: #450a0a; color: #f87171; }
  .btn-del-ing:hover { background: #FEE2E2; }
  .btn-add-ing { background: var(--bg-app); border: 2px dashed #10B981; color: #10B981; padding: 14px; border-radius: 10px; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; width: 100%; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.2s; }
  .btn-add-ing:hover { background: #ECFDF5; }
  [data-theme='dark'] .btn-add-ing:hover { background: #064e3b; }
  .total-display { background: #ECFDF5; border: 2px solid #A7F3D0; border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; color: #059669; margin-bottom: 24px; }
  [data-theme='dark'] .total-display { background: #064e3b; border-color: #065f46; color: #6ee7b7; }
  .total-label { font-weight: 800; font-size: 13px; }
  .total-value { font-size: 20px; font-weight: 800; }
  .form-actions { display: flex; gap: 10px; }
  .btn-primary { padding: 14px 24px; background: #10B981; border: none; border-radius: 10px; color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; flex: 2; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.2s; }
  .btn-primary:hover { background: #059669; }
  .btn-secondary { padding: 14px 20px; background: var(--bg-field); border: none; border-radius: 10px; color: var(--text-sub); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; flex: 1; transition: 0.2s; }
  .btn-secondary:hover { background: var(--border); }
  .table-card { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; transition: background 0.3s, border 0.3s; }
  .table-card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; background: var(--bg-app); }
  .table-card-title { font-size: 14px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
  .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { width: 100%; border-collapse: collapse; min-width: 650px; }
  thead tr { background: var(--bg-card); border-bottom: 1px solid var(--border); }
  thead th { padding: 14px 16px; font-size: 11px; font-weight: 800; color: var(--text-sub); text-transform: uppercase; text-align: left; white-space: nowrap; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
  tbody tr:hover { background: var(--bg-app); }
  tbody td { padding: 16px; font-size: 13px; color: var(--text-main); vertical-align: top; text-align: left; }
  .td-name { font-weight: 800; color: var(--text-main); margin-bottom: 6px; font-size: 14px; }
  .ing-list { font-size: 12px; color: var(--text-sub); line-height: 1.6; font-weight: 600; }
  .td-amount { font-weight: 800; color: #10B981; font-size: 14px; }
  .action-btns { display: flex; gap: 6px; flex-wrap: wrap; }
  .btn-assign { padding: 8px 12px; background: #ECFDF5; border: 2px solid #A7F3D0; border-radius: 8px; color: #059669; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; cursor: pointer; flex: 1; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px; transition: 0.2s; }
  [data-theme='dark'] .btn-assign { background: #064e3b; border-color: #065f46; color: #6ee7b7; }
  .btn-assign:hover { background: #10B981; color: white; border-color: #10B981; }
  .btn-edit { padding: 8px 12px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; color: #3B82F6; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; cursor: pointer; flex: 1; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px; transition: 0.2s; }
  .btn-edit:hover { background: #EFF6FF; border-color: #BFDBFE; }
  [data-theme='dark'] .btn-edit:hover { background: #1e3a8a; }
  .btn-delete { padding: 8px 12px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; color: #EF4444; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; font-weight: 800; cursor: pointer; flex: 1; text-align: center; display: flex; align-items: center; justify-content: center; gap: 4px; transition: 0.2s; }
  .btn-delete:hover { background: #FEF2F2; border-color: #FECACA; }
  [data-theme='dark'] .btn-delete:hover { background: #450a0a; }
  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(17,24,39,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); padding: 20px; }
  .assign-modal { background: var(--bg-card); padding: 32px; border-radius: 20px; border: 1px solid var(--border); width: 100%; max-width: 460px; max-height: 80vh; display: flex; flex-direction: column; text-align: left; transition: background 0.3s, border 0.3s; }
  .assign-modal h3 { color: var(--text-main); margin-top: 0; margin-bottom: 6px; font-size: 17px; font-weight: 800; display: flex; align-items: center; gap: 8px; }
  .product-list { overflow-y: auto; flex: 1; margin: 16px 0 24px; border: 2px solid var(--border); border-radius: 14px; padding: 12px; background: var(--bg-app); display: flex; flex-direction: column; gap: 6px; }
  .product-checkbox { display: flex; align-items: center; gap: 12px; padding: 12px; cursor: pointer; border-radius: 10px; background: var(--bg-card); border: 1px solid var(--border); font-size: 13px; font-weight: 700; color: var(--text-main); transition: 0.2s; }
  .product-checkbox:hover { background: var(--primary-soft); border-color: var(--primary); }
  .product-checkbox.disabled { opacity: 0.5; cursor: not-allowed; background: var(--bg-field); }
  .product-checkbox input[type="checkbox"] { width: 18px; height: 18px; accent-color: #10B981; cursor: pointer; }
  .modal-actions { display: flex; gap: 10px; }
  .btn-save-assign { flex: 2; padding: 14px; background: #10B981; color: white; border: none; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; }
  .btn-save-assign:hover { background: #059669; }
  .btn-cancel-assign { flex: 1; padding: 14px; background: #FEF2F2; color: #EF4444; border: none; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; }
  [data-theme='dark'] .btn-cancel-assign { background: #450a0a; color: #f87171; }
  .btn-cancel-assign:hover { background: #FEE2E2; }
  @media (max-width: 768px) {
    .hpp-root { padding: 16px; }
    .hpp-form-card { padding: 18px; }
    .ingredient-row { flex-direction: column; align-items: stretch; border: 2px solid var(--border); padding: 14px; border-radius: 12px; }
    .btn-del-ing { width: 100%; height: auto; padding: 10px; margin-top: 4px; }
    .form-actions { flex-direction: column; }
    .action-btns { flex-direction: column; }
    .total-display { flex-direction: column; gap: 8px; text-align: center; }
  }
`;

export default function Hpp() {
    const [templates, setTemplates] = useState([]);
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [ingredients, setIngredients] = useState([{ itemName: '', cost: '' }]);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState(null);
    const [selectedProductIds, setSelectedProductIds] = useState([]);

    useEffect(() => {
        fetchTemplates();
        fetchProducts();
    }, []);

    const fetchTemplates = async () => {
        try { const res = await api.get('/hpp-templates'); setTemplates(res.data); } catch { }
    };

    const fetchProducts = async () => {
        try { const res = await api.get('/products'); setProducts(res.data); } catch { }
    };

    const presetKopi = [
        { itemName: 'Biji Kopi / Espresso', cost: '3500' },
        { itemName: 'Susu Fresh Milk / UHT', cost: '3000' },
        { itemName: 'Gula Aren / Sirup', cost: '1500' },
        { itemName: 'Cup, Es Batu & Sedotan', cost: '2000' }
    ];

    const presetMakanan = [
        { itemName: 'Bahan Utama (Nasi/Mie/Daging)', cost: '7000' },
        { itemName: 'Bumbu & Minyak', cost: '2000' },
        { itemName: 'Sayuran / Telur', cost: '2500' },
        { itemName: 'Packaging / Kotak Makan', cost: '1500' }
    ];

    const handleAddRow = () => setIngredients([...ingredients, { itemName: '', cost: '' }]);

    const handleRemoveRow = (index) => {
        const newIng = [...ingredients];
        newIng.splice(index, 1);
        setIngredients(newIng.length ? newIng : [{ itemName: '', cost: '' }]);
    };

    const handleChange = (index, field, value) => {
        const newIng = [...ingredients];
        newIng[index][field] = value;
        setIngredients(newIng);
    };

    const totalAmount = ingredients.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

    const handleEdit = (template) => {
        setIsEdit(true);
        setCurrentId(template.id);
        setName(template.name);
        setIngredients(template.ingredients ? JSON.parse(template.ingredients) : [{ itemName: '', cost: '' }]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEdit(false);
        setCurrentId(null);
        setName('');
        setIngredients([{ itemName: '', cost: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            amount: totalAmount,
            ingredients: JSON.stringify(ingredients.filter(i => i.itemName.trim() !== ''))
        };

        try {
            if (isEdit) {
                await api.put(`/hpp-templates/${currentId}`, payload);
            } else {
                await api.post('/hpp-templates', payload);
            }
            cancelEdit();
            fetchTemplates();
            fetchProducts();
        } catch { }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus template HPP ini? Semua produk terkait akan kehilangan tautan template ini.')) {
            try { await api.delete(`/hpp-templates/${id}`); fetchTemplates(); fetchProducts(); }
            catch { }
        }
    };

    const openAssignModal = (template) => {
        setActiveTemplate(template);
        const assigned = products.filter(p => p.hpp_template_id === template.id).map(p => p.id);
        setSelectedProductIds(assigned);
        setShowAssignModal(true);
    };

    const handleToggleProduct = (productId) => {
        setSelectedProductIds(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };

    const handleSaveAssign = async () => {
        try {
            await api.post(`/hpp-templates/${activeTemplate.id}/assign`, { product_ids: selectedProductIds, amount: activeTemplate.amount });
            setShowAssignModal(false);
            fetchProducts();
        } catch { }
    };

    return (
        <>
            <style>{styles}</style>

            {showAssignModal && (
                <div className="modal-overlay">
                    <div className="assign-modal">
                        <h3><Icon n="link" size={20} /> Terapkan "{activeTemplate?.name}"</h3>
                        <div style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>Pilih produk yang akan menggunakan rincian modal HPP ini.</div>
                        <div className="product-list">
                            {products.filter(p => p.stock !== -999).map(p => {
                                const isAssignedToOther = p.hpp_template_id && p.hpp_template_id !== activeTemplate.id;
                                const isChecked = selectedProductIds.includes(p.id);
                                return (
                                    <label key={p.id} className={`product-checkbox ${isAssignedToOther ? 'disabled' : ''}`}>
                                        <input type="checkbox" checked={isChecked} disabled={isAssignedToOther} onChange={() => handleToggleProduct(p.id)} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '800', fontSize: '15px' }}>{p.product_name}</div>
                                            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', fontWeight: '700' }}>HPP Aktif: Rp {Number(p.cost_price).toLocaleString()}</div>
                                        </div>
                                        {isAssignedToOther && <span style={{ fontSize: '11px', color: '#EF4444', border: '2px solid #EF4444', padding: '4px 10px', borderRadius: '8px', fontWeight: '800' }}>Terkunci Template Lain</span>}
                                    </label>
                                )
                            })}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-cancel-assign" onClick={() => setShowAssignModal(false)}>Batal</button>
                            <button className="btn-save-assign" onClick={handleSaveAssign}>Simpan Tautan</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="hpp-root">
                <div className="hpp-page-header">
                    <div className="hpp-page-icon"><Icon n="fileText" size={24} /></div>
                    <div style={{ textAlign: 'left' }}>
                        <div className="hpp-page-title">Template HPP & Resep</div>
                        <div className="hpp-page-sub">DATA MASTER • RINCIAN MODAL PRODUK</div>
                    </div>
                </div>

                <div className={`hpp-form-card ${isEdit ? 'edit-mode' : ''}`}>
                    <div className="form-card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Icon n={isEdit ? "edit" : "plus"} /> {isEdit ? 'Edit Template HPP' : 'Buat Template HPP Baru'}
                        </div>
                        {isEdit && <span className="edit-badge">EDIT MODE</span>}
                    </div>

                    <div className="preset-group">
                        <button className="btn-preset" onClick={() => { setIngredients([...presetKopi]); setName('HPP Kopi Standar'); }}><Icon n="coffee" /> Pakai Preset Kopi</button>
                        <button className="btn-preset" onClick={() => { setIngredients([...presetMakanan]); setName('HPP Makanan Standar'); }}><Icon n="food" /> Pakai Preset Makanan</button>
                        <button className="btn-preset" onClick={() => { setIngredients([{ itemName: '', cost: '' }]); setName(''); }} style={{ color: '#EF4444', borderColor: '#FEE2E2', background: '#FEF2F2' }}><Icon n="refresh" /> Reset Bersih</button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Nama Template / Menu</label>
                            <input className="form-input" type="text" placeholder="Misal: Kopi Susu Gula Aren" value={name} onChange={e => setName(e.target.value)} required />
                        </div>

                        <div style={{ marginTop: '24px', marginBottom: '12px', textAlign: 'left' }}>
                            <label className="form-label" style={{ color: '#111827' }}>Rincian Bahan Baku & Modal:</label>
                        </div>

                        {ingredients.map((ing, index) => (
                            <div key={index} className="ingredient-row">
                                <input className="form-input ing-name" type="text" placeholder="Nama Bahan (Cth: Susu UHT)" value={ing.itemName} onChange={e => handleChange(index, 'itemName', e.target.value)} required />
                                <input className="form-input ing-cost" type="number" placeholder="Harga (Rp)" value={ing.cost} onChange={e => handleChange(index, 'cost', e.target.value)} required />
                                <button type="button" className="btn-del-ing" onClick={() => handleRemoveRow(index)}><Icon n="x" /></button>
                            </div>
                        ))}

                        <button type="button" className="btn-add-ing" onClick={handleAddRow}><Icon n="plus" /> Tambah Bahan Baku</button>

                        <div className="total-display">
                            <span className="total-label">TOTAL HPP (MODAL PER PORSI):</span>
                            <span className="total-value">Rp {totalAmount.toLocaleString()}</span>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary"><Icon n="save" /> {isEdit ? 'Simpan Perubahan Template' : 'Simpan Template Baru'}</button>
                            {isEdit && <button type="button" className="btn-secondary" onClick={cancelEdit}>Batal Edit</button>}
                        </div>
                    </form>
                </div>

                <div className="table-card">
                    <div className="table-card-header">
                        <div className="table-card-title"><Icon n="clipboard" /> Daftar Template Tersimpan</div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '35%' }}>Nama & Rincian Bahan</th>
                                <th style={{ width: '25%' }}>Total HPP</th>
                                <th style={{ width: '40%', textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {templates.length === 0 ? <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF', fontWeight: '700', fontSize: '14px' }}>Belum ada data template.</td></tr> : templates.map(t => {
                                const parsedIng = t.ingredients ? JSON.parse(t.ingredients) : [];
                                const linkedCount = products.filter(p => p.hpp_template_id === t.id).length;
                                return (
                                    <tr key={t.id}>
                                        <td>
                                            <div className="td-name">{t.name}</div>
                                            <div className="ing-list">
                                                {parsedIng.length > 0 ? parsedIng.map((i, idx) => (
                                                    <div key={idx}>• {i.itemName} <span style={{ color: '#9CA3AF', fontWeight: '700' }}>(Rp {Number(i.cost).toLocaleString()})</span></div>
                                                )) : <i style={{ fontWeight: '500' }}>Tidak ada rincian bahan</i>}
                                            </div>
                                            <div style={{ marginTop: '12px', fontSize: '12px', color: '#10B981', fontWeight: '800' }}>Tautkan ke {linkedCount} Produk</div>
                                        </td>
                                        <td>
                                            <div className="td-amount">Rp {Number(t.amount).toLocaleString()}</div>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn-assign" onClick={() => openAssignModal(t)}><Icon n="link" size={14} /> Terapkan</button>
                                                <button className="btn-edit" onClick={() => handleEdit(t)}><Icon n="edit" size={14} /> Edit</button>
                                                <button className="btn-delete" onClick={() => handleDelete(t.id)}><Icon n="trash" size={14} /> Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}