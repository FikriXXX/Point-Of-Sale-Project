// RBAC middleware
// ownerOnly — hanya Supabase auth user (owner) yang boleh akses
// PERINGATAN: Pastikan fitur 'Public Signup' di Supabase dashboard dimatikan
// agar tidak ada orang asing yang bisa mendaftar dan mendapatkan akses owner.
const ownerOnly = (req, res, next) => {
    if (req.user.type === 'supabase') return next();
    return res.status(403).json({ error: 'Akses ditolak. Hanya owner yang dapat mengakses fitur ini.' });
};

// requireRole — cek role service account, owner (supabase) selalu pass
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (req.user.type === 'supabase') return next();
        const userRole = (req.user.role || '').toLowerCase();
        if (allowedRoles.map(r => r.toLowerCase()).includes(userRole)) return next();
        return res.status(403).json({ error: 'Akses ditolak. Role Anda tidak memiliki izin.' });
    };
};

module.exports = { ownerOnly, requireRole };
