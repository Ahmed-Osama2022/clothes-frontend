import { createI18n } from 'vue-i18n';
import en from './locales/en.js';
import ar from './locales/ar.js';

// ======= I18N CORE =======
// Frontend tier: UI chrome strings (nav, buttons, labels, validation messages)
// live in this module via vue-i18n. DATA content (categories, products, promo,
// testimonials, hero slides) is locale-keyed in src/data/*.js and picked with
// `pickByLocale` — mirroring how the Laravel backend will serve translated rows
// keyed by a `locale` param (see apis.md).

export const SUPPORTED_LOCALES = ['en', 'ar'];
// Default locale comes from .env (VITE_DEFAULT_LOCALE). Used only when the user
// has no saved choice AND the browser language doesn't match a supported one.
export const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE || 'en';
export const LOCALE_STORAGE_KEY = 'app_locale';
export const RTL_LOCALES = ['ar'];

// Priority: 1) saved localStorage choice -> 2) browser language -> 3) .env default.
export const resolveInitialLocale = () => {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  } catch {
    // storage blocked (private mode etc.)
  }
  const browser = (navigator.language || '').toLowerCase();
  const match = SUPPORTED_LOCALES.find((l) => browser.startsWith(l.toLowerCase()));
  if (match) return match;
  return DEFAULT_LOCALE;
};

export const i18n = createI18n({
  // legacy: false -> composition API mode (useI18n() in <script setup>,
  // and $t is still injected into templates via app.use(i18n)).
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages: { en, ar },
});

// Applies a locale app-wide AND keeps <html lang>/dir in sync (RTL for Arabic).
// Returns the normalized locale actually applied.
export const applyLocale = (locale) => {
  const next = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  i18n.global.locale.value = next;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = next;
    document.documentElement.dir = RTL_LOCALES.includes(next) ? 'rtl' : 'ltr';
  }
  return next;
};

// ======= DATA-TIER PICKER =======
// Content objects in src/data/*.js are locale-keyed: { en: '...', ar: '...' }.
// Real backend rows will look the same. This resolves the current locale at
// call time. If the value isn't a locale-map (plain string/number), it returns
// it unchanged (only a passed locale map is localized -> fluent fallback).
export const pickByLocale = (value) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const l = i18n.global.locale.value;
    if (l in value) return value[l];
    if ('en' in value) return value.en;
  }
  return value;
};