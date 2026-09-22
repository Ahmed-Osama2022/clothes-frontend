import { defineStore } from 'pinia';

// ======= SHOPPING CART STORE =======
// Holds cart items in memory + mirrors them to localStorage ('cart_key')
// so the cart survives page reloads. Items are keyed by product.id.
// Usage in any component:
//   const cart = useCartStore()
//   cart.add(product)        // merge quantity if already in cart
//   cart.setQty(id, qty)     // change quantity (0 removes)
//   cart.remove(id)          // delete a line
const STORAGE_KEY = 'cart_key';

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
      const existing = this.items.find((item) => item.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        this.items.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty });
      }
      this.persist();
    },
    setQty(id, qty) {
      const item = this.items.find((i) => i.id === id);
      if (!item) return;
      if (qty <= 0) {
        this.remove(id);
        return;
      }
      item.qty = qty;
      this.persist();
    },
    remove(id) {
      this.items = this.items.filter((i) => i.id !== id);
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