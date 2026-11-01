<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCatalogStore } from '../stores/catalog';
import ProductCard from '../components/ProductCard.vue';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton.vue';
import Pagination from '../components/Pagination.vue';
import ErrorState from '../components/ErrorState.vue';

// ======= SHOP PAGE =======
// Data: stores/catalog.js -> GET /products?lang=...
// The MVP API returns the WHOLE catalog with no filters/sort/pagination, so
// search, category filtering, sorting and paging are done client-side here.
// When the API grows query support, move these computeds into api/catalog.js.
const { t } = useI18n();
const catalog = useCatalogStore();

const PER_PAGE = 12;

const search = ref('');
const active = ref('all'); // category slug or 'all'
const sort = ref('recommended');
const page = ref(1);

onMounted(() => catalog.load());

const loading = computed(() => catalog.loading && !catalog.hasData);
const failed = computed(() => Boolean(catalog.error) && !catalog.hasData);

const filters = computed(() => [
  { slug: 'all', label: t('shop.all') },
  ...catalog.categories.map((category) => ({ slug: category.slug, label: category.title })),
]);

// Search -> category -> sort, in that order (search narrows everything else).
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase();
  let list = catalog.products;

  if (active.value !== 'all') {
    list = list.filter((product) => product.category === active.value);
  }

  if (term) {
    list = list.filter((product) =>
      [product.name, product.baseName, product.description, product.categoryName]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }

  switch (sort.value) {
    case 'price-low':
      return [...list].sort((a, b) => a.price - b.price);
    case 'price-high':
      return [...list].sort((a, b) => b.price - a.price);
    case 'name':
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    default:
      return list;
  }
});

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PER_PAGE)));
const visible = computed(() => {
  const start = (page.value - 1) * PER_PAGE;
  return filtered.value.slice(start, start + PER_PAGE);
});

// Any filter change restarts at page 1; a shrinking list clamps the page.
watch([active, sort, search], () => {
  page.value = 1;
});
watch(totalPages, (total) => {
  if (page.value > total) page.value = total;
});

const isFiltered = computed(() => active.value !== 'all' || search.value.trim() !== '');
const clearFilters = () => {
  active.value = 'all';
  search.value = '';
  sort.value = 'recommended';
};
</script>

<template>
  <!-- ======= SHOP / FULL CATALOG PAGE ========
       Route: /shop (src/router/index.js). Products + categories come from the
       Laravel API through stores/catalog.js — nothing is hardcoded here.
       Search / sort / category chips / pagination are client-side for now. -->
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
      <!-- ======= FILTER / SEARCH / SORT BAR ======= -->
      <div class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" data-aos="fade-up">
        <div class="flex flex-wrap items-center gap-2">
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
            {{ filter.label }}
          </button>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <!-- ======= SEARCH (client-side; API has no ?search= yet) ======= -->
          <label class="relative flex items-center">
            <span class="sr-only">{{ $t('shop.search') }}</span>
            <i class="pi pi-search absolute left-3 text-sm text-ink-400" aria-hidden="true"></i>
            <input
              v-model="search"
              type="search"
              :placeholder="$t('shop.searchPlaceholder')"
              class="w-full rounded-lg border border-ink-200 bg-white py-2 pl-9 pr-3 text-sm text-ink-900 outline-none transition focus:border-primary-400 sm:w-56"
            />
          </label>

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
      </div>

      <!-- ======= RESULTS COUNT ======= -->
      <p v-if="!loading && !failed" class="mb-6 text-sm text-ink-500" data-aos="fade-up">
        {{ $t('shop.items', { count: filtered.length }) }}
      </p>

      <!-- ======= ERROR (slow/broken connection) =======
           Until the shop can be reached this is a "temporarily unavailable"
           state with auto-retry — NOT the 404 page. -->
      <ErrorState
        v-if="failed"
        :message="catalog.error.message"
        :offline="catalog.isUnavailable"
        :auto-retry="catalog.isUnavailable ? 15 : 0"
        @retry="catalog.retry()"
      />

      <transition v-else name="fade-swap" mode="out-in">
        <!-- ======= SKELETON GRID ======= -->
        <div
          v-if="loading"
          key="shop-loading"
          role="status"
          aria-live="polite"
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <ProductCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <div v-else-if="visible.length" :key="`${active}-${sort}-${page}-${search}`">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ProductCard v-for="product in visible" :key="product.id" :product="product" />
          </div>

          <!-- ======= PAGINATION (client-side over the full catalog) ======= -->
          <Pagination :page="page" :total-pages="totalPages" @update:page="page = $event" />
        </div>

        <!-- ======= EMPTY STATE ======= -->
        <div v-else key="shop-empty" class="py-20 text-center">
          <i class="pi pi-search text-4xl text-ink-300" aria-hidden="true"></i>
          <p class="mt-4 text-2xl font-semibold text-ink-900">
            {{ isFiltered ? $t('shop.noResultsTitle') : $t('shop.emptyTitle') }}
          </p>
          <p class="mt-2 text-sm text-ink-500">
            {{ isFiltered ? $t('shop.noResultsHint') : $t('shop.emptyHint') }}
          </p>
          <button
            v-if="isFiltered"
            type="button"
            class="mt-5 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
            @click="clearFilters"
          >
            {{ $t('common.clearFilters') }}
          </button>
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
