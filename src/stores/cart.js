import { defineStore } from 'pinia';

// ======= SHOPPING CART STORE =======
// Holds cart items in memory + mirrors them to localStorage ('cart_key')
// so the cart survives page reloads. A line is keyed by product.id + size
// (e.g. "3__M"), so the same product in two sizes stays two separate lines.
// Usage in any component:
//   const cart = useCartStore()
//   cart.add({ ...product, size: 'M' }, qty)   // merge qty if same product+size already in cart
//   cart.setQty(item, qty)                     // change quantity (0 removes)
//   cart.remove(item)                          // delete a line (pass the full item)

const STORAGE_KEY = 'cart_key';

const lineKey = (item) => `${item.id}__${item.size || ''}`;

const loadInitial = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadInitial(),
  }),
  getters: {
    count: (state) => state.items.reduce((sum, item) => sum + item.qty, 0),
    total: (state) => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
  },
  actions: {
    add(product, qty = 1) {
      const key = lineKey(product);
      const existing = this.items.find((item) => lineKey(item) === key);
      if (existing) {
        existing.qty += qty;
      } else {
        this.items.push({
          id: product.id,
          size: product.size || '',
          name: product.name,
          price: product.price,
          image: product.image,
          qty,
        });
      }
      this.persist();
    },
    setQty(item, qty) {
      const key = lineKey(item);
      const existing = this.items.find((i) => lineKey(i) === key);
      if (!existing) return;
      if (qty <= 0) {
        this.remove(item);
        return;
      }
      existing.qty = qty;
      this.persist();
    },
    remove(item) {
      const key = lineKey(item);
      this.items = this.items.filter((i) => lineKey(i) !== key);
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