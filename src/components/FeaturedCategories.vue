<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCatalogStore } from '../stores/catalog';
import { categoryEyebrow } from '../data/site';
import SectionHeaderSkeleton from './skeletons/SectionHeaderSkeleton.vue';
import CategoryTileSkeleton from './skeletons/CategoryTileSkeleton.vue';

// ======= FEATURED CATEGORIES TILES (home) =======
// Data: stores/catalog.js -> GET /categories?lang=... (localized title +
// description, productsCount, gallery). The accent line (`eyebrow`) is not in
// the API yet, so it comes from src/data/site.js keyed by category slug.
const router = useRouter();
const catalog = useCatalogStore();

const loading = computed(() => catalog.loading && !catalog.hasData);
const categories = computed(() => catalog.categories);

// Product count per tile: exact client-side count, falling back to the API count.
const countFor = (category) => catalog.productsByCategory(category.slug).length || category.count;

const openCategory = (slug) => router.push(`/category/${slug}`);
</script>

<template>
  <!-- ======= FEATURED CATEGORIES =======
       Tiles link to /category/{slug} (slug comes from the API).
       Skeleton grid shows while loading; real tiles swap in via v-else
       (no data-aos on the transient blocks). -->
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mb-10 text-center">
      <SectionHeaderSkeleton v-if="loading" center class="mx-auto" />
      <template v-else>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-500" data-aos="fade-up">{{ $t('featured.eyebrow') }}</p>
        <h2 class="mt-2 text-3xl font-bold text-ink-900" data-aos="fade-up">{{ $t('featured.title') }}</h2>
      </template>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <template v-if="loading">
        <CategoryTileSkeleton v-for="n in 3" :key="n" />
      </template>
      <template v-else>
        <article
          v-for="(category, index) in categories"
          :key="category.slug"
          role="link"
          tabindex="0"
          class="group relative cursor-pointer overflow-hidden rounded-3xl shadow-sm"
          data-aos="fade-up"
          :data-aos-delay="index * 120"
          @click="openCategory(category.slug)"
          @keydown.enter="openCategory(category.slug)"
        >
          <img
            :src="category.image"
            :alt="category.title"
            loading="lazy"
            class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:aspect-[3/4]"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent"></div>
          <div class="absolute inset-x-0 bottom-0 p-6">
            <p class="inline-flex items-center rounded-full bg-primary-600/90 px-3 py-1 text-xs font-semibold text-white">
              {{ categoryEyebrow(category.slug) || $t('featured.eyebrow') }}
            </p>
            <h3 class="mt-3 text-2xl font-bold text-white">{{ category.title }}</h3>
            <p class="mt-1 text-sm text-snow-100/80">{{ $t('featured.productCount', { count: countFor(category) }) }}</p>
            <span
              class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition duration-200 hover:text-primary-200"
            >
              {{ $t('featured.shopCollection') }}
              <i class="pi pi-arrow-right rtl:rotate-180 transition duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden="true"></i>
            </span>
          </div>
        </article>
      </template>
    </div>
  </section>
</template>
