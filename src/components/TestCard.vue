<script setup>
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';

// ======= TEST CARD DEMO PRODUCT =======
// Standalone demo item so /testcard can exercise the cart too.
const cart = useCartStore();
const toast = useToastStore();

const demoProduct = {
  id: 99,
  name: 'Classic White Tee',
  price: 24.99,
  image:
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
};

const addToCart = () => {
  cart.add(demoProduct);
  toast.success(`${demoProduct.name} added to cart`);
};
</script>

<template>
  <!-- ======= TEST PRODUCT CARD =======
       A demo product card to preview the shop theme (route: /testcard).
       Replace image, titles, price and swatch colors below as needed. -->
  <main class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-snow-100 p-8">
    <div class="space-y-8">
      <div class="mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-md" data-aos="fade-up">
        <div class="relative">
          <img
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=900"
            alt="Classic white tee"
            class="aspect-[4/3] w-full object-cover"
          />
          <span
            class="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white"
          >
            -20%
          </span>
        </div>

        <div class="p-6">
          <p class="text-sm font-semibold uppercase tracking-wide text-primary-500">New Arrivals</p>
          <h1 class="mt-2 text-xl font-bold text-ink-900">Classic White Tee</h1>
          <p class="mt-2 text-sm text-ink-500">
            A light black, a pretty purple, and a clean white.
          </p>

          <div class="mt-4 flex items-center justify-between">
            <p class="text-lg font-bold text-ink-900">
              $24.99 <span class="ml-2 text-sm font-medium text-ink-400 line-through">$31.25</span>
            </p>
            <div class="flex gap-2">
              <span class="h-5 w-5 rounded-full bg-white ring-1 ring-ink-200"></span>
              <span class="h-5 w-5 rounded-full bg-ink-900"></span>
              <span class="h-5 w-5 rounded-full bg-primary-500"></span>
            </div>
          </div>

          <button
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 font-semibold text-white transition hover:bg-primary-700"
            @click="addToCart"
          >
            <i class="pi pi-cart-plus" aria-hidden="true"></i>
            Add to Cart
          </button>
        </div>
      </div>

      <div
        class="mx-auto flex max-w-sm items-center justify-between rounded-lg bg-ink-900 px-6 py-4 text-snow-100"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <span class="text-sm">Free shipping on orders</span>
        <span class="text-primary-400">&#9733;</span>
      </div>
    </div>
  </main>
</template>