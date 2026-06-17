import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import api from './services/api';
import POS from './pages/POS';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Reports from './pages/Reports';
import Neraca from './pages/Neraca';
import Bills from './pages/Bills';
import Hpp from './pages/Hpp';
import Service from './pages/Service';
import TutupKasir from './pages/TutupKasir';
import HistoryKasir from './pages/HistoryKasir';

const Icon = ({ n, size = 18, className = "", style = {} }) => {
  const paths = {
    monitor: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
    fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    bar: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
    trend: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    loader: <><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
    sun: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>,
    moon: <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{paths[n]}</svg>;
};

const styles = ` 
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

:root {
  --bg-app: #FAF9F6;
  --bg-card: #FFFFFF;
  --bg-field: #F9FAFB;
  --text-main: #111827;
  --text-sub: #6B7280;
  --border: #E5E7EB;
  --primary: #D97706;
  --primary-hover: #B45309;
  --primary-soft: rgba(217,119,6,0.12);
  --header-role-bg: #FEF3C7;
}

[data-theme='dark'] {
  --bg-app: #0F172A;
  --bg-card: #1E293B;
  --bg-field: #334155;
  --text-main: #F8FAFC;
  --text-sub: #94A3B8;
  --border: #334155;
  --primary: #F59E0B;
  --primary-hover: #D97706;
  --primary-soft: rgba(245,158,11,0.15);
  --header-role-bg: #451a03;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg-app); font-family: 'Plus Jakarta Sans', sans-serif; color: var(--text-main); overflow-x: hidden; transition: background 0.3s, color 0.3s; }

.login-root { display: flex; min-height: 100vh; min-height: 100dvh; background: var(--bg-app); align-items: center; justify-content: center; padding: 20px; }
.login-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
.login-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
.login-logo { width: 52px; height: 52px; background: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: 800; font-size: 20px; }
.login-title-box { display: flex; flex-direction: column; text-align: left; }
.login-title { font-size: 20px; font-weight: 800; color: var(--text-main); }
.login-subtitle { font-size: 13px; color: var(--text-sub); font-weight: 600; margin-top: 2px; }
.login-form { display: flex; flex-direction: column; gap: 20px; }
.login-field { display: flex; flex-direction: column; gap: 8px; text-align: left; }
.login-label { font-size: 13px; font-weight: 700; color: var(--text-main); }
.login-input { width: 100%; padding: 14px 16px; background: var(--bg-field); border: 2px solid var(--border); border-radius: 12px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; color: var(--text-main); outline: none; transition: all 0.2s; }
.login-input:focus { border-color: var(--primary); background: var(--bg-card); box-shadow: 0 0 0 4px var(--primary-soft); }
.login-input::placeholder { color: #9CA3AF; font-weight: 500; }
.login-btn { padding: 16px; background: var(--primary); border: none; border-radius: 12px; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 12px rgba(217,119,6,0.2); }
.login-btn:hover:not(:disabled) { background: var(--primary-hover); transform: translateY(-1px); }
.login-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

.app-root { display: flex; flex-direction: column; height: 100vh; height: 100dvh; background: var(--bg-app); overflow: hidden; }
.app-header { height: 56px; background: var(--bg-card); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; flex-shrink: 0; z-index: 100; transition: background 0.3s, border 0.3s; }
.app-header-left { display: flex; align-items: center; gap: 10px; }
.header-logo { width: 32px; height: 32px; background: var(--primary); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-weight: 800; font-size: 13px; }
.header-brand-title { font-size: 15px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
.header-role { background: var(--header-role-bg); color: var(--primary); padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 800; border: 1px solid var(--primary-soft); }
.header-right { display: flex; align-items: center; gap: 16px; }
.header-email { font-size: 12px; color: var(--text-sub); font-weight: 700; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.theme-toggle { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg-field); color: var(--text-main); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
.theme-toggle:hover { background: var(--border); }

.app-content { flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; background: var(--bg-app); min-height: 0; -webkit-overflow-scrolling: touch; transition: background 0.3s; }

.app-bottom-nav { height: 64px; background: var(--bg-card); border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 8px; gap: 2px; overflow-x: auto; flex-shrink: 0; z-index: 100; box-shadow: 0 -2px 10px rgba(0,0,0,0.03); transition: background 0.3s, border 0.3s; }
.app-bottom-nav::-webkit-scrollbar { height: 0; display: none; }

.nav-tab-btn { flex: 1; min-width: 56px; max-width: 80px; height: 52px; padding: 4px 2px; background: transparent; border: none; border-radius: 10px; color: var(--text-sub); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; transition: all 0.2s; flex-shrink: 0; }
.nav-tab-btn:hover { color: var(--primary); background: var(--primary-soft); }
.nav-tab-btn.active { background: var(--primary-soft); color: var(--primary); }
.nav-tab-label { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 9px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }

.nav-tab-logout { min-width: 56px; max-width: 72px; height: 52px; padding: 4px 2px; background: #FEF2F2; border: none; border-radius: 10px; color: #EF4444; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; transition: all 0.2s; flex-shrink: 0; }
.nav-tab-logout:hover { background: #EF4444; color: #FFFFFF; }
[data-theme='dark'] .nav-tab-logout { background: #450a0a; color: #f87171; }
[data-theme='dark'] .nav-tab-logout:hover { background: #f87171; color: #FFFFFF; }

@media (min-width: 768px) {
  .app-header { height: 60px; padding: 0 24px; }
  .header-logo { width: 36px; height: 36px; font-size: 15px; border-radius: 10px; }
  .header-brand-title { font-size: 16px; }
  .app-bottom-nav { height: 68px; padding: 0 12px; gap: 4px; }
  .nav-tab-btn { min-width: 72px; max-width: 100px; height: 56px; padding: 6px 8px; }
  .nav-tab-label { font-size: 10px; }
  .nav-tab-logout { min-width: 72px; max-width: 88px; height: 56px; }
}
@media (max-width: 480px) {
  .login-card { padding: 28px 20px; border-radius: 16px; }
  .header-email { display: none; }
  .header-brand-title { font-size: 14px; }
}
`;

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [allowedMenus, setAllowedMenus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchUserRole = async (userId, userEmail) => {
    try {
      const { data, error } = await supabase.from('profiles').select('role').eq('id', userId).limit(1).maybeSingle();
      if (error) throw error;
      let detectedRole = 'kasir';
      if (data && data.role) {
        detectedRole = data.role.toLowerCase();
      } else {
        if (userEmail === 'admin1@gmail.com') detectedRole = 'owner';
      }
      setRole(detectedRole);
      // Set default page based on role
      setActivePage(detectedRole === 'owner' ? 'dashboard' : 'kasir');
    } catch (error) {
      setRole('kasir');
      setActivePage('kasir');
    }
  };

  useEffect(() => {
    if (!supabase) return;

    const savedCustom = localStorage.getItem('custom_service_session');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        setSession(parsed);
        const userRole = parsed.role?.toLowerCase() || 'kasir';
        setRole(userRole);
        setAllowedMenus(parsed.allowed_features);
        if (parsed.allowed_features && parsed.allowed_features.length > 0) {
          setActivePage(parsed.allowed_features[0]);
        } else {
          setActivePage(userRole === 'owner' ? 'dashboard' : 'kasir');
        }
      } catch (e) {
        localStorage.removeItem('custom_service_session');
      }
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) fetchUserRole(session.user.id, session.user.email);
    }).catch(err => console.error("Session fetch error:", err));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      const checkCustom = localStorage.getItem('custom_service_session');
      if (checkCustom) return;

      setSession(currentSession);
      if (currentSession?.user?.id) {
        fetchUserRole(currentSession.user.id, currentSession.user.email);
      } else {
        setRole('');
        setAllowedMenus(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/login-service', { email, password });
      if (res.data) {
        const srvData = res.data;
        const feats = JSON.parse(srvData.allowed_features || '[]');
        const customObj = {
          custom: true,
          token: srvData.token,
          user: { id: srvData.id, email: srvData.email },
          role: srvData.role_name,
          allowed_features: feats
        };
        localStorage.setItem('custom_service_session', JSON.stringify(customObj));
        setSession(customObj);
        setRole(srvData.role_name.toLowerCase());
        setAllowedMenus(feats);
        if (feats.length > 0) {
          setActivePage(feats[0]);
        } else {
          setActivePage('kasir');
        }
        setLoading(false);
        return;
      }
    } catch (err) { }

    if (!supabase) {
        alert('Koneksi database belum dikonfigurasi.');
        setLoading(false);
        return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Kredensial login tidak valid atau tidak ditemukan.');
    setLoading(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('custom_service_session');
    setSession(null);
    setRole('');
    setAllowedMenus(null);
    if (supabase) await supabase.auth.signOut();
  };

  const allNavItems = [
    { key: 'dashboard', label: 'Home', icon: 'activity', roles: ['owner'] },
    { key: 'kasir', label: 'Kasir', icon: 'monitor', roles: ['kasir', 'owner'] },
    { key: 'bills', label: 'Tagihan', icon: 'file', roles: ['kasir', 'owner'] },
    { key: 'tutup', label: 'Tutup Shift', icon: 'check', roles: ['kasir', 'owner'] },
    { key: 'history_kasir', label: 'History Kasir', icon: 'fileText', roles: ['owner'] },
    { key: 'hpp', label: 'Resep HPP', icon: 'fileText', roles: ['kasir', 'owner'] },
    { key: 'admin', label: 'Produk', icon: 'settings', roles: ['kasir', 'owner'] },
    { key: 'laporan', label: 'Laporan', icon: 'bar', roles: ['owner'] },
    { key: 'neraca', label: 'Laba Rugi', icon: 'trend', roles: ['owner'] },
    { key: 'service', label: 'Akses', icon: 'shield', roles: ['owner'] },
  ];

  const navItems = allowedMenus
    ? allNavItems.filter(item => allowedMenus.includes(item.key))
    : allNavItems.filter(item => item.roles.includes(role));

  if (!session) {
    return (
      <>
        <style>{styles}</style>
        <div className="login-root">
          <div className="login-card">
            <div className="login-header">
              <div className="login-logo">PS</div>
              <div className="login-title-box">
                <div className="login-title">Putro Sales</div>
                <div className="login-subtitle">Point of Sale System</div>
              </div>
            </div>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="login-field">
                <label className="login-label">Alamat Email</label>
                <input className="login-input" type="email" placeholder="email@toko.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="login-field">
                <label className="login-label">Kata Sandi</label>
                <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? <><Icon n="loader" /> Memverifikasi...</> : <><Icon n="activity" /> Masuk ke Sistem</>}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  if (role === '' && !allowedMenus) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#FAF9F6', color: '#6B7280', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <style>{styles}</style>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTop: '4px solid #D97706', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <p style={{ fontWeight: '800' }}>Memverifikasi Akses...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-root">
        <header className="app-header">
          <div className="app-header-left">
            <div className="header-logo">PS</div>
            <div className="header-brand-title">
              Putro Sales
              {role && <span className="header-role">{role.toUpperCase()}</span>}
            </div>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleTheme} title={`Ganti ke tema ${theme === 'light' ? 'gelap' : 'terang'}`}>
              <Icon n={theme === 'light' ? 'moon' : 'sun'} size={18} />
            </button>
            <div className="header-email">{session.user?.email}</div>
          </div>
        </header>

        <main className="app-content">
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'kasir' && <POS />}
          {activePage === 'bills' && <Bills />}
          {activePage === 'tutup' && <TutupKasir />}
          {activePage === 'history_kasir' && <HistoryKasir />}
          {activePage === 'hpp' && <Hpp />}
          {activePage === 'admin' && <AdminDashboard />}
          {activePage === 'laporan' && <Reports />}
          {activePage === 'neraca' && <Neraca />}
          {activePage === 'service' && <Service />}
        </main>

        <nav className="app-bottom-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-tab-btn ${activePage === item.key ? 'active' : ''}`}
              onClick={() => setActivePage(item.key)}
              title={item.label}
            >
              <Icon n={item.icon} size={20} />
              <span className="nav-tab-label">{item.label}</span>
            </button>
          ))}
          <button className="nav-tab-logout" onClick={handleLogout} title="Keluar">
            <Icon n="logout" size={20} />
            <span className="nav-tab-label">Keluar</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default App;