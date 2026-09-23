<script setup>
import SkeletonBlock from './SkeletonBlock.vue';

// ======= HERO SKELETON =======
// Placeholder matching HeroSection.vue's split layout while slides load:
//   left: badge pill, headline lines, subtitle lines, two CTA pill blocks
//   right: the big aspect-[4/5] product image block (hidden below lg, like the real hero).
defineProps({
  // '1' renders one static skeleton; slides load once so a single frame is enough.
  count: { type: Number, default: 1 },
});
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    class="grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8"
  >
    <!-- ======= LEFT: TEXT BLOCKS ======= -->
    <div class="space-y-6">
      <SkeletonBlock class="h-8 w-40 rounded-full" />
      <div class="space-y-3">
        <SkeletonBlock class="h-12 w-3/4 sm:h-16" />
        <SkeletonBlock class="h-12 w-1/2 sm:h-16" />
      </div>
      <div class="space-y-2">
        <SkeletonBlock class="h-4 w-full max-w-md" />
        <SkeletonBlock class="h-4 w-3/4 max-w-md" />
      </div>
      <div class="flex flex-wrap gap-4 pt-2">
        <SkeletonBlock class="h-11 w-36" />
        <SkeletonBlock class="h-11 w-40" />
      </div>
    </div>

    <!-- ======= RIGHT: IMAGE BLOCK ======= -->
    <div class="relative hidden lg:block">
      <SkeletonBlock class="mx-auto aspect-[4/5] w-full max-w-md rounded-3xl" />
    </div>
  </div>
</template>