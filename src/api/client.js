import axios from 'axios';
import router from '../router';

// ======= AXIOS HTTP CLIENT (prepared for Laravel + Sanctum) =======
// Base URL comes from VITE_API_URL in the root .env file. Until it is set we
// fall back to the backend link stored as BASE_URL in .env (http://localhost:3200).
const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.BASE_URL === '/' ? 'http://localhost:3200' : import.meta.env.BASE_URL);

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    // Tell Laravel to answer with JSON errors, not redirects.
    Accept: 'application/json',
  },
  // ======= SANCTUM SPA AUTH =======
  // Sends cookies (laravel_session + XSRF-TOKEN) on every request so the
  // httpOnly token cookie is managed by the browser — nothing sensitive is
  // stored in JS/localStorage. Keep true for Sanctum.
  withCredentials: true,
});

// ======= REQUEST INTERCEPTOR =======
// Two token paths, both handled here:
//  1. Sanctum SPA mode (default): forward the XSRF-TOKEN cookie as the
//     X-XSRF-TOKEN header on cross-origin calls (axios only auto-does this
//     same-origin, so we inject it manually). The real auth token lives in
//     the httpOnly laravel_session cookie Laravel sets, never in JS.
//  2. Bearer fallback (optional API-token mode): if a token was stored in
//     localStorage (auth_token) attach it as Authorization: Bearer.
api.interceptors.request.use((config) => {
  const xrsfCookie = document.cookie.split('; ').find((row) => row.startsWith('XSRF-TOKEN='));
  if (xrsfCookie) {
    try {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xrsfCookie.split('=').slice(1).join('='));
    } catch {
      // ignore malformed cookie
    }
  }

  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======= RESPONSE INTERCEPTOR =======
// Unwraps payloads (response.data), normalizes errors to strings, and handles
// Sanctum's statuses: 401 = session expired, 419 = CSRF token mismatch.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Send the user back to Login if they are not already on an auth page.
      const name = router.currentRoute.value.name;
      if (name !== 'login' && name !== 'register') {
        router.push({ name: 'login' });
      }
    }

    // 419 CSRF token mismatch (Sanctum SPA): the XSRF cookie expired, so refresh
    // the CSRF cookie and retry the failed request once.
    if (status === 419 && !error.config?._csrRetried) {
      error.config._csrRetried = true;
      return api.get('/sanctum/csrf-cookie').then(() => api.request(error.config));
    }

    const message = error.response?.data?.message || error.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default api;