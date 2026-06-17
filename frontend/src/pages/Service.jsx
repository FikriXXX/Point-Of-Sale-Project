import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Icon = ({ n, size = 16, className = "", style = {} }) => {
    const paths = {
        shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
        plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
        edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
        save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></>,
        trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
        check: <><polyline points="20 6 9 17 4 12" /></>
    };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[n]}</svg>;
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  .service-root { min-height: 100%; background: var(--bg-app); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; padding: 24px; transition: background 0.3s; }
  .service-page-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 14px; }
  .service-page-icon { width: 42px; height: 42px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; box-shadow: 0 4px 12px var(--primary-soft); }
  .service-page-title { font-size: 18px; font-weight: 800; color: var(--text-main); }
  .service-page-sub { font-size: 12px; color: var(--text-sub); font-weight: 600; margin-top: 2px; }
  .service-form-card { background: var(--bg-card); border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid var(--border); transition: all 0.3s; }
  .service-form-card.edit-mode { border-color: var(--primary); box-shadow: 0 8px 20px var(--primary-soft); }
  .form-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .form-card-title { font-size: 15px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
  .edit-badge { background: var(--header-role-bg); color: var(--primary); font-size: 10px; padding: 3px 8px; border-radius: 6px; font-weight: 800; }
  .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; text-align: left; }
  .form-label { font-size: 12px; font-weight: 700; color: var(--text-sub); }
  .form-input { padding: 12px 14px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 10px; color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700; outline: none; transition: all 0.2s; width: 100%; }
  .form-input:focus { border-color: var(--primary); background: var(--bg-card); box-shadow: 0 0 0 3px var(--primary-soft); }
  .checkbox-group-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; margin-top: 8px; }
  .feature-checkbox { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: var(--bg-app); border: 2px solid var(--border); border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 12px; font-weight: 700; color: var(--text-main); }
  .feature-checkbox:hover { border-color: var(--primary); background: var(--bg-card); }
  .feature-checkbox input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--primary); cursor: pointer; }
  .form-actions { display: flex; gap: 10px; margin-top: 12px; }
  .btn-primary { padding: 14px 24px; background: var(--primary); border: none; border-radius: 10px; color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: 0.2s; }
  .btn-primary:hover { background: var(--primary-hover); }
  .btn-secondary { padding: 14px 20px; background: var(--bg-field); border: none; border-radius: 10px; color: var(--text-sub); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.2s; }
  .btn-secondary:hover { background: var(--border); }
  .table-card { background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; transition: background 0.3s, border 0.3s; }
  .table-card-header { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--bg-app); }
  .table-card-title { font-size: 14px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
  .table-count { font-size: 11px; color: var(--text-sub); font-weight: 700; }
  .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  table { width: 100%; border-collapse: collapse; min-width: 600px; }
  thead tr { background: var(--bg-card); border-bottom: 1px solid var(--border); }
  thead th { padding: 14px 16px; font-size: 11px; font-weight: 800; color: var(--text-sub); text-transform: uppercase; text-align: left; white-space: nowrap; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.15s; }
  tbody tr:hover { background: var(--bg-app); }
  tbody td { padding: 14px 16px; font-size: 13px; color: var(--text-main); text-align: left; vertical-align: middle; }
  .col-center { text-align: center !important; }
  .td-role-name { font-weight: 800; color: var(--text-main); font-size: 13px; }
  .td-email { font-size: 12px; color: var(--text-sub); font-weight: 600; margin-top: 2px; }
  .feature-tags-wrapper { display: flex; gap: 4px; flex-wrap: wrap; }
  .feat-tag { background: var(--header-role-bg); color: var(--primary); padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; border: 1px solid var(--primary-soft); }
  .action-btns { display: flex; gap: 6px; justify-content: center; }
  .btn-edit { padding: 7px 12px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; color: #3B82F6; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s; }
  .btn-edit:hover { background: #EFF6FF; border-color: #BFDBFE; }
  [data-theme='dark'] .btn-edit:hover { background: #1e3a8a; }
  .btn-delete { padding: 7px 12px; background: var(--bg-card); border: 2px solid var(--border); border-radius: 8px; color: #EF4444; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s; }
  .btn-delete:hover { background: #FEF2F2; border-color: #FECACA; }
  [data-theme='dark'] .btn-delete:hover { background: #450a0a; }
  @media (max-width: 768px) {
    .service-root { padding: 16px; }
    .service-form-card { padding: 18px; }
    .form-grid { grid-template-columns: 1fr; }
    .checkbox-group-container { grid-template-columns: 1fr; }
    .form-actions { flex-direction: column; }
    .btn-primary, .btn-secondary { width: 100%; }
    .action-btns { flex-direction: column; gap: 4px; }
  }
`;

export default function Service() {
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({ role_name: '', email: '', password: '', allowed_features: [] });
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const availableFeatures = [
        { key: 'kasir', label: 'Mode Kasir' },
        { key: 'bills', label: 'Daftar Bill' },
        { key: 'tutup', label: 'Tutup Kasir' },
        { key: 'history_kasir', label: 'History Kasir' },
        { key: 'hpp', label: 'HPP Awal' },
        { key: 'admin', label: 'Data Produk' },
        { key: 'laporan', label: 'Laporan Penjualan' },
        { key: 'neraca', label: 'Neraca Laba Rugi' },
        { key: 'service', label: 'Manajemen Akses' }
    ];

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/service-accounts');
            setAccounts(res.data);
        } catch (e) { }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (key) => {
        const current = [...formData.allowed_features];
        if (current.includes(key)) {
            setFormData({ ...formData, allowed_features: current.filter(k => k !== key) });
        } else {
            setFormData({ ...formData, allowed_features: [...current, key] });
        }
    };

    const handleEditClick = (acc) => {
        setIsEdit(true);
        setCurrentId(acc.id);
        setFormData({
            role_name: acc.role_name,
            email: acc.email,
            password: '',
            allowed_features: JSON.parse(acc.allowed_features || '[]')
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEdit(false);
        setCurrentId(null);
        setFormData({ role_name: '', email: '', password: '', allowed_features: [] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.allowed_features.length === 0) {
            alert('Pilih minimal satu fitur yang diizinkan!');
            return;
        }

        const payload = {
            role_name: formData.role_name,
            email: formData.email,
            password: formData.password,
            allowed_features: JSON.stringify(formData.allowed_features)
        };

        try {
            if (isEdit) {
                await api.put(`/service-accounts/${currentId}`, payload);
            } else {
                await api.post('/service-accounts', payload);
            }
            cancelEdit();
            fetchAccounts();
        } catch (err) {
            alert('Gagal menyimpan kredensial akun layanan.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Hapus hak akses akun layanan ini secara permanen?')) {
            try {
                await api.delete(`/service-accounts/${id}`);
                fetchAccounts();
            } catch (err) { }
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="service-root">
                <div className="service-page-header">
                    <div className="service-page-icon"><Icon n="shield" size={24} /></div>
                    <div style={{ textAlign: 'left' }}>
                        <div className="service-page-title">Manajemen Akses & Layanan</div>
                        <div className="service-page-sub">ATUR KREDENSIAL ROLE</div>
                    </div>
                </div>

                <div className={`service-form-card ${isEdit ? 'edit-mode' : ''}`}>
                    <div className="form-card-header">
                        <div className="form-card-title">
                            <Icon n={isEdit ? "edit" : "plus"} /> {isEdit ? 'Edit Akses Role' : 'Buat Akses Role Baru'}
                        </div>
                        {isEdit && <span className="edit-badge">Edit Mode</span>}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Nama Posisi / Role</label>
                                <input className="form-input" name="role_name" placeholder="Misal: Kasir Utama, Dapur" value={formData.role_name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Alamat Email Akses</label>
                                <input className="form-input" type="email" name="email" placeholder="kasir@toko.com" value={formData.email} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Kata Sandi Akses {isEdit && <span style={{ color: '#6B7280', fontWeight: 600 }}>(kosongkan jika tidak diubah)</span>}</label>
                                <input className="form-input" type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} required={!isEdit} />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: '12px' }}>
                            <label className="form-label">Pilihan Akses Menu / Fitur</label>
                            <div className="checkbox-group-container">
                                {availableFeatures.map(f => (
                                    <label key={f.key} className="feature-checkbox">
                                        <input type="checkbox" checked={formData.allowed_features.includes(f.key)} onChange={() => handleCheckboxChange(f.key)} />
                                        <span>{f.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                <Icon n="save" /> {isEdit ? 'Simpan Perubahan Akses' : 'Buat Kredensial Baru'}
                            </button>
                            {isEdit && <button type="button" className="btn-secondary" onClick={cancelEdit}>Batal</button>}
                        </div>
                    </form>
                </div>

                <div className="table-card">
                    <div className="table-card-header">
                        <div className="table-card-title"><Icon n="check" /> Daftar Kredensial Aktif</div>
                        <div className="table-count">{accounts.length} akun terdaftar</div>
                    </div>
                    <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '35%' }}>Nama Role & Login</th>
                                <th style={{ width: '45%' }}>Hak Akses Fitur</th>
                                <th className="col-center" style={{ width: '20%' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="col-center" style={{ padding: '40px', color: '#9CA3AF', fontWeight: '700' }}>
                                        Belum ada akun akses yang dibuat.
                                    </td>
                                </tr>
                            ) : (
                                accounts.map(acc => {
                                    const feats = JSON.parse(acc.allowed_features || '[]');
                                    return (
                                        <tr key={acc.id}>
                                            <td>
                                                <div className="td-role-name">{acc.role_name}</div>
                                                <div className="td-email">{acc.email}</div>
                                            </td>
                                            <td>
                                                <div className="feature-tags-wrapper">
                                                    {feats.map(fKey => {
                                                        const found = availableFeatures.find(af => af.key === fKey);
                                                        return <span key={fKey} className="feat-tag">{found ? found.label : fKey}</span>;
                                                    })}
                                                </div>
                                            </td>
                                            <td className="col-center">
                                                <div className="action-btns">
                                                    <button className="btn-edit" onClick={() => handleEditClick(acc)}>
                                                        <Icon n="edit" size={14} /> Edit
                                                    </button>
                                                    <button className="btn-delete" onClick={() => handleDelete(acc.id)}>
                                                        <Icon n="trash" size={14} /> Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </>
    );
}