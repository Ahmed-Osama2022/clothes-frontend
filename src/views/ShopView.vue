<script setup>
import { computed, ref } from 'vue';
import { categories, products } from '../data/catalog';
import ProductCard from '../components/ProductCard.vue';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton.vue';
import { pickByLocale } from '../i18n';

// ======= SHOP PAGE STATE =======
// Filters by category ('all' shows everything) + sorts the grid.
// Sort options: recommended | price-low | price-high | name
// ======= LOADING STATE =======
// Products are sync from catalog.js today. When this swaps to GET /api/products
// (see apis.md), flip `loading` true while fetching -> skeleton grid shows.
const loading = ref(false);
const active = ref('all');
const sort = ref('recommended');

const filters = computed(() => [
  { slug: 'all', labelKey: 'shop.all' },
  ...Object.keys(categories).map((slug) => ({ slug, label: pickByLocale(categories[slug]).title })),
]);

const sortedAndFiltered = computed(() => {
  let list = active.value === 'all' ? [...products] : products.filter((p) => p.category === active.value);

  switch (sort.value) {
    case 'price-low':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      list.sort((a, b) => pickByLocale(a.name).localeCompare(pickByLocale(b.name)));
      break;
    default:
      break;
  }
  return list;
});
</script>

<template>
  <!-- ======= SHOP / FULL CATALOG PAGE ========
       Route: /shop (defined in src/router/index.js).
       - Products + categories come from src/data/catalog.js — edit them there.
       - 'Explore Collection' in the hero + the Navbar 'Shop' link point here. -->
  <main>
    <section class="bg-gradient-to-r from-ink-900 via-ink-800 to-primary-900 py-16 text-white">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" data-aos="fade-up">
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-300">{{ $t('shop.eyebrow') }}</p>
        <h1 class="mt-2 text-4xl font-bold sm:text-5xl">{{ $t('shop.title') }}</h1>
        <p class="mt-3 max-w-2xl text-lg text-snow-100/80">
          {{ $t('shop.subtitle') }}
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div
        class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        data-aos="fade-up"
      >
        <div class="flex flex-wrap items-center gap-2">
          <!-- ======= CATEGORY FILTER CHIPS ======= -->
          <button
            v-for="filter in filters"
            :key="filter.slug"
            type="button"
            class="rounded-full px-4 py-2 text-sm font-medium transition duration-200 hover:scale-105 active:scale-90"
            :class="
              active === filter.slug
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white text-ink-500 ring-1 ring-ink-200 hover:text-primary-600'
            "
            @click="active = filter.slug"
          >
            {{ filter.labelKey ? $t(filter.labelKey) : filter.label }}
          </button>
        </div>

        <label class="flex items-center gap-2 text-sm text-ink-500">
          {{ $t('shop.sortBy') }}
          <select
            v-model="sort"
            class="cursor-pointer rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 outline-none transition focus:border-primary-400"
          >
            <option value="recommended">{{ $t('shop.recommended') }}</option>
            <option value="price-low">{{ $t('shop.priceLow') }}</option>
            <option value="price-high">{{ $t('shop.priceHigh') }}</option>
            <option value="name">{{ $t('shop.name') }}</option>
          </select>
        </label>
      </div>

      <p class="mb-6 text-sm text-ink-500" data-aos="fade-up">
        {{ $t('shop.items', { count: sortedAndFiltered.length }) }}
      </p>

      <!-- ======= GRID ANIMATION =======
           Re-keyed on category/sort change so the listing fades + slides in
           (see the .fade-swap rules in <style scoped>). Logical content animates
           via this Vue transition, so no data-aos here. -->
      <transition name="fade-swap" mode="out-in">
        <!-- ======= SKELETON GRID (while products load from the API) ======= -->
        <div
          v-if="loading"
          key="shop-loading"
          role="status"
          aria-live="polite"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <ProductCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <div
          v-else-if="sortedAndFiltered.length"
          :key="`${active}-${sort}`"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <ProductCard
            v-for="product in sortedAndFiltered"
            :key="product.id"
            :product="product"
          />
        </div>

        <div
          v-else
          :key="`empty-${active}-${sort}`"
          class="py-20 text-center"
        >
          <p class="text-2xl font-semibold text-ink-900">{{ $t('shop.emptyTitle') }}</p>
          <p class="mt-2 text-sm text-ink-500">{{ $t('shop.emptyHint') }}</p>
        </div>
      </transition>
    </section>
  </main>
</template>

<style scoped>
.fade-swap-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.fade-swap-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-swap-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.fade-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>