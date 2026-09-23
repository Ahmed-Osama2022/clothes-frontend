// ======= FAKE HOME ENDPOINT (GET /api/home) =======
// Temporary stand-in for the Laravel backend until it is live. It returns the
// EXACT payload shape the real endpoint will send (see apis.md, section 1), so
// swapping this file for `import api from './client'` later requires ZERO changes
// in the components that consume it.
//   Real swap (once backend is up and VITE_API_URL/BASE_URL point at it):
//     export const getHomeData = (locale) => api.get('/home', { params: { locale } });
// Everything else keeps working unchanged.
//
// The payload is derived from src/data/catalog.js (slash-independent ids, names
// resolverd per `locale` with en as fallback) so Navbar / FeaturedCategories
// receive translated rows, exactly like the backend would.
import { categories } from '../data/catalog';
import { pickByLocale } from '../i18n';

const buildCategories = (locale) => {
  const counts = { 'signature-collection': 6, 'mid-season-sale': 6, 'best-sellers': 6 };
  return Object.entries(categories).map(([slug, cat]) => {
    const localized = pickByLocale(cat);
    return {
      slug,
      title: localized.title,
      eyebrow: localized.eyebrow,
      count: counts[slug] ?? 6,
      url: `/category/${slug}`,
      image: cat.image,
    };
  });
};

// Simulated backend latency so the loading state is visible (remove with the
// real client — it will be a true network call).
// Accepts the active locale ('en' | 'ar'); locale content falls back to `en`.
export const getHomeData = (locale = 'en') =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data: { categories: buildCategories(locale) } }), 400);
  });