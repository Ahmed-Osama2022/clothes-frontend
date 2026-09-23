<script setup>
import SkeletonBlock from './SkeletonBlock.vue';

// ======= PRODUCT CARD SKELETON =======
// Placeholder matching ProductCard.vue's layout exactly:
//   image block (aspect-[4/3] md:aspect-[4/5]) + optional badge +
//   padded title line + price line. Rendered while /api (products or home)
//   is loading. Replaces the real card 1:1 so the grid never jumps.
defineProps({
  // Show a tiny "badge" stub top-left (best-seller / promo tags).
  badge: { type: Boolean, default: false },
});
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="overflow-hidden rounded-2xl bg-white shadow-sm"
  >
    <div class="relative">
      <SkeletonBlock class="aspect-[4/3] w-full md:aspect-[4/5]" />
      <SkeletonBlock v-if="badge" class="absolute left-4 top-4 h-5 w-20 rounded-full" />
    </div>
    <div class="space-y-3 p-4">
      <SkeletonBlock class="h-4 w-3/4" />
      <SkeletonBlock class="h-4 w-1/3" />
    </div>
  </div>
</template>