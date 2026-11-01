<script setup>
import { onMounted } from 'vue';
import { useCatalogStore } from '../stores/catalog';
import AnnouncementBanner from '../components/AnnouncementBanner.vue';
import HeroSection from '../components/HeroSection.vue';
import FeaturedCategories from '../components/FeaturedCategories.vue';
import BestSellers from '../components/BestSellers.vue';
import PromoBanner from '../components/PromoBanner.vue';
import Testimonials from '../components/Testimonials.vue';
import ErrorState from '../components/ErrorState.vue';

// ======= HOME PAGE LANDING =======
// Kicks off the API load (GET /categories + /products, cached per locale).
// Sections read from stores/catalog.js; hero/promo/testimonials are editorial
// content from src/data/site.js (no API endpoint yet).
const catalog = useCatalogStore();

onMounted(() => catalog.load());
</script>

<template>
  <!-- ======= HOME PAGE =======
       Section order matches the design: announcement, hero, categories,
       best sellers, promo countdown, testimonials.
       If the catalog request fails, an error + retry block replaces the
       API-driven sections (hero/promo/testimonials still render). -->
  <main>
    <AnnouncementBanner />
    <HeroSection />

    <ErrorState
      v-if="catalog.error && !catalog.hasData"
      :message="catalog.error.message"
      :offline="catalog.isUnavailable"
      :auto-retry="catalog.isUnavailable ? 15 : 0"
      compact
      @retry="catalog.retry()"
    />

    <template v-else>
      <FeaturedCategories />
      <BestSellers />
    </template>

    <PromoBanner />
    <Testimonials />
  </main>
</template>
