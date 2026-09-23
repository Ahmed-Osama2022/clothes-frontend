<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { pickByLocale } from '../i18n';
import { categories, products } from '../data/catalog';
import SectionHeaderSkeleton from './skeletons/SectionHeaderSkeleton.vue';
import CategoryTileSkeleton from './skeletons/CategoryTileSkeleton.vue';

// ======= FEATURED CATEGORIES TILES (home) =======
// Three category cards linking to /category/:slug.
// Source: src/data/catalog.js `categories` (later: /api/home -> categories[],
// see apis.md). Category text is locale-keyed ({ en, ar }) and picked by the
// active locale, so switching language updates the tiles instantly.
const router = useRouter();

// ======= LOADING STATE =======
// Sync today; set `loading` true when this swaps to fetching GET /api/home
// (see apis.md) so SectionHeader/CategoryTile skeletons show first.
const loading = ref(false);

const categoryList = Object.keys(categories).map((slug) => ({
  ...categories[slug],
  slug,
  count: products.filter((p) => p.category === slug).length,
}));

const openCategory = (slug) => router.push(`/category/${slug}`);
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mb-10 text-center">
      <SectionHeaderSkeleton v-if="loading" center class="mx-auto" />
      <template v-else>
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-500" data-aos="fade-up">{{ $t('featured.eyebrow') }}</p>
        <h2 class="mt-2 text-3xl font-bold text-ink-900" data-aos="fade-up">{{ $t('featured.title') }}</h2>
      </template>
    </div>

    <!-- ======= CATEGORY TILES =======
         Skeleton grid shows while `loading`; the real tiles swap in via the
         scoped transition (no data-aos on transient blocks). -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <template v-if="loading">
        <CategoryTileSkeleton v-for="n in 3" :key="n" />
      </template>
      <template v-else>
        <article
          v-for="(cat, index) in categoryList"
          :key="cat.slug"
          role="link"
          tabindex="0"
          class="group relative cursor-pointer overflow-hidden rounded-3xl shadow-sm"
          data-aos="fade-up"
          :data-aos-delay="index * 120"
          @click="openCategory(cat.slug)"
          @keydown.enter="openCategory(cat.slug)"
      >
        <img
          :src="cat.image"
          :alt="pickByLocale(cat).title"
          loading="lazy"
          class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:aspect-[3/4]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 p-6">
          <p class="inline-flex items-center rounded-full bg-primary-600/90 px-3 py-1 text-xs font-semibold text-white">
            {{ pickByLocale(cat).eyebrow }}
          </p>
          <h3 class="mt-3 text-2xl font-bold text-white">{{ pickByLocale(cat).title }}</h3>
          <p class="mt-1 text-sm text-snow-100/80">{{ $t('featured.productCount', { count: cat.count }) }}</p>
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