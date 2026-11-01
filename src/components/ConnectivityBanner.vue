<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCatalogStore } from '../stores/catalog';

// ======= CONNECTIVITY / STALE-DATA BANNER =======
// Degraded-mode notice shown app-wide when a refresh fails but we still have the
// last-good catalog (sessionStorage snapshot from stores/catalog.js).
// It never shows fake data: it labels the real-but-old data and retries itself.
//
// Behaviour:
//   - visible while `catalog.isStale && catalog.hasData`
//   - auto-retries every RETRY_SECONDS (restarts if the retry also fails)
//   - retries immediately when the browser reports it is back online
//
// Rendered once in App.vue, directly under the Navbar.
const { t } = useI18n();
const catalog = useCatalogStore();

const RETRY_SECONDS = 15;
const secondsLeft = ref(0);
let timer = null;

const visible = computed(() => catalog.isStale && catalog.hasData);
const offline = computed(() => catalog.isOffline);

const stopTimer = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

const startTimer = () => {
  stopTimer();
  secondsLeft.value = RETRY_SECONDS;
  timer = setInterval(() => {
    secondsLeft.value -= 1;
    if (secondsLeft.value <= 0) {
      stopTimer();
      catalog.retry();
    }
  }, 1000);
};

// Start/stop the countdown with the banner itself.
watch(visible, (show) => (show ? startTimer() : stopTimer()), { immediate: true });

// A manual/automatic retry toggles `loading`: pause the countdown while the
// request runs, then restart it if the shop is still stale afterwards.
watch(
  () => catalog.loading,
  (loading) => {
    if (loading) {
      stopTimer();
      return;
    }
    if (visible.value) startTimer();
  },
);

// ======= BACK ONLINE =======
// Browsers fire `online` when connectivity returns; retry right away instead
// of waiting for the next countdown tick.
const handleOnline = () => {
  if (visible.value) catalog.retry();
};

onMounted(() => window.addEventListener('online', handleOnline));
onUnmounted(() => {
  stopTimer();
  window.removeEventListener('online', handleOnline);
});
</script>

<template>
  <!-- ======= STALE-DATA BANNER =======
       Amber bar under the header. Explains that the catalog is saved data and
       offers a retry. Hidden as soon as a refresh succeeds (`isStale` false). -->
  <div v-if="visible" role="status" aria-live="polite" class="border-b border-amber-200 bg-amber-50">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"
    >
      <p class="flex items-start gap-2 text-amber-800">
        <i class="pi text-sm" :class="offline ? 'pi-wifi' : 'pi-exclamation-circle'" aria-hidden="true"></i>
        <span>
          <span class="font-semibold">{{ $t('common.staleTitle') }}</span>
          {{ $t('common.staleNotice') }}
        </span>
      </p>

      <div class="flex items-center gap-3 ps-6 sm:ps-0">
        <span v-if="secondsLeft > 0" class="whitespace-nowrap text-xs font-medium text-amber-700">
          {{ $t('common.retryingIn', { seconds: secondsLeft }) }}
        </span>
        <button
          type="button"
          class="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:bg-amber-700 active:scale-90"
          @click="catalog.retry()"
        >
          {{ $t('common.retry') }}
        </button>
      </div>
    </div>
  </div>
</template>
