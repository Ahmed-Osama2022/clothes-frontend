<script setup>
import SkeletonBlock from './SkeletonBlock.vue';

// ======= SECTION HEADER SKELETON =======
// Placeholder for the eyebrow + title that top most home sections
// (FeaturedCategories, BestSellers, Testimonials...). Mirrors the real
// header layout: a short uppercase eyebrow line above a bold title line.
defineProps({
  center: { type: Boolean, default: false },
});
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="flex flex-col gap-3"
    :class="center ? 'items-center text-center' : ''"
  >
    <!-- ======= EYEBROW LINE ======= -->
    <SkeletonBlock class="h-4 w-28" :class="center ? '' : ''" />
    <!-- ======= TITLE LINE ======= -->
    <SkeletonBlock class="h-9 w-72 max-w-full" />
  </div>
</template>