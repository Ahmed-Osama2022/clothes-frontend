<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { pickByLocale } from '../i18n';
import { heroSlides } from '../data/site';

// ======= HERO CAROUSEL =======
// Slides are EDITORIAL content (no API endpoint yet) and live in
// src/data/site.js -> heroSlides. Each slide is locale-keyed ({ en, ar }) and
// resolved with pickByLocale; `category` is a real API slug used by the CTA.
// TODO(api): swap heroSlides for GET /home -> data.hero when it ships.
const { t } = useI18n();

const slides = heroSlides;
const current = ref(0);
let timer = null;

const next = () => {
  current.value = (current.value + 1) % slides.length;
};

const prev = () => {
  current.value = (current.value - 1 + slides.length) % slides.length;
};

const goTo = (index) => {
  current.value = index;
};

const start = () => {
  timer = setInterval(next, 7000);
};

const stop = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

onMounted(start);
onUnmounted(stop);
</script>

<template>
  <!-- ======= HERO CAROUSEL =======
       - Slides: src/data/site.js -> heroSlides (add/remove objects there)
       - Rotation speed: `setInterval(next, 7000)` in <script setup>
       - CTA 'Shop Now' links to /category/{slug} using each slide's `category`
       - Routes live in src/router/index.js -->
  <section class="relative overflow-hidden bg-snow-100 text-center md:text-start" data-aos="fade-up">
    <div
      class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-200/50 blur-3xl"
    ></div>
    <div class="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-ink-100 blur-3xl"></div>

    <div class="relative">
      <div class="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div class="relative">
          <!-- ======= SLIDE TEXT =======
               Re-keyed per slide -> use Vue <transition>, never data-aos here. -->
          <transition name="slide" mode="out-in">
            <div :key="current" class="space-y-6">
              <p
                class="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 ring-1 ring-primary-200"
              >
                {{ pickByLocale(slides[current]).badge }}
                <span class="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
              </p>

              <h1 class="text-5xl font-bold leading-tight text-ink-900 sm:text-6xl">
                {{ pickByLocale(slides[current]).title }}
                <span class="text-primary-500">{{ pickByLocale(slides[current]).accent }}</span>
              </h1>

              <p class="max-w-md text-lg text-ink-500">
                {{ pickByLocale(slides[current]).subtitle }}
              </p>

              <!-- ======= CTA BUTTONS ======= -->
              <div class="flex flex-wrap items-center justify-center gap-4 pt-2 md:justify-start">
                <router-link
                  :to="`/category/${slides[current].category}`"
                  class="rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-primary-700 active:scale-90"
                >
                  {{ t('hero.shopNow') }}
                </router-link>
                <router-link
                  to="/shop"
                  class="rounded-md border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 transition duration-200 hover:-translate-y-0.5 hover:border-primary-400 hover:text-primary-600 active:scale-90"
                >
                  {{ t('hero.exploreCollection') }}
                </router-link>
              </div>
            </div>
          </transition>

          <!-- ======= CAROUSEL CONTROLS ======= -->
          <div class="mt-10 flex items-center justify-center gap-3 md:justify-start">
            <button
              type="button"
              :aria-label="t('hero.previousSlide')"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 transition duration-200 hover:border-primary-400 hover:text-primary-600 active:scale-90"
              @click="prev"
            >
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              :aria-label="t('hero.nextSlide')"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-600 transition duration-200 hover:border-primary-400 hover:text-primary-600 active:scale-90"
              @click="next"
            >
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <div class="flex items-center gap-2">
              <button
                v-for="(_, index) in slides"
                :key="index"
                type="button"
                :aria-label="t('hero.goToSlide', { n: index + 1 })"
                class="h-2 rounded-full transition-all duration-200 active:scale-90"
                :class="index === current ? 'w-8 bg-primary-500' : 'w-2 bg-ink-200 hover:bg-ink-300'"
                @click="goTo(index)"
              ></button>
            </div>
          </div>
        </div>

        <!-- ======= HERO IMAGE CARD (desktop only) ======= -->
        <div class="relative hidden lg:block">
          <div
            class="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-primary-100 via-snow-100 to-ink-100 shadow-xl shadow-ink-900/5"
          >
            <transition name="img-fade" mode="out-in">
              <img
                :key="current"
                :src="slides[current].image"
                :alt="pickByLocale(slides[current]).tag"
                class="absolute inset-0 h-full w-full object-cover"
              />
            </transition>
            <div class="absolute inset-0 bg-gradient-to-t from-ink-900/40 via-transparent to-transparent"></div>

            <div class="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-5 shadow-lg backdrop-blur">
              <p class="text-xs font-semibold uppercase tracking-wide text-primary-500">
                {{ pickByLocale(slides[current]).tag }}
              </p>
              <p class="mt-1 text-lg font-bold text-ink-900">{{ pickByLocale(slides[current]).price }}</p>
            </div>

            <div
              class="absolute -right-4 top-8 animate-float rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur"
            >
              <p class="text-sm font-semibold text-ink-900">-{{ pickByLocale(slides[current]).discount }}</p>
            </div>

            <div
              class="absolute -left-4 bottom-24 animate-float-delayed rounded-2xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
            >
              {{ pickByLocale(slides[current]).pill }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.img-fade-enter-active,
.img-fade-leave-active {
  transition: opacity 0.5s ease;
}

.img-fade-enter-from,
.img-fade-leave-to {
  opacity: 0;
}
</style>
