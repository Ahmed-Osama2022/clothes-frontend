<script setup>
import { ref } from 'vue';
import { products } from '../data/catalog';
import ProductCard from './ProductCard.vue';
import { useRouter } from 'vue-router';
import SectionHeaderSkeleton from './skeletons/SectionHeaderSkeleton.vue';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton.vue';

// ======= BEST SELLERS (home) =======
// Grid of top products, each with a 'Best Seller' badge.
// SOURCE (swap point): currently filtered from the `best-sellers` category in
// src/data/catalog.js. When the backend is up, replace with data from
// GET /api/home -> best_sellers[] (see apis.md for the exact shape).
// The `badge` prop is UI chrome -> translated via i18n (bestSellers.badge).
const router = useRouter();

// ======= LOADING STATE =======
// Sync today; flip `loading` true when this fetches GET /api/home (see apis.md)
// so the header + card skeletons show first.
const loading = ref(false);

const bestSellers = products.filter((p) => p.category === 'best-sellers').slice(0, 4);
</script>

<template>
  <section class="mt-8">
    <!-- ======= SECTION HEADER ======= -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex items-end justify-between">
        <SectionHeaderSkeleton v-if="loading" />
        <template v-else>
          <div>
            <p class="text-sm font-semibold uppercase tracking-wide text-primary-500" data-aos="fade-up">{{ $t('bestSellers.eyebrow') }}</p>
            <h2 class="mt-2 text-3xl font-bold text-ink-900" data-aos="fade-up">{{ $t('bestSellers.title') }}</h2>
          </div>
          <RouterLink
            to="/category/best-sellers"
            class="hidden items-center gap-1 text-sm font-semibold text-primary-600 transition duration-200 hover:text-primary-700 active:scale-90 sm:inline-flex"
          >
            {{ $t('bestSellers.viewAll') }}
            <i class="pi pi-arrow-right rtl:rotate-180" aria-hidden="true"></i>
          </RouterLink>
        </template>
      </div>
    </div>

    <!-- ======= PRODUCT GRID =======
         Card skeletons swap in while `loading` (no data-aos on transient grid). -->
    <div class="mx-auto mt-8 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" data-aos="fade-up">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <template v-if="loading">
          <ProductCardSkeleton v-for="n in 4" :key="n" badge />
        </template>
        <template v-else>
          <ProductCard
            v-for="product in bestSellers"
            :key="product.id"
            :product="product"
            :badge="$t('bestSellers.badge')"
          />
        </template>
      </div>
    </div>
  </section>
</template>