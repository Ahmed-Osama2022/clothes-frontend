<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCatalogStore } from '../stores/catalog';
import ProductCard from '../components/ProductCard.vue';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton.vue';
import SkeletonBlock from '../components/skeletons/SkeletonBlock.vue';
import ErrorState from '../components/ErrorState.vue';

// ======= CATEGORY PAGE (route: /category/:slug) =======
// Data: stores/catalog.js (categories + products already fetched from the API).
// The API also has GET /categories/{slug}, but its nested products come without
// images/variants, so we use the shared catalog instead of a second round-trip.
const route = useRoute();
const catalog = useCatalogStore();

const slug = computed(() => route.params.slug);
const loading = computed(() => catalog.loading && !catalog.hasData);
const failed = computed(() => Boolean(catalog.error) && !catalog.hasData);

onMounted(() => catalog.load());

const category = computed(() => catalog.categoryBySlug(slug.value));
const items = computed(() => catalog.productsByCategory(slug.value));
</script>

<template>
  <!-- ======= CATEGORY PAGE =======
       - Metadata (title/description/cover) comes from GET /categories
       - Products come from the shared catalog store, filtered by category slug
       - Unknown slugs fall back to the "not found" block below -->
  <main>
    <section class="relative overflow-hidden">
      <!-- ======= HERO SKELETON (slow connection) ======= -->
      <template v-if="loading">
        <SkeletonBlock class="h-[320px] w-full" />
        <div class="absolute inset-0 bg-ink-950/50"></div>
        <div class="absolute inset-0 flex items-center">
          <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <SkeletonBlock class="h-6 w-32 rounded-full" />
            <SkeletonBlock class="mt-4 h-12 w-2/3 max-w-lg" />
            <SkeletonBlock class="mt-3 h-5 w-1/2 max-w-md" />
          </div>
        </div>
      </template>

      <template v-else-if="category">
        <img
          :src="category.image"
          :alt="category.title"
          class="h-[320px] w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
        />
        <div class="absolute inset-0 bg-ink-950/50"></div>
        <div class="absolute inset-0 flex items-center">
          <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" data-aos="fade-up">
            <p class="inline-flex items-center rounded-full bg-primary-600/90 px-4 py-1.5 text-sm font-semibold text-white">
              {{ $t('featured.eyebrow') }}
            </p>
            <h1 class="mt-4 text-4xl font-bold text-white sm:text-5xl">{{ category.title }}</h1>
            <p class="mt-3 max-w-2xl text-lg text-snow-100/80">{{ category.description }}</p>
          </div>
        </div>
      </template>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" data-aos="fade-up">
      <!-- ======= ERROR (slow/broken connection) =======
           Outages are "temporarily unavailable" + auto-retry, never 404. -->
      <ErrorState
        v-if="failed"
        :message="catalog.error.message"
        :offline="catalog.isUnavailable"
        :auto-retry="catalog.isUnavailable ? 15 : 0"
        @retry="catalog.retry()"
      />

      <template v-else>
        <div v-if="category" class="mb-8 flex items-end justify-between">
          <div>
            <h2 class="text-2xl font-bold text-ink-900">{{ category.title }}</h2>
            <p class="mt-1 text-sm text-ink-500">{{ $t('category.products', { count: items.length }) }}</p>
          </div>
          <p class="text-sm text-ink-400">{{ $t('category.freeShipping') }}</p>
        </div>

        <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <div v-else-if="items.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="product in items" :key="product.id" :product="product" />
        </div>

        <!-- ======= UNKNOWN / EMPTY CATEGORY ======= -->
        <div v-else class="py-20 text-center">
          <p class="text-6xl text-primary-500">404</p>
          <h2 class="mt-4 text-xl font-semibold text-ink-900">{{ $t('category.notFound') }}</h2>
          <router-link
            to="/"
            class="mt-6 inline-block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-primary-700 active:scale-90"
          >
            {{ $t('category.backToHome') }}
          </router-link>
        </div>
      </template>
    </section>
  </main>
</template>
