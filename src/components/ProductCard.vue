<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import { pickByLocale } from '../i18n';

// ======= REUSABLE PRODUCT CARD =======
// Used by: Home (Best Sellers), Shop, Category, Product related grid.
// Props:
//   product: { id, name, price, image } from src/data/catalog.js (later /api).
//            `name` is locale-keyed ({ en, ar }) -> resolved per active locale.
//   badge:   optional small label shown top-left (e.g. 'Best Seller').
// Behaviour: whole card opens /product/:id; the overlay button adds to cart
// (cart store + success toast) and stops propagation so it never navigates.
const { t } = useI18n();
const props = defineProps({
  product: { type: Object, required: true },
  badge: { type: String, default: '' },
});

const router = useRouter();
const cart = useCartStore();
const toast = useToastStore();

const addToCart = () => {
  // Store the locally-resolved name snapshot in the cart (like a DB row).
  cart.add({ ...props.product, name: pickByLocale(props.product.name) });
  toast.success(t('product.addedToCart', { name: pickByLocale(props.product.name) }));
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
        :alt="pickByLocale(product.name)"
        loading="lazy"
        class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:aspect-[4/5]"
      />
      <span
        v-if="badge"
        class="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white"
      >
        {{ badge }}
      </span>
      <button
        type="button"
        :aria-label="t('product.addToCart')"
        class="absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 translate-y-12 rounded-lg bg-ink-900/90 py-2.5 text-sm font-semibold text-white opacity-0 transition-all duration-200 hover:bg-primary-600 group-hover:translate-y-0 group-hover:opacity-100 active:scale-90"
        @click.stop="addToCart"
      >
        <i class="pi pi-cart-plus" aria-hidden="true"></i>
        {{ t('product.addToCart') }}
      </button>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-ink-900">{{ pickByLocale(product.name) }}</h3>
      <p class="mt-1 text-sm font-bold text-primary-600">${{ product.price.toFixed(2) }}</p>
    </div>
  </article>
</template>