import { defineStore } from 'pinia';

// ======= TOAST / NOTIFICATION STORE =======
// Lightweight success/error/info notifications rendered by ToastContainer.vue.
// Auto-dismiss after `timeout` ms. Usage:
//   const toast = useToastStore()
//   toast.success('Added to cart!')
//   toast.error('Fix the highlighted fields')
let nextId = 1;

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [],
  }),
  actions: {
    show(message, type = 'info', timeout = 4000) {
      const id = nextId++;
      this.toasts.push({ id, type, message });
      setTimeout(() => this.dismiss(id), timeout);
    },
    success(message) {
      this.show(message, 'success');
    },
    error(message) {
      this.show(message, 'error');
    },
    info(message) {
      this.show(message, 'info');
    },
    dismiss(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },
  },
});