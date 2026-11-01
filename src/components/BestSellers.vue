<script setup>
import { computed } from 'vue';
import { useCatalogStore } from '../stores/catalog';
import ProductCard from './ProductCard.vue';
import SectionHeaderSkeleton from './skeletons/SectionHeaderSkeleton.vue';
import ProductCardSkeleton from './skeletons/ProductCardSkeleton.vue';

// ======= BEST SELLERS (home) =======
// Data: stores/catalog.js -> products where the API marks `isFeatured: true`
// (GET /products seeds three featured items). No extra request: the catalog is
// already loaded/shared by HomeView + Navbar.
const catalog = useCatalogStore();

const loading = computed(() => catalog.loading && !catalog.hasData);
const bestSellers = computed(() => catalog.featuredProducts.slice(0, 4));
</script>

<template>
  <!-- ======= BEST SELLERS =======
       Section is hidden when the API returns no featured products (no fake
       fill-in). Skeletons mirror the real 4-card grid while loading. -->
  <section v-if="loading || bestSellers.length" class="mt-8">
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
