<script setup>
// ======= TESTIMONIALS CAROUSEL (home) =======
// Auto-rotating reviews. SOURCE (swap point): src/data/home.js -> testimonials
// (fields: author, role, rating, text, avatar). When the backend is up, read
// from GET /api/home -> testimonials (see apis.md) — same shape.
// `text` and `role` are locale-keyed ({ en, ar }) -> pickByLocale().
import { testimonials } from '../data/home';
import { useI18n } from 'vue-i18n';
import { pickByLocale } from '../i18n';
import { computed, onUnmounted, ref } from 'vue';

const { t } = useI18n();

const activeIndex = ref(0);
const testimonialList = testimonials;
const isPlaying = ref(true);
const ROTATE_MS = 6000;

// ======= AUTO-ROTATE =======
const timer = setInterval(() => {
  if (!isPlaying.value) return;
  activeIndex.value = (activeIndex.value + 1) % testimonialList.length;
}, ROTATE_MS);
onUnmounted(() => clearInterval(timer));

const active = computed(() => testimonialList[activeIndex.value]);

const goTo = (index) => {
  activeIndex.value = index;
  isPlaying.value = true; // resume after manual nav
};

// Render "★★★★★" from rating number.
const stars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
</script>

<template>
  <!-- ======= TESTIMONIALS ======= -->
  <section class="bg-snow-50 py-20">
    <div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <p class="text-sm font-semibold uppercase tracking-wide text-primary-500" data-aos="fade-up">
        {{ t('testimonials.eyebrow') }}
      </p>
      <h2 class="mt-2 text-3xl font-bold text-ink-900" data-aos="fade-up">{{ t('testimonials.title') }}</h2>

      <!-- ======= ROTATING REVIEW =======
           Keyed on activeIndex -> re-mounts each slide, so NO data-aos here
           (AOS would freeze it at opacity:0). Use Vue <transition> instead. -->
      <div class="relative mt-12">
        <div class="overflow-hidden">
          <Transition name="slide" mode="out-in">
            <figure :key="activeIndex" class="mx-auto max-w-2xl px-2">
              <div class="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
                <div class="text-xl tracking-widest text-amber-400" aria-label="rating">
                  {{ stars(active.rating) }}
                </div>
                <blockquote class="mt-4 text-lg leading-relaxed text-ink-700">"{{ pickByLocale(active.text) }}"</blockquote>
                <figcaption class="mt-6 flex items-center justify-center gap-3">
                  <img :src="active.avatar" :alt="active.author" class="h-12 w-12 rounded-full object-cover" />
                  <div class="text-left">
                    <p class="font-semibold text-ink-900">{{ active.author }}</p>
                    <p class="text-sm text-ink-500">{{ pickByLocale(active.role) }}</p>
                  </div>
                </figcaption>
              </div>
            </figure>
          </Transition>
        </div>

        <!-- ======= DOTS ======= -->
        <div class="mt-8 flex justify-center gap-2">
          <button
            v-for="(t, index) in testimonialList"
            :key="t.author"
            type="button"
            :aria-label="$t('testimonials.showReview', { author: t.author })"
            class="transition duration-200 active:scale-90"
            :class="
              index === activeIndex
                ? 'h-2.5 w-8 rounded-full bg-primary-600'
                : 'h-2.5 w-2.5 rounded-full bg-ink-200 hover:bg-ink-300'
            "
            @click="goTo(index)"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ======= SLIDE TRANSITION (keyed slide -> NO data-aos) ======= */
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
