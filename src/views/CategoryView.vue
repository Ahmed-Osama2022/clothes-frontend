<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { categories, products } from '../data/catalog';
import ProductCard from '../components/ProductCard.vue';

const route = useRoute();
const slug = computed(() => route.params.slug);
const category = computed(() => categories[slug.value]);
const items = computed(() => products.filter((p) => p.category === slug.value));
</script>

<template>
  <!-- ======= CATEGORY PAGE ========
       Rendered at /category/:slug (route defined in src/router/index.js).
       - Category info + products now live in src/data/catalog.js — edit them there.
       - Unknown slugs fall back to the 404 catch-all. -->
  <main>
    <section class="relative overflow-hidden">
      <img
        v-if="category"
        :src="category.image"
        :alt="category.title"
        class="h-[320px] w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
      />
      <div class="absolute inset-0 bg-ink-950/50"></div>
      <div class="absolute inset-0 flex items-center">
        <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" data-aos="fade-up">
          <p class="inline-flex items-center gap-2 rounded-full bg-primary-600/90 px-4 py-1.5 text-sm font-semibold text-white">
            {{ category?.eyebrow }}
          </p>
          <h1 class="mt-4 text-4xl font-bold text-white sm:text-5xl">{{ category?.title }}</h1>
          <p class="mt-3 max-w-2xl text-lg text-snow-100/80">{{ category?.description }}</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" data-aos="fade-up">
      <div class="mb-8 flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-bold text-ink-900">{{ category?.title }}</h2>
          <p class="mt-1 text-sm text-ink-500">{{ items.length }} products</p>
        </div>
        <p class="text-sm text-ink-400">Free shipping over $50</p>
      </div>

      <div v-if="items.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard v-for="product in items" :key="product.id" :product="product" />
      </div>

      <div v-else class="py-20 text-center">
        <p class="text-6xl text-primary-500">404</p>
        <h2 class="mt-4 text-xl font-semibold text-ink-900">Category not found</h2>
        <router-link
          to="/"
          class="mt-6 inline-block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-primary-700 active:scale-90"
        >
          Back to Home
        </router-link>
      </div>
    </section>
  </main>
</template>