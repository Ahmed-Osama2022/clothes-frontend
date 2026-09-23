<script setup>
import SkeletonBlock from './SkeletonBlock.vue';

// ======= CATEGORY TILE SKELETON =======
// Placeholder matching FeaturedCategories.vue tiles:
//   image block (aspect-[4/3] md:aspect-[3/4]) + dark gradient overlay is
//   simulated with an ink-tinted block + eyebrow pill / title / count lines.
defineProps({
  // Eyebrow pill sits on top, bottom lines sit over a darker lower half.
  dark: { type: Boolean, default: true },
});
</script>

<template>
  <div role="status" aria-live="polite" class="relative overflow-hidden rounded-3xl shadow-sm">
    <SkeletonBlock class="aspect-[4/3] w-full md:aspect-[3/4]" />
    <div v-if="dark" class="absolute inset-0 bg-ink-900/30"></div>
    <div class="absolute inset-x-0 bottom-0 space-y-3 p-6">
      <SkeletonBlock class="h-6 w-24 rounded-full" />
      <SkeletonBlock class="h-8 w-2/3" />
      <SkeletonBlock class="h-4 w-1/3" />
    </div>
  </div>
</template>