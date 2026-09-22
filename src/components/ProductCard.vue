<script setup>
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';

// ======= REUSABLE PRODUCT CARD =======
// Used by: Home (Best Sellers), Shop, Category, Product related grid.
// Props:
//   product: { id, name, price, image } from src/data/catalog.js (later /api)
//   badge:   optional small label shown top-left (e.g. 'Best Seller')
// Behaviour: whole card opens /product/:id; the overlay button adds to cart
// (cart store + success toast) and stops propagation so it never navigates.
const props = defineProps({
  product: { type: Object, required: true },
  badge: { type: String, default: '' },
});

const router = useRouter();
const cart = useCartStore();
const toast = useToastStore();

const addToCart = () => {
  cart.add(props.product);
  toast.success(`${props.product.name} added to cart`);
};

const openProduct = () => router.push({ name: 'product', params: { id: props.product.id } });
</script>

<template>
  <article
    role="link"
    tabindex="0"
    class="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
    @click="openProduct"
    @keydown.enter="openProduct"
  >
    <div class="relative overflow-hidden">
      <img
        :src="product.image"
        :alt="product.name"
        loading="lazy"
        class="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span
        v-if="badge"
        class="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white"
      >
        {{ badge }}
      </span>
      <button
        type="button"
        aria-label="Add to cart"
        class="absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 translate-y-12 rounded-lg bg-ink-900/90 py-2.5 text-sm font-semibold text-white opacity-0 transition-all duration-200 hover:bg-primary-600 group-hover:translate-y-0 group-hover:opacity-100 active:scale-90"
        @click.stop="addToCart"
      >
        <i class="pi pi-cart-plus" aria-hidden="true"></i>
        Add to Cart
      </button>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-ink-900">{{ product.name }}</h3>
      <p class="mt-1 text-sm font-bold text-primary-600">${{ product.price.toFixed(2) }}</p>
    </div>
  </article>
</template>