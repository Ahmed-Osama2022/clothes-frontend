<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { categories, products } from '../data/catalog';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';

// ======= SINGLE PRODUCT PAGE (route: /product/:id) =======
// Reads the :id param from the URL and pulls the product from src/data/catalog.js.
// Unknown ids render the 'not found' state. Cards link here from Shop/Category
// (and the cart dropdown) via router.push({ name: 'product', params: { id } }).
const route = useRoute();
const router = useRouter();
const cart = useCartStore();
const toast = useToastStore();

const product = computed(() => products.find((p) => p.id === Number(route.params.id)));
const category = computed(() => (product.value ? categories[product.value.category] : null));

const description = computed(() =>
  product.value
    ? `${product.value.name} is part of the ${category.value?.title || 'collection'} — designed to be versatile, comfortable and easy to style for everyday wear.`
    : ''
);

// Same-category suggestions (excluding the current product).
const related = computed(() =>
  product.value
    ? products.filter((p) => p.category === product.value.category && p.id !== product.value.id).slice(0, 4)
    : []
);

const qty = ref(1);
const changeQty = (delta) => {
  qty.value = Math.min(10, Math.max(1, qty.value + delta));
};

const addToCart = () => {
  cart.add(product.value, qty.value);
  toast.success(`${product.value.name} added to cart`);
  qty.value = 1;
};

const goToProduct = (id) => router.push({ name: 'product', params: { id } });

const features = [
  { icon: 'pi-truck', label: 'Free shipping on orders over $50' },
  { icon: 'pi-credit-card', label: 'Secure checkout & easy returns' },
  { icon: 'pi-shield', label: 'Sustainably sourced fabric' },
];
</script>

<template>
  <main>
    <!-- ======= PRODUCT NOT FOUND ======= -->
    <div v-if="!product" class="mx-auto max-w-7xl px-4 py-24 text-center" data-aos="fade-up">
      <i class="pi pi-tag text-5xl text-ink-300" aria-hidden="true"></i>
      <h1 class="mt-4 text-2xl font-bold text-ink-900">Product not found</h1>
      <p class="mt-2 text-sm text-ink-500">It may have sold out or the link is broken.</p>
      <RouterLink
        to="/shop"
        class="mt-6 inline-block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-primary-700 active:scale-90"
      >
        Browse the shop
      </RouterLink>
    </div>

    <!-- ======= PRODUCT DETAIL ======= -->
    <template v-else>
      <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav class="mb-6 text-sm text-ink-500" data-aos="fade-up">
          <RouterLink to="/" class="hover:text-primary-600">Home</RouterLink>
          <span class="mx-2 text-ink-300">/</span>
          <RouterLink :to="`/category/${product.category}`" class="hover:text-primary-600">
            {{ category?.title }}
          </RouterLink>
          <span class="mx-2 text-ink-300">/</span>
          <span class="font-medium text-ink-900">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <!-- ======= PRODUCT IMAGE ======= -->
          <div class="relative overflow-hidden rounded-3xl bg-white shadow-sm" data-aos="fade-up">
            <img
              :src="product.image"
              :alt="product.name"
              class="aspect-[4/5] w-full object-cover"
            />
          </div>

          <!-- ======= PRODUCT INFO ======= -->
          <div class="flex flex-col" data-aos="fade-up">
            <p class="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              <i class="pi pi-tag" aria-hidden="true"></i>
              {{ category?.eyebrow }}
            </p>
            <h1 class="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">{{ product.name }}</h1>

            <div class="mt-3 flex items-center gap-2 text-sm text-ink-500">
              <span class="flex items-center gap-0.5 text-amber-400">
                <i v-for="n in 5" :key="n" class="pi pi-star text-xs" aria-hidden="true"></i>
              </span>
              <span>4.9 · 120 reviews</span>
            </div>

            <p class="mt-5 text-3xl font-bold text-primary-600">${{ product.price.toFixed(2) }}</p>

            <p class="mt-4 leading-relaxed text-ink-500">{{ description }}</p>

            <!-- ======= QTY + ADD TO CART ======= -->
            <div class="mt-6 flex items-center gap-4">
              <div class="flex items-center gap-1 rounded-lg border border-ink-200 bg-white p-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  class="rounded-md p-2 text-ink-600 transition duration-200 hover:bg-ink-100 active:scale-90 disabled:opacity-40"
                  :disabled="qty <= 1"
                  @click="changeQty(-1)"
                >
                  <i class="pi pi-minus text-xs" aria-hidden="true"></i>
                </button>
                <span class="w-8 text-center text-sm font-semibold text-ink-900">{{ qty }}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  class="rounded-md p-2 text-ink-600 transition duration-200 hover:bg-ink-100 active:scale-90 disabled:opacity-40"
                  :disabled="qty >= 10"
                  @click="changeQty(1)"
                >
                  <i class="pi pi-plus text-xs" aria-hidden="true"></i>
                </button>
              </div>

              <button
                type="button"
                class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
                @click="addToCart"
              >
                <i class="pi pi-cart-plus" aria-hidden="true"></i>
                Add to Cart
              </button>
            </div>

            <!-- ======= TRUST FEATURES ======= -->
            <ul class="mt-8 space-y-3 border-t border-ink-100 pt-6">
              <li v-for="feature in features" :key="feature.label" class="flex items-center gap-3 text-sm text-ink-500">
                <i class="pi text-primary-500" :class="feature.icon" aria-hidden="true"></i>
                {{ feature.label }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ======= RELATED PRODUCTS =======
           Same category, up to 4 items. Cards navigate to /product/:id. -->
      <section v-if="related.length" class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-center justify-between" data-aos="fade-up">
          <h2 class="text-xl font-bold text-ink-900">You might also like</h2>
          <RouterLink :to="`/category/${product.category}`" class="text-sm font-semibold text-primary-600 hover:text-primary-700">
            View all
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
          <article
            v-for="item in related"
            :key="item.id"
            role="link"
            tabindex="0"
            class="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            @click="goToProduct(item.id)"
            @keydown.enter="goToProduct(item.id)"
          >
            <div class="relative overflow-hidden">
              <img
                :src="item.image"
                :alt="item.name"
                loading="lazy"
                class="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div class="p-4">
              <h3 class="font-semibold text-ink-900">{{ item.name }}</h3>
              <p class="mt-1 text-sm font-bold text-primary-600">${{ item.price.toFixed(2) }}</p>
            </div>
          </article>
        </div>
      </section>
    </template>
  </main>
</template>