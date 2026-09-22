<script setup>
import { useRouter } from 'vue-router';
import { categories, products } from '../data/catalog';

// ======= FEATURED CATEGORIES TILES (home) =======
// Three category cards linking to /category/:slug.
// Source: src/data/catalog.js `categories` (later: /api/home -> categories[],
// see apis.md). Item count comes from `products` filtered by category.
const router = useRouter();
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
      <p class="text-sm font-semibold uppercase tracking-wide text-primary-500" data-aos="fade-up">Shop by category</p>
      <h2 class="mt-2 text-3xl font-bold text-ink-900" data-aos="fade-up">Explore the collections</h2>
    </div>

    <!-- ======= CATEGORY TILES ======= -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          :alt="cat.title"
          loading="lazy"
          class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:aspect-[3/4]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 p-6">
          <p class="inline-flex items-center rounded-full bg-primary-600/90 px-3 py-1 text-xs font-semibold text-white">
            {{ cat.eyebrow }}
          </p>
          <h3 class="mt-3 text-2xl font-bold text-white">{{ cat.title }}</h3>
          <p class="mt-1 text-sm text-snow-100/80">{{ cat.count }} products</p>
          <span
            class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition duration-200 hover:text-primary-200"
          >
            Shop collection
            <i class="pi pi-arrow-right transition duration-200 group-hover:translate-x-1" aria-hidden="true"></i>
          </span>
        </div>
      </article>
    </div>
  </section>
</template>