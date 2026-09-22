<script setup>
import { products } from '../data/catalog';
import ProductCard from './ProductCard.vue';
import { useRouter } from 'vue-router';

// ======= BEST SELLERS (home) =======
// Grid of top products, each with a 'Best Seller' badge.
// SOURCE (swap point): currently filtered from the `best-sellers` category in
// src/data/catalog.js. When the backend is up, replace with data from
// GET /api/home -> best_sellers[] (see apis.md for the exact shape).
const router = useRouter();
const bestSellers = products.filter((p) => p.category === 'best-sellers').slice(0, 4);
</script>

<template>
  <section class="mt-8">
    <!-- ======= SECTION HEADER ======= -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-primary-500" data-aos="fade-up">Customer favorites</p>
          <h2 class="mt-2 text-3xl font-bold text-ink-900" data-aos="fade-up">Best Sellers</h2>
        </div>
        <RouterLink
          to="/category/best-sellers"
          class="hidden items-center gap-1 text-sm font-semibold text-primary-600 transition duration-200 hover:text-primary-700 active:scale-90 sm:inline-flex"
        >
          View all
          <i class="pi pi-arrow-right" aria-hidden="true"></i>
        </RouterLink>
      </div>
    </div>

    <!-- ======= PRODUCT GRID =======
         Static section -> safe for data-aos (cards themselves carry no AOS). -->
    <div class="mx-auto mt-8 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" data-aos="fade-up">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard
          v-for="product in bestSellers"
          :key="product.id"
          :product="product"
          badge="Best Seller"
        />
      </div>
    </div>
  </section>
</template>