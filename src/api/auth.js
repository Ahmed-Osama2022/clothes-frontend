import api from './client';

// ======= AUTH ENDPOINTS (prepared for Laravel + Sanctum) =======
// TODO(api): the MVP API does not expose auth routes yet — only `/api/user`
// behind `auth:sanctum`. The paths below follow the backend API_DESIGN.md
// contract, so wiring them later needs no frontend change.
// Until then, Login/Register submit fails and the views show the translated
// `auth.notAvailable` message instead of a raw network error (features stay).
//
// Sanctum SPA cookie mode: enable VITE_API_CREDENTIALS=true, then prime the CSRF
// cookie with `getCsrfCookie()` before register/login. The cookie endpoint lives
// at the app root, not under /api/v1, so it uses the API origin.
const apiOrigin = (() => {
  try {
    return new URL(import.meta.env.VITE_API_URL || 'http://api.clothes.test/api/v1').origin;
  } catch {
    return 'http://api.clothes.test';
  }
})();

export const getCsrfCookie = () => api.get(`${apiOrigin}/sanctum/csrf-cookie`);
export const register = (payload) => api.post('/auth/register', payload);
export const login = (credentials) => api.post('/auth/login', credentials);
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');
