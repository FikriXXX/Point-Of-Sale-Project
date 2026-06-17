const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // Coba verify sebagai custom JWT dulu (service account)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role, type: 'service' };
        return next();
    } catch (e) {
        // Bukan custom JWT, coba Supabase
    }

    // Verify sebagai Supabase JWT
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Unauthorized' });

    req.user = { id: user.id, email: user.email, type: 'supabase' };
    next();
};

module.exports = { verifyToken };
