import axios from 'axios';
import { i18n } from '../i18n';

// ======= API CLIENT (Laravel API v1) =======
// Base URL comes from VITE_API_URL (see .env) and defaults to the local Laravel
// app. The trailing slash is stripped so every endpoint path can start with '/'.
//   GET {baseURL}/products?lang=ar   ->  { "data": [ ... ] }
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://api.clothes.test/api/v1';
const baseURL = rawBaseUrl.replace(/\/+$/, '');

// ======= CREDENTIALS / SANCTUM =======
// The MVP API answers with `Access-Control-Allow-Origin: *`, which the browser
// rejects for credentialed requests. So cookies are disabled by default and the
// public catalog works out of the box. When the backend enables Sanctum SPA
// (stateful) auth and returns a concrete origin, set VITE_API_CREDENTIALS=true.
const withCredentials = import.meta.env.VITE_API_CREDENTIALS === 'true';
const t = (key) => i18n.global.t(key);

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    // Ask Laravel for JSON errors instead of HTML/redirects.
    Accept: 'application/json',
  },
  withCredentials,
});

// ======= REQUEST INTERCEPTOR =======
// 1. Sanctum SPA mode: forward the XSRF-TOKEN cookie as X-XSRF-TOKEN (axios only
//    does this same-origin, so we inject it manually).
// 2. Bearer fallback: if a token was stored by the auth store, attach it.
api.interceptors.request.use((config) => {
  if (withCredentials) {
    const xsrfCookie = document.cookie.split('; ').find((row) => row.startsWith('XSRF-TOKEN='));
    if (xsrfCookie) {
      try {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfCookie.split('=').slice(1).join('='));
      } catch {
        // ignore malformed cookie
      }
    }
  }

  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ======= RESPONSE INTERCEPTOR =======
// Unwraps the HTTP response (callers get the JSON body `{ data: ... }`), turns
// every failure into a translated `Error` carrying `code` + `status` + `errors`,
// and handles Sanctum statuses: 401 = session expired, 419 = CSRF mismatch.
//
// `code` lets views choose the right state instead of showing a 404 for an outage:
//   OFFLINE    -> no response (network down / DNS / timeout)
//   NOT_FOUND  -> 404 (unknown route, product or category)
//   VALIDATION -> 422 (field errors in `.errors`)
//   SERVER     -> 5xx (backend is up but broken)
//   HTTP       -> anything else (401/403/419/...)
const classify = (status, hasResponse) => {
  if (!hasResponse) return 'OFFLINE';
  if (status === 404) return 'NOT_FOUND';
  if (status === 422) return 'VALIDATION';
  if (status >= 500) return 'SERVER';
  return 'HTTP';
};

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const body = error.response?.data;
    const code = classify(status, Boolean(error.response));
    const isAuthPage =
      typeof window !== 'undefined' &&
      ['/login', '/register'].some((path) => window.location.pathname.startsWith(path));

    if (status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Dynamic import avoids a static router <-> api cycle (client -> router ->
      // views -> stores -> api -> client). The router is always ready by the
      // time a 401 can happen.
      if (!isAuthPage && typeof window !== 'undefined') {
        import('../router')
          .then(({ default: router }) => router.push({ name: 'login' }))
          .catch(() => {
            window.location.assign('/login');
          });
      }
    }

    // 419 only makes sense with cookie auth; retrying without the flag would loop.
    // The Sanctum cookie endpoint lives at the app root, not under /api/v1.
    if (status === 419 && withCredentials && !error.config?._csrfRetried) {
      error.config._csrfRetried = true;
      let csrfUrl = '/sanctum/csrf-cookie';
      try {
        csrfUrl = `${new URL(baseURL).origin}/sanctum/csrf-cookie`;
      } catch {
        // keep the relative fallback
      }
      return api.get(csrfUrl).then(() => api.request(error.config));
    }

    let message;
    if (code === 'OFFLINE') {
      message = error.code === 'ECONNABORTED' ? t('errors.timeout') : t('errors.network');
    } else if (code === 'SERVER') {
      message = t('errors.server');
    } else {
      message = body?.message || t('errors.generic');
    }

    const normalized = new Error(message);
    normalized.code = code;
    normalized.status = status;
    normalized.errors = body?.errors; // 422 field validation messages
    return Promise.reject(normalized);
  },
);

export default api;
