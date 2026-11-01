import { defineStore } from 'pinia';
import { getCategories, getProduct, getProducts } from '../api/catalog';
import { i18n } from '../i18n';
import { useLocaleStore } from './locale';

// ======= CATALOG STORE (single source of truth for shop data) =======
// Fetches GET /categories + GET /products once per locale and normalizes the API
// shapes into what the UI needs. Everything the components render (home, shop,
// category, product, cart, related) comes from here — no mock files.
//
// Normalized product:
//   { id, slug, name (localized), baseName (EN), description, price,
//     isFeatured, category (slug), categoryName (EN), images[], image,
//     variants: [{ id, size, color, colorHex, sku, price, quantity, available }] }
//
// API gaps handled client-side (documented, not removed):
//   - shop filters / sort / search / pagination (no query support server-side)
//   - product -> category mapping via `categoryName` (both sides are English)
const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">' +
      '<rect width="800" height="1000" fill="#f3e8ff"/>' +
      '<circle cx="400" cy="500" r="90" fill="#e9d5ff"/>' +
      '</svg>',
  );

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapVariant = (variant, productPrice) => ({
  id: variant.id,
  size: variant.size,
  color: variant.color,
  colorHex: variant.colorHex,
  sku: variant.sku,
  // Variant price is an override; null means "use the product price".
  price: variant.price == null ? productPrice : toNumber(variant.price, productPrice),
  quantity: toNumber(variant.quantity),
  available: variant.isActive !== false && toNumber(variant.quantity) > 0,
});

const mapProduct = (product, categorySlugByName) => {
  const price = toNumber(product.price);
  const images = (product.images ?? []).map((image) => image.url).filter(Boolean);

  return {
    id: product.id,
    slug: product.slug,
    // `title` is the localized display name; `name` is always English.
    name: product.title || product.name,
    baseName: product.name,
    description: product.description || '',
    price,
    isFeatured: Boolean(product.isFeatured),
    categoryName: product.categoryName || '',
    category: categorySlugByName[product.categoryName] || '',
    images,
    image: images[0] || FALLBACK_IMAGE,
    // Keep the API order (XS, S, M, L, XL per color) for the size selector.
    variants: (product.variants ?? [])
      .filter((variant) => variant.isActive !== false)
      .map((variant) => mapVariant(variant, price)),
  };
};

const mapCategory = (category) => {
  const images = (category.images ?? []).map((image) => image.url).filter(Boolean);

  return {
    id: category.id,
    slug: category.slug,
    name: category.name, // English base name (matching key)
    title: category.title || category.name, // localized
    description: category.description || '',
    count: toNumber(category.productsCount),
    sortOrder: toNumber(category.sortOrder),
    images,
    image: images[0] || FALLBACK_IMAGE,
  };
};

// Shared in-flight request so Navbar + Home + Shop asking at the same time
// produce ONE network round-trip instead of three.
let inflight = null;
let inflightLocale = null;

// ======= LAST-GOOD SNAPSHOT (degraded mode) =======
// The normalized catalog is mirrored to sessionStorage after every successful
// load. When the backend is unreachable we keep showing it with a "saved data"
// notice (ConnectivityBanner) instead of a blank page or fake products.
// sessionStorage (not localStorage) keeps it per-tab and clears on tab close.
const CACHE_KEY = 'catalog_cache_v1';

const readCache = () => {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const parsed = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (!parsed || !Array.isArray(parsed.categories) || !Array.isArray(parsed.products)) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (locale, categories, products) => {
  try {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ locale, categories, products, savedAt: Date.now() }),
    );
  } catch {
    // storage full/blocked — caching is best-effort only
  }
};

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    categories: [],
    products: [],
    locale: null,
    loading: false,
    error: null,
    // True when the visible catalog comes from the last-good snapshot because
    // a refresh failed. Views/banner can label it as possibly out of date.
    isStale: false,
    cachedAt: null,
  }),
  getters: {
    hasData: (state) => state.categories.length > 0 || state.products.length > 0,
    isLoaded: (state) => state.locale !== null && !state.error,
    // Error taxonomy from src/api/client.js. `isUnavailable` = the shop can't be
    // reached right now (offline or 5xx) -> show "temporarily unavailable",
    // never the 404 page.
    isOffline: (state) => state.error?.code === 'OFFLINE',
    isUnavailable: (state) => ['OFFLINE', 'SERVER'].includes(state.error?.code),
    categoryBySlug: (state) => (slug) => state.categories.find((category) => category.slug === slug) ?? null,
    productBySlug: (state) => (slug) => state.products.find((product) => product.slug === slug) ?? null,
    productsByCategory: (state) => (slug) => state.products.filter((product) => product.category === slug),
    featuredProducts: (state) => state.products.filter((product) => product.isFeatured),
    relatedTo: (state) => (product, limit = 4) =>
      product && product.category
        ? state.products
            .filter((item) => item.category === product.category && item.id !== product.id)
            .slice(0, limit)
        : [],
    categorySlugByName: (state) =>
      Object.fromEntries(state.categories.map((category) => [category.name, category.slug])),
  },
  actions: {
    // Hydrates the visible catalog from the last-good snapshot for `locale`.
    // Returns true when something could be restored.
    applyCache(locale) {
      const cache = readCache();
      if (!cache || cache.locale !== locale) return false;

      this.categories = cache.categories;
      this.products = cache.products;
      this.locale = locale;
      this.cachedAt = cache.savedAt ?? null;
      return this.hasData;
    },

    // Loads categories + products for the active locale. Cached per locale;
    // pass { force: true } to refetch (retry button / locale switch).
    async load({ force = false } = {}) {
      const { locale } = useLocaleStore();

      if (!force && this.locale === locale && this.hasData && !this.error) return;
      if (!force && inflight && inflightLocale === locale) return inflight;

      // Locale changed: show that locale's snapshot if we have one, otherwise
      // clear so the skeletons show instead of the previous language.
      if (this.locale !== locale) {
        if (!this.applyCache(locale)) {
          this.categories = [];
          this.products = [];
          this.locale = null;
          this.cachedAt = null;
        }
        this.isStale = false;
      }

      inflightLocale = locale;
      this.loading = true;
      this.error = null;

      inflight = (async () => {
        try {
          const [categoriesResponse, productsResponse] = await Promise.all([
            getCategories(locale),
            getProducts(locale),
          ]);

          const categories = categoriesResponse?.data ?? [];
          const products = productsResponse?.data ?? [];
          const categorySlugByName = Object.fromEntries(
            categories.map((category) => [category.name, category.slug]),
          );

          this.categories = categories.map(mapCategory);
          this.products = products.map((product) => mapProduct(product, categorySlugByName));
          this.locale = locale;
          this.isStale = false;
          this.cachedAt = Date.now();
          writeCache(locale, this.categories, this.products);
        } catch (error) {
          // Keep the last-good catalog visible and flag it as saved data.
          // Views show the full error block only when there is nothing to show.
          this.error = error;
          this.isStale = this.hasData;
        } finally {
          this.loading = false;
          inflight = null;
          inflightLocale = null;
        }
      })();

      return inflight;
    },

    retry() {
      return this.load({ force: true });
    },

    // Product detail always comes from GET /products/{slug} so variants/stock
    // and images are fresh. The list is loaded first for category + related.
    async fetchProduct(slug) {
      const { locale } = useLocaleStore();
      await this.load();

      try {
        const response = await getProduct(slug, locale);
        if (!response?.data) {
          const missing = new Error(i18n.global.t('errors.notFound'));
          missing.code = 'NOT_FOUND';
          throw missing;
        }

        return mapProduct(response.data, this.categorySlugByName);
      } catch (error) {
        // Degraded mode: an outage must not hide a product we already have in
        // the last-good catalog — show it and let ConnectivityBanner explain.
        // A real 404 always wins (the product is gone).
        if (error?.code !== 'NOT_FOUND') {
          const cached = this.productBySlug(slug);
          if (cached) return cached;
        }
        throw error;
      }
    },
  },
});
