<script setup>
import { useI18n } from 'vue-i18n';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import { pickByLocale } from '../i18n';

// ======= TEST CARD DEMO PRODUCT =======
// Standalone demo item so /testcard can exercise the cart too.
// The name is locale-keyed ({ en, ar }) -> pickByLocale; the cart stores a
// resolved name snapshot.
const { t } = useI18n();
const cart = useCartStore();
const toast = useToastStore();

const demoProduct = {
  id: 99,
  name: { en: 'Classic White Tee', ar: 'قميص أبيض كلاسيكي' },
  price: 24.99,
  oldPrice: 31.25,
  image:
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=900',
  categoryEyebrow: { en: 'New Arrivals', ar: 'وصل حديثاً' },
  extraColors: ['snow', 'ink', 'primary'],
};

const addToCart = () => {
  // Store the locally-resolved name snapshot in the cart (like a DB row).
  cart.add({ ...demoProduct, name: pickByLocale(demoProduct.name) });
  toast.success(t('product.addedToCart', { name: pickByLocale(demoProduct.name) }));
};
</script>

<template>
  <!-- ======= TEST PRODUCT CARD =======
       A demo product card to preview the shop theme (route: /testcard).
       Replace image, titles, price and swatch colors below as needed.
       Text is locale-keyed ({ en, ar }) -> pickByLocale; static labels use i18n. -->
  <main class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-snow-100 p-8">
    <div class="space-y-8">
      <div class="mx-auto w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-md" data-aos="fade-up">
        <div class="relative">
          <img
            :src="demoProduct.image"
            :alt="pickByLocale(demoProduct.name)"
            class="aspect-[4/3] w-full object-cover"
          />
          <span
            class="absolute left-4 top-4 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white"
          >
            -20%
          </span>
        </div>

        <div class="p-6">
          <p class="text-sm font-semibold uppercase tracking-wide text-primary-500">
            {{ pickByLocale(demoProduct.categoryEyebrow) }}
          </p>
          <h1 class="mt-2 text-xl font-bold text-ink-900">{{ pickByLocale(demoProduct.name) }}</h1>
          <p class="mt-2 text-sm text-ink-500">
            {{ $t('testCard.description') }}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <p class="text-lg font-bold text-ink-900">
              ${{ demoProduct.price.toFixed(2) }}
              <span class="ml-2 text-sm font-medium text-ink-400 line-through">${{ demoProduct.oldPrice.toFixed(2) }}</span>
            </p>
            <div class="flex gap-2">
              <span
                v-for="color in demoProduct.extraColors"
                :key="color"
                class="h-5 w-5 rounded-full ring-1 ring-ink-200"
                :class="{
                  'bg-white ring-ink-200': color === 'snow',
                  'bg-ink-900': color === 'ink',
                  'bg-primary-500': color === 'primary',
                }"
              ></span>
            </div>
          </div>

          <button
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 font-semibold text-white transition duration-200 hover:bg-primary-700 active:scale-90"
            @click="addToCart"
          >
            <i class="pi pi-cart-plus" aria-hidden="true"></i>
            {{ $t('product.addToCart') }}
          </button>
        </div>
      </div>

      <div
        class="mx-auto flex max-w-sm items-center justify-between rounded-lg bg-ink-900 px-6 py-4 text-snow-100"
        data-aos="fade-up"
        data-aos-delay="150"
      >
        <span class="text-sm">{{ $t('testCard.freeShipping') }}</span>
        <span class="text-primary-400">&#9733;</span>
      </div>
    </div>
  </main>
</template>