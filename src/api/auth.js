import api from './client';

// ======= AUTH ENDPOINTS (prepared for Laravel + Sanctum) =======
// These hit the API configured in .env (see client.js). Sanctum SPA auth keeps
// the token in an httpOnly cookie (withCredentials is on), so no token handling
// is needed here — just call and get back the user.
// POST /sanctum/csrf-cookie     -> primes the CSRF cookie before login/register
export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');
export const register = (payload) => api.post('/auth/register', payload);
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');