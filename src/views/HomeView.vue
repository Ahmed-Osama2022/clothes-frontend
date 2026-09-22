<script setup>
// ======= HOME PAGE LANDING =======
// Pure composition: every section is its own component. Each reads its own
// placeholder data (src/data/catalog.js + src/data/home.js) and documents the
// swap to the aggregated GET /api/home payload (see apis.md) — same shapes, so
// only the import source changes when the backend is up.
import AnnouncementBanner from '../components/AnnouncementBanner.vue';
import HeroSection from '../components/HeroSection.vue';
import FeaturedCategories from '../components/FeaturedCategories.vue';
import BestSellers from '../components/BestSellers.vue';
import PromoBanner from '../components/PromoBanner.vue';
import Testimonials from '../components/Testimonials.vue';
</script>

<template>
  <!-- ======= HOME PAGE ======= -->
  <main>
    <AnnouncementBanner />

    <!-- ======= HERO ======= -->
    <HeroSection />

    <!-- ======= FEATURED CATEGORIES TILES ======= -->
    <FeaturedCategories />

    <!-- ======= BEST SELLERS GRID ======= -->
    <BestSellers />

    <!-- ======= PROMO SPLIT-BANNER + COUNTDOWN ======= -->
    <PromoBanner />

    <!-- ======= TESTIMONIALS CAROUSEL ======= -->
    <Testimonials />
  </main>
</template>
