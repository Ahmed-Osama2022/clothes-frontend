<script setup>
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAboutStore } from '../stores/about';
import SkeletonBlock from '../components/skeletons/SkeletonBlock.vue';
import ErrorState from '../components/ErrorState.vue';

// ======= ABOUT PAGE (route: /about) =======
// Data: GET /about?lang=... through stores/about.js — title, intro, text blocks,
// stats, contact details, social links and a gallery image set.
// Nothing on this page is hardcoded copy: edit the page in the backend admin
// (Page slug "about" + its sections/images) and every client updates at once.
const { t, locale } = useI18n();
const about = useAboutStore();

const page = computed(() => about.page);
const loading = computed(() => about.loading && !about.hasData);
// 404 = the backend has no published "about" page; outage = cannot reach it.
const missing = computed(() => about.isMissing && !about.hasData);
const failed = computed(() => Boolean(about.error) && !about.hasData && !missing.value);

onMounted(() => about.load());

// Refetch when the language changes (Arabic comes from ?lang=ar).
watch(locale, () => about.load());

const heroAlt = computed(() => page.value?.title || t('about.title'));

// ======= "LAST UPDATED" =======
// Uses the API timestamp, formatted for the active locale (not translated UI).
const updatedLabel = computed(() => {
  const iso = page.value?.updatedAt;
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(locale.value, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return iso.slice(0, 10);
  }
});

// ======= SOCIAL ICONS =======
// `platform` is localized (Instagram / إنستغرام), so the icon is matched on the
// URL host instead. Unknown networks fall back to a generic share icon.
const SOCIAL_ICONS = {
  instagram: 'pi-instagram',
  facebook: 'pi-facebook',
  twitter: 'pi-twitter',
  tiktok: 'pi-tiktok',
  youtube: 'pi-youtube',
  linkedin: 'pi-linkedin',
  whatsapp: 'pi-whatsapp',
};

const socialIcon = (url) => {
  const haystack = String(url).toLowerCase();
  const match = Object.keys(SOCIAL_ICONS).find((key) => haystack.includes(key));
  return match ? SOCIAL_ICONS[match] : 'pi-share-alt';
};

// Contact rows: the store derives `href` (mailto/tel), so the icon follows it.
const contactIcon = (href) => {
  if (!href) return 'pi-map-marker';
  return href.startsWith('mailto:') ? 'pi-envelope' : 'pi-phone';
};
</script>

<template>
  <main class="bg-snow-100 pb-16">
    <!-- ======= SAVED-CONTENT NOTICE (degraded mode) =======
         Only when this page came from the last-good snapshot because the refresh
         failed. It is the real saved page, labelled — never invented copy. -->
    <div
      v-if="about.isStale && page"
      role="status"
      aria-live="polite"
      class="border-b border-amber-200 bg-amber-50"
    >
      <div
        class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
      >
        <p class="flex items-start gap-2">
          <i class="pi pi-exclamation-circle text-sm" aria-hidden="true"></i>
          <span>{{ $t('about.staleNotice') }}</span>
        </p>
        <button
          type="button"
          class="self-start rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:bg-amber-700 active:scale-90 sm:self-auto"
          @click="about.retry()"
        >
          {{ $t('common.retry') }}
        </button>
      </div>
    </div>

    <transition name="fade-swap" mode="out-in">
      <!-- ======= SKELETON (first load) =======
           Mirrors the hero + stats + cards layout so the page never jumps. -->
      <div
        v-if="loading"
        key="loading"
        role="status"
        aria-live="polite"
        class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <span class="sr-only">{{ $t('loading.placeholder') }}</span>

        <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SkeletonBlock class="h-7 w-32 rounded-full" />
            <SkeletonBlock class="mt-5 h-12 w-3/4" />
            <SkeletonBlock class="mt-3 h-5 w-full" />
            <SkeletonBlock class="mt-2 h-5 w-5/6" />
            <SkeletonBlock class="mt-8 h-11 w-44 rounded-lg" />
          </div>
          <div class="grid grid-cols-5 gap-4">
            <SkeletonBlock class="col-span-3 h-[300px] rounded-3xl sm:h-[420px]" />
            <SkeletonBlock class="col-span-2 mt-10 h-[240px] rounded-3xl sm:h-[340px]" />
          </div>
        </div>

        <div class="mt-16 grid grid-cols-2 gap-4 border-t border-ink-100 pt-10 md:grid-cols-3">
          <SkeletonBlock v-for="n in 3" :key="n" class="h-24 rounded-2xl" />
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonBlock v-for="n in 3" :key="n" class="h-56 rounded-2xl" />
        </div>
      </div>

      <!-- ======= 404: NO PUBLISHED ABOUT PAGE =======
           A real 404 from the API (page unpublished/absent), not an outage. -->
      <section
        v-else-if="missing"
        key="missing"
        class="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8"
      >
        <p class="text-6xl font-bold text-primary-500">404</p>
        <h1 class="mt-4 text-2xl font-bold text-ink-900">{{ $t('about.notAvailable') }}</h1>
        <p class="mt-2 text-sm text-ink-500">{{ $t('about.notAvailableHint') }}</p>
        <RouterLink
          to="/"
          class="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
        >
          <i class="pi pi-arrow-left rtl:rotate-180" aria-hidden="true"></i>
          {{ $t('notFound.backToHome') }}
        </RouterLink>
      </section>

      <!-- ======= OUTAGE (unreachable / 5xx) =======
           Amber "temporarily unavailable" + auto-retry, never the 404 block. -->
      <ErrorState
        v-else-if="failed"
        key="error"
        :message="about.error.message"
        :offline="about.isUnavailable"
        :auto-retry="about.isUnavailable ? 15 : 0"
        @retry="about.retry()"
      />

      <!-- ======= PAGE CONTENT (GET /about) ======= -->
      <div v-else-if="page" key="content">
        <!-- ======= HERO =======
             title + intro from the API; the gallery uses images[] in API order. -->
        <section class="relative overflow-hidden bg-gradient-to-b from-primary-50 via-snow-50 to-snow-100">
          <span
            class="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl"
            aria-hidden="true"
          ></span>

          <div
            class="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
            :class="page.images.length ? 'lg:grid-cols-2 lg:items-center' : ''"
          >
            <div data-aos="fade-up">
              <p class="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-700">
                <span class="h-1.5 w-1.5 rounded-full bg-primary-500" aria-hidden="true"></span>
                {{ $t('about.eyebrow') }}
              </p>

              <h1 class="mt-5 text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl">
                {{ page.title || $t('about.title') }}
              </h1>

              <p v-if="page.intro" class="mt-5 max-w-xl text-lg leading-relaxed text-ink-500">
                {{ page.intro }}
              </p>

              <div class="mt-8 flex flex-wrap items-center gap-3">
                <RouterLink
                  to="/shop"
                  class="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
                >
                  {{ $t('hero.shopNow') }}
                  <i class="pi pi-arrow-right rtl:rotate-180" aria-hidden="true"></i>
                </RouterLink>
                <a
                  v-if="page.contact.length"
                  href="#contact"
                  class="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-5 py-2.5 text-sm font-semibold text-ink-700 shadow-sm transition duration-200 hover:border-primary-300 hover:text-primary-700 active:scale-90"
                >
                  {{ $t('about.contactCta') }}
                </a>
              </div>
            </div>

            <!-- ======= GALLERY (images[] from the API) ======= -->
            <div v-if="page.images.length" class="relative" data-aos="fade-up" data-aos-delay="120">
              <div class="grid grid-cols-5 gap-4">
                <img
                  :src="page.images[0]"
                  :alt="heroAlt"
                  class="col-span-3 h-[300px] w-full rounded-3xl object-cover shadow-xl sm:h-[420px]"
                />
                <img
                  v-if="page.images[1]"
                  :src="page.images[1]"
                  :alt="heroAlt"
                  loading="lazy"
                  class="col-span-2 mt-10 h-[240px] w-full rounded-3xl object-cover shadow-lg sm:h-[340px]"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- ======= STATS (stats[] from the API) ======= -->
        <section v-if="page.stats.length" class="border-b border-ink-100 bg-white">
          <div
            class="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8"
          >
            <div
              v-for="(stat, index) in page.stats"
              :key="index"
              class="text-center"
              data-aos="fade-up"
              :data-aos-delay="index * 80"
            >
              <p class="text-3xl font-bold text-primary-600 sm:text-4xl">{{ stat.value }}</p>
              <p class="mt-1 text-sm text-ink-500">{{ stat.label }}</p>
            </div>
          </div>
        </section>

        <!-- ======= TEXT BLOCKS (sections[] from the API) =======
             Heading + body are already translated; plain text, no HTML. -->
        <section v-if="page.sections.length" class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article
              v-for="(section, index) in page.sections"
              :key="index"
              class="rounded-2xl border border-ink-100 bg-white p-7 shadow-sm"
              data-aos="fade-up"
              :data-aos-delay="index * 80"
            >
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-600"
              >
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <h2 v-if="section.heading" class="mt-4 text-xl font-bold text-ink-900">
                {{ section.heading }}
              </h2>
              <p class="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-500">
                {{ section.body }}
              </p>
            </article>
          </div>
        </section>

        <!-- ======= CONTACT + SOCIAL (contact[] / social[] from the API) =======
             Emails become mailto: and phone numbers tel: (href derived in the
             store). Social links open in a new tab. -->
        <section id="contact" class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div
              v-if="page.contact.length"
              class="rounded-2xl border border-ink-100 bg-white p-7 shadow-sm"
              data-aos="fade-up"
            >
              <h2 class="text-xl font-bold text-ink-900">{{ $t('about.contactTitle') }}</h2>

              <ul class="mt-6 space-y-4">
                <li
                  v-for="item in page.contact"
                  :key="item.label + item.value"
                  class="flex items-start gap-3"
                >
                  <span
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600"
                  >
                    <i class="pi" :class="contactIcon(item.href)" aria-hidden="true"></i>
                  </span>
                  <div class="min-w-0">
                    <p class="text-xs font-semibold uppercase tracking-wide text-ink-400">
                      {{ item.label }}
                    </p>
                    <a
                      v-if="item.href"
                      :href="item.href"
                      class="break-words text-sm font-semibold text-ink-900 transition duration-200 hover:text-primary-700"
                    >
                      {{ item.value }}
                    </a>
                    <p v-else class="break-words text-sm font-semibold text-ink-900">
                      {{ item.value }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div
              v-if="page.social.length"
              class="rounded-2xl bg-ink-950 p-7 text-snow-100 shadow-sm"
              data-aos="fade-up"
              data-aos-delay="120"
            >
              <h2 class="text-xl font-bold text-white">{{ $t('about.followUs') }}</h2>

              <ul class="mt-6 space-y-3">
                <li v-for="item in page.social" :key="item.url">
                  <a
                    :href="item.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold transition duration-200 hover:border-white/25 hover:bg-white/10 active:scale-90"
                  >
                    <i class="pi text-base" :class="socialIcon(item.url)" aria-hidden="true"></i>
                    <span class="flex-1">{{ item.platform }}</span>
                    <i class="pi pi-arrow-up-right text-xs text-white/60" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <!-- ======= CONTENT TIMESTAMP (updatedAt from the API) ======= -->
          <p v-if="updatedLabel" class="mt-10 flex items-center justify-center gap-2 text-xs text-ink-400">
            <i class="pi pi-clock" aria-hidden="true"></i>
            {{ $t('about.updated', { date: updatedLabel }) }}
          </p>
        </section>
      </div>
    </transition>
  </main>
</template>

<style scoped>
/* ======= STATE SWAP (skeleton -> content) =======
   Vue transition is used instead of AOS on the swapping blocks so a re-mount can
   never leave the page stuck at opacity:0 (see AGENTS.md). */
.fade-swap-enter-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.fade-swap-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-swap-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}

.fade-swap-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
