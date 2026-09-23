<script setup>
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { pickByLocale } from '../i18n';

// ======= PROMO SPLIT-BANNER + COUNTDOWN (home) =======
// Full-width split: image + headline + live countdown to promo.ends_at.
// SOURCE (swap point): `promo` below is placeholder data. When the backend is
// up, fetch GET /api/home -> promo (see apis.md) and replace this object.
// Content is locale-keyed: { en: {...}, ar: {...} } — picked by active locale.
const { t } = useI18n();

const promo = {
  image:
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
  ends_at: '2026-12-31T23:59:59',
  en: {
    title: 'Mid-Season Sale',
    subtitle: 'Seasonal favorites at unbeatable prices.',
    discount: 'UP TO 50% OFF',
    cta: { label: 'Shop the sale', url: '/shop' },
  },
  ar: {
    title: 'تخفيضات منتصف الموسم',
    subtitle: 'مفضلات موسمية بأسعار لا تُقاوم.',
    discount: 'خصم حتى 50%',
    cta: { label: 'تسوق العرض', url: '/shop' },
  },
};

// ======= COUNTDOWN TIMER =======
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
  <!-- ======= PROMO BANNER ======= -->
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