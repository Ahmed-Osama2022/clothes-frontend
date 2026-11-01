import { defineStore } from 'pinia';
import { getAboutPage } from '../api/about';
import { i18n } from '../i18n';
import { useLocaleStore } from './locale';

// ======= ABOUT STORE (GET /about) =======
// One published page made of typed blocks. The API returns them already
// translated and grouped, so the store only normalizes to primitives:
//
//   { slug, title, intro,
//     sections: [{ heading, body }],
//     stats:    [{ label, value }],
//     contact:  [{ label, value, href }],
//     social:   [{ platform, url }],
//     images:   [url], updatedAt }
//
// `href` is derived from the raw contact value (mailto:/tel:) so the view can
// link emails and phone numbers without guessing from the localized label.
//
// Degraded mode (same rule as the catalog): the last good payload is mirrored
// to sessionStorage per locale, so an outage keeps showing the REAL saved page
// with a "saved content" note instead of a blank screen or invented copy.
const CACHE_KEY = 'about_cache_v1';

const text = (value) => (typeof value === 'string' ? value.trim() : '');

// Email -> mailto:, phone -> tel:, anything else (an address) -> no link.
const contactHref = (value) => {
  if (!value) return null;
  if (value.includes('@') && !/\s/.test(value)) return `mailto:${value}`;
  if (!/^\+?[\d\s().-]+$/.test(value)) return null;
  const digits = value.replace(/[^\d+]/g, '');
  return digits.length >= 7 ? `tel:${digits}` : null;
};

const mapPage = (page) => ({
  slug: page.slug || 'about',
  title: text(page.title),
  intro: text(page.intro),
  sections: (page.sections ?? [])
    .map((section) => ({ heading: text(section.heading), body: text(section.body) }))
    .filter((section) => section.heading || section.body),
  stats: (page.stats ?? [])
    .map((stat) => ({ label: text(stat.label), value: text(stat.value) }))
    .filter((stat) => stat.label || stat.value),
  contact: (page.contact ?? [])
    .map((item) => {
      const value = text(item.value);
      return { label: text(item.label), value, href: contactHref(value) };
    })
    .filter((item) => item.value),
  social: (page.social ?? [])
    .map((item) => ({ platform: text(item.platform), url: text(item.url) }))
    .filter((item) => item.url),
  // Images are only ever rendered, so keep the URLs (array order = API order).
  images: (page.images ?? []).map((image) => image.url).filter(Boolean),
  updatedAt: page.updatedAt || null,
});

const readCache = () => {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const parsed = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    return parsed && parsed.page ? parsed : null;
  } catch {
    return null;
  }
};

const writeCache = (locale, page) => {
  try {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ locale, page, savedAt: Date.now() }));
  } catch {
    // storage full/blocked — caching is best-effort only
  }
};

export const useAboutStore = defineStore('about', {
  state: () => ({
    page: null,
    locale: null,
    loading: false,
    error: null,
    // True when the visible page comes from the saved snapshot (outage).
    isStale: false,
    cachedAt: null,
  }),
  getters: {
    hasData: (state) => Boolean(state.page),
    // Error taxonomy from src/api/client.js: 404 = the page really is missing,
    // OFFLINE/SERVER = the shop can't be reached right now.
    isOffline: (state) => state.error?.code === 'OFFLINE',
    isUnavailable: (state) => ['OFFLINE', 'SERVER'].includes(state.error?.code),
    isMissing: (state) => state.error?.code === 'NOT_FOUND',
  },
  actions: {
    // Restores the saved page for `locale`. Returns true when it had one.
    applyCache(locale) {
      const cache = readCache();
      if (!cache || cache.locale !== locale) return false;

      this.page = cache.page;
      this.locale = locale;
      this.cachedAt = cache.savedAt ?? null;
      return this.hasData;
    },

    async load({ force = false } = {}) {
      const { locale } = useLocaleStore();

      if (!force && this.locale === locale && this.hasData && !this.error) return;

      // Locale changed: show that locale's snapshot (or nothing) while loading.
      if (this.locale !== locale) {
        if (!this.applyCache(locale)) {
          this.page = null;
          this.locale = null;
          this.cachedAt = null;
        }
        this.isStale = false;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await getAboutPage(locale);
        if (!response?.data) {
          const missing = new Error(i18n.global.t('errors.notFound'));
          missing.code = 'NOT_FOUND';
          throw missing;
        }

        this.page = mapPage(response.data);
        this.locale = locale;
        this.isStale = false;
        this.cachedAt = Date.now();
        writeCache(locale, this.page);
      } catch (error) {
        // A 404 means the page is no longer published — never show a stale copy
        // behind the user's back. An outage keeps the saved page, labelled.
        if (error?.code === 'NOT_FOUND') {
          this.page = null;
          this.isStale = false;
        } else {
          this.isStale = this.hasData;
        }
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    retry() {
      return this.load({ force: true });
    },
  },
});
