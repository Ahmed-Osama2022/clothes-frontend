import { defineStore } from 'pinia';
import * as authApi from '../api/auth';

// ======= AUTH STORE (Pinia + Sanctum) =======
// TOKEN STRATEGY — read this before wiring the backend:
//  * Default (Sanctum SPA): the auth token lives in Laravel's httpOnly
//    `laravel_session` cookie, set by the browser automatically because
//    axios runs with `withCredentials: true` (see src/api/client.js).
//    Nothing token-related is saved here — only the authenticated user object.
//  * Fallback (Sanctum API-token mode): if the backend returns a plain token
//    in the login/register payload, we store it in localStorage under
//    'auth_token' (used by the axios request interceptor) and keep the user
//    here in Pinia. localStorage is convenient but XSS-readable — prefer
//    switching the backend to cookie-based SPA auth when possible.
const persistUser = (user) => localStorage.setItem('auth_user', JSON.stringify(user));
const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem('auth_user') || 'null');
  } catch {
    return null;
  }
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readUser(),
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    userName: (state) => state.user?.name || state.user?.email || '',
  },
  actions: {
    // Primes the Sanctum CSRF cookie before any auth request.
    async csrf() {
      await authApi.getCsrfCookie();
    },
    async login(credentials) {
      const payload = await authApi.login(credentials);
      this.hydrate(payload);
      return this.user;
    },
    async register(payload) {
      await this.csrf();
      const data = await authApi.register(payload);
      this.hydrate(data);
      return this.user;
    },
    async fetchUser() {
      const user = await authApi.getCurrentUser();
      this.setUser(user);
      return user;
    },
    async logout() {
      try {
        await authApi.logout();
      } finally {
        this.clearSession();
      }
    },
    // Accepts `{ user, token }` or `{ token }` or just a user object.
    hydrate(payload) {
      if (payload?.token) {
        localStorage.setItem('auth_token', payload.token);
      }
      this.setUser(payload?.user || payload);
    },
    setUser(user) {
      this.user = user;
      if (user) persistUser(user);
    },
    clearSession() {
      this.user = null;
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    },
  },
});