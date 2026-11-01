import { defineStore } from 'pinia';

// ======= SHOPPING CART STORE =======
// Holds cart items in memory + mirrors them to localStorage ('cart_key').
// A line is keyed by the API **variant id** (size + color combination), so the
// same product in two sizes/colors stays two separate lines.
//
// Line snapshot (what the UI renders, exactly like a DB row):
//   { variantId, productId, slug, name, price, image, size, color, colorHex, sku, qty, maxQty }
//
// Usage:
//   cart.add(product, variant, qty)   // merge qty when the variant is already in
//   cart.setQty(line, qty)            // 0 removes; clamped to `maxQty` (stock)
//   cart.remove(line)
const STORAGE_KEY = 'cart_key';

// Lines from the pre-API cart had no `variantId`; they cannot be mapped to a
// real variant, so they are dropped on load instead of breaking checkout.
const isValidLine = (item) => item && item.variantId && Number.isFinite(Number(item.qty));

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isValidLine) : [];
  } catch {
    return [];
  }
};

const lineKey = (line) => String(line.variantId ?? `${line.productId}__${line.size}__${line.color}`);

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadInitial(),
  }),
  getters: {
    count: (state) => state.items.reduce((sum, item) => sum + item.qty, 0),
    total: (state) => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
    isEmpty: (state) => state.items.length === 0,
  },
  actions: {
    add(product, variant, qty = 1) {
      if (!variant?.id) return;
      const maxQty = Number(variant.quantity ?? 0);
      const key = String(variant.id);
      const existing = this.items.find((item) => lineKey(item) === key);

      if (existing) {
        existing.qty = Math.min(existing.qty + qty, Math.max(existing.maxQty ?? maxQty, 1));
      } else {
        this.items.push({
          variantId: variant.id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(variant.price ?? product.price),
          image: product.image,
          size: variant.size,
          color: variant.color,
          colorHex: variant.colorHex,
          sku: variant.sku,
          qty: Math.min(qty, Math.max(maxQty, 1)),
          maxQty,
        });
      }
      this.persist();
    },
    setQty(line, qty) {
      const key = lineKey(line);
      const existing = this.items.find((item) => lineKey(item) === key);
      if (!existing) return;
      if (qty <= 0) {
        this.remove(line);
        return;
      }
      existing.qty = Math.min(qty, Math.max(existing.maxQty ?? qty, 1));
      this.persist();
    },
    remove(line) {
      const key = lineKey(line);
      this.items = this.items.filter((item) => lineKey(item) !== key);
      this.persist();
    },
    clear() {
      this.items = [];
      this.persist();
    },
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
    },
  },
});
