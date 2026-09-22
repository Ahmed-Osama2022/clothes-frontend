<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

// ======= CATEGORY DATA =======
// Keyed by slug. Add new categories here and link to them via /category/{slug}.
const categories = {
  'signature-collection': {
    title: 'Signature Collection',
    eyebrow: 'New Season 2026',
    description: 'Curated everyday pieces — effortless, versatile and made to move with you.',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600',
  },
  'mid-season-sale': {
    title: 'Mid-Season Sale',
    eyebrow: 'Up to 50% Off',
    description: 'Seasonal favorites at unbeatable prices. Stock up before the sale ends.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
  },
  'best-sellers': {
    title: 'Best Sellers',
    eyebrow: 'New Arrivals',
    description: 'Everyone is wearing these right now — sustainably made, seriously comfortable.',
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1600',
  },
};

// ======= PRODUCTS =======
// Add/edit the shop items shown in the category grid. `category` must match a key above.
const products = [
  { name: 'Classic White Tee', price: 24.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
  { name: 'Essential Crewneck', price: 34.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Street Co-ord', price: 59.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800' },
  { name: 'Summer Linen Shirt', price: 39.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Rack Clearance Tee', price: 9.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Denim Day Fit', price: 44.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Weekend Overshirt', price: 29.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Hanger Stack Tee', price: 12.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Hanging Everyday Set', price: 74.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800' },
  { name: 'Runway Model Top', price: 49.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800' },
  { name: 'Boutique Blazer', price: 89.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Studio Top', price: 32.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800' },
];

const route = useRoute();
const slug = computed(() => route.params.slug);
const category = computed(() => categories[slug.value]);
const items = computed(() => products.filter((p) => p.category === slug.value));
</script>

<template>
  <!-- ======= CATEGORY PAGE ========
       Rendered at /category/:slug (route defined in src/router/index.js).
       - Edit category info + products in the arrays inside <script setup>.
       - Unknown slugs fall back to the 404 view. -->
  <main>
    <section class="relative overflow-hidden">
      <img
        v-if="category"
        :src="category.image"
        :alt="category.title"
        class="ease-[cubic-bezier(0.22,1,0.36,1)] h-[320px] w-full object-cover transition-transform duration-700 hover:scale-105"
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

      <div
        v-if="items.length"
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <article
          v-for="product in items"
          :key="product.name"
          class="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="relative overflow-hidden">
            <img
              :src="product.image"
              :alt="product.name"
              loading="lazy"
              class="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <button
              type="button"
              class="absolute inset-x-4 bottom-4 translate-y-12 rounded-lg bg-ink-900/90 py-2.5 text-sm font-semibold text-white opacity-0 transition-all duration-300 hover:bg-primary-600 group-hover:translate-y-0 group-hover:opacity-100"
            >
              Add to Cart
            </button>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-ink-900">{{ product.name }}</h3>
            <p class="mt-1 text-sm font-bold text-primary-600">${{ product.price.toFixed(2) }}</p>
          </div>
        </article>
      </div>

      <div v-else class="py-20 text-center">
        <p class="text-6xl text-primary-500">404</p>
        <h2 class="mt-4 text-xl font-semibold text-ink-900">Category not found</h2>
        <router-link
          to="/"
          class="mt-6 inline-block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-700"
        >
          Back to Home
        </router-link>
      </div>
    </section>
  </main>
</template>