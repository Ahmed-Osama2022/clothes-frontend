import api from './client';

// ======= CATALOG ENDPOINTS (Laravel API v1) =======
// The MVP API exposes categories + products only. Both return the `{ data }`
// envelope and already-localized text for the requested `lang`.
//   GET /categories?lang=ar
//   GET /products?lang=ar
//   GET /products/{slug}?lang=ar        (route binding is by SLUG, not id)
//
// Not provided by the API yet (the frontend keeps working around the gaps):
//   - no filters/sort/search on /products   -> shop filters client-side
//   - no pagination/meta                    -> client-side pagination
//   - no /home aggregate, /stock, /auth/*   -> see src/data/site.js + Report.md
const localeParams = (lang) => (lang ? { lang } : {});

export const getCategories = (lang) => api.get('/categories', { params: localeParams(lang) });

export const getProducts = (lang) => api.get('/products', { params: localeParams(lang) });

export const getProduct = (slug, lang) =>
  api.get(`/products/${encodeURIComponent(slug)}`, { params: localeParams(lang) });
