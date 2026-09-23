import { defineStore } from 'pinia';
import { applyLocale, DEFAULT_LOCALE, i18n, LOCALE_STORAGE_KEY, RTL_LOCALES, SUPPORTED_LOCALES } from '../i18n';

// ======= LOCALE STORE =======
// Holds the active locale, persists the user's choice to localStorage, and
// applies it app-wide (vue-i18n composer + <html lang>/dir = RTL for Arabic).
// UI chrome re-renders via vue-i18n reactivity; DATA content (categories,
// products, promo, testimonials) re-renders via pickByLocale() which reads the
// same active locale — changing locale here updates the whole app, shops and
// all. The store is the single source of truth after app boot.
export const useLocaleStore = defineStore('locale', {
  state: () => ({
    // Initialized by src/i18n/index.js (localStorage -> browser -> .env default)
    locale: i18n.global.locale.value || DEFAULT_LOCALE,
  }),
  getters: {
    // Current RTL state (used to flip icons / layout where needed).
    isRTL: (state) => RTL_LOCALES.includes(state.locale),
  },
  actions: {
    // Called by LocaleSwitcher (and anywhere else). Persists + applies.
    setLocale(locale) {
      if (!SUPPORTED_LOCALES.includes(locale)) locale = DEFAULT_LOCALE;
      this.locale = applyLocale(locale);
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, this.locale);
      } catch {
        // storage blocked — in-memory only
      }
    },
    resetLocale() {
      this.setLocale(DEFAULT_LOCALE);
    },
  },
});