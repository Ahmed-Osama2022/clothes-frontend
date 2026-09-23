<script setup>
import { useI18n } from 'vue-i18n';

// ======= SKELETON BLOCK (shimmer primitive) =======
// Base building block for every skeleton placeholder. Use it to draw
// rectangles/circles that shimmer while data loads. Size/shape comes from the
// `class` prop (w-*, h-*, rounded-*, aspect-* ...). Never render real content
// here — skeletons are replaced by the real UI once the API resolves.
defineProps({
  // Round the block to a perfect circle (e.g. avatars).
  circle: { type: Boolean, default: false },
});

// Screen readers: the parent component wraps skeletons with role="status", so
// this block is purely decorative.
const { t } = useI18n();
</script>

<template>
  <span
    class="shimmer relative block select-none overflow-hidden animate-shimmer"
    :class="circle ? 'rounded-full' : 'rounded-md'"
  >
    <span class="sr-only">{{ t('loading.placeholder') }}</span>
  </span>
</template>

<style scoped>
/* ======= SHIMMER SWEEP =======
   A soft light band travels across the placeholder (ink-200 -> snow -> ink-200).
   The `animate-shimmer` class comes from tailwind.config.js (keyframes `shimmer`,
   which animates background-position). Sizing the gradient at 200% width here
   makes it a single travelling highlight instead of the whole block fading. */
.shimmer {
  background: linear-gradient(
    100deg,
    rgb(213 215 217) 0%,
    rgb(213 215 217) 40%,
    rgb(248 249 250) 50%,
    rgb(213 215 217) 60%,
    rgb(213 215 217) 100%
  );
  background-size: 200% 100%;
  min-height: 1rem;
}
</style>