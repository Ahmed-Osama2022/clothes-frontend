<script setup>
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { pickByLocale } from '../i18n';
import { promo } from '../data/site';

// ======= PROMO SPLIT-BANNER + COUNTDOWN (home) =======
// EDITORIAL content: the API has no promo endpoint yet, so the campaign lives in
// src/data/site.js -> promo (fully translated). `ends_at` drives the live
// countdown and the local date format is ISO, so no server clock is needed.
// TODO(api): swap for GET /home -> data.promo when it ships.
const { t } = useI18n();

const now = ref(Date.now());
const timer = setInterval(() => {
  now.value = Date.now();
}, 1000);
onUnmounted(() => clearInterval(timer));

const timeLeft = computed(() => Math.max(0, new Date(promo.ends_at).getTime() - now.value));

const units = computed(() => {
  const total = Math.floor(timeLeft.value / 1000);
  return [
    { labelKey: 'promo.days', value: Math.floor(total / 86400) },
    { labelKey: 'promo.hours', value: Math.floor((total % 86400) / 3600) },
    { labelKey: 'promo.minutes', value: Math.floor((total % 3600) / 60) },
    { labelKey: 'promo.seconds', value: total % 60 },
  ];
});
</script>

<template>
  <!-- ======= PROMO BANNER + COUNTDOWN =======
       Edit the campaign text/dates/images in src/data/site.js -> promo.
       CTA URL comes from promo.<locale>.cta.url (currently /shop). -->
  <section class="relative overflow-hidden">
    <img :src="promo.image" :alt="pickByLocale(promo).title" class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0 bg-ink-950/65"></div>

    <div class="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-20 text-center text-white sm:px-6 lg:px-8 md:py-24" data-aos="fade-up">
      <p class="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold uppercase tracking-wide">
        {{ pickByLocale(promo).title }}
      </p>
      <h2 class="text-4xl font-bold sm:text-5xl">{{ pickByLocale(promo).discount }}</h2>
      <p class="max-w-xl text-lg text-snow-100/90">{{ pickByLocale(promo).subtitle }}</p>

      <!-- ======= COUNTDOWN ======= -->
      <div class="flex items-center gap-3 sm:gap-4">
        <div v-for="unit in units" :key="unit.labelKey" class="min-w-16 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
          <p class="text-2xl font-bold tabular-nums sm:text-3xl">{{ String(unit.value).padStart(2, '0') }}</p>
          <p class="mt-1 text-xs uppercase tracking-wide text-snow-100/80">{{ t(unit.labelKey) }}</p>
        </div>
      </div>

      <RouterLink
        :to="pickByLocale(promo).cta.url"
        class="mt-2 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/30 transition duration-200 hover:bg-primary-700 active:scale-90"
      >
        {{ pickByLocale(promo).cta.label }}
        <i class="pi pi-arrow-right rtl:rotate-180" aria-hidden="true"></i>
      </RouterLink>
    </div>
  </section>
</template>
