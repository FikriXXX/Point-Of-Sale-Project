import axios from 'axios';
import { supabase } from './supabase';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use(async (config) => {
    // Cek custom service session dulu (punya JWT sendiri)
    const customSession = localStorage.getItem('custom_service_session');
    if (customSession) {
        try {
            const parsed = JSON.parse(customSession);
            if (parsed.token) {
                config.headers.Authorization = `Bearer ${parsed.token}`;
                return config;
            }
        } catch (e) {}
    }

    // Fallback ke Supabase token
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

export default api;
