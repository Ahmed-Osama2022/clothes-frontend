<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// ======= SHARED ERROR STATE =======
// Shown instead of content when an API call fails (slow/broken connection).
// Always offers a retry action so the user is never stuck on a blank screen.
//
// Two flavours:
//   default  -> something went wrong (rose)
//   offline  -> the backend is unreachable / 5xx (amber, "temporarily
//               unavailable"). Never use the 404 page for an outage.
//
// Optional `autoRetry` (seconds) re-emits `retry` on its own so a dropped
// connection recovers without a click. The countdown stops as soon as the
// parent swaps this component out for the loading skeleton.
//
// Used by: HomeView, ShopView, CategoryView, ProductView.
//   <ErrorState :message="error.message" :offline="catalog.isUnavailable"
//               :auto-retry="15" @retry="load" />
const { t } = useI18n();

const props = defineProps({
  // Real error message from the API/store; falls back to a translated hint.
  message: { type: String, default: '' },
  // Tighter padding for use inside home sections.
  compact: { type: Boolean, default: false },
  // Outage styling/copy (network/5xx) instead of a generic error.
  offline: { type: Boolean, default: false },
  // Seconds between automatic retries; 0 disables the countdown.
  autoRetry: { type: Number, default: 0 },
});

const emit = defineEmits(['retry']);

const secondsLeft = ref(0);
let timer = null;

const stopTimer = () => {
  if (timer) clearInterval(timer);
  timer = null;
};

const startTimer = (seconds) => {
  stopTimer();
  if (!seconds || seconds <= 0) return;

  secondsLeft.value = seconds;
  timer = setInterval(() => {
    secondsLeft.value -= 1;
    if (secondsLeft.value <= 0) {
      stopTimer();
      emit('retry');
    }
  }, 1000);
};

watch(() => props.autoRetry, startTimer, { immediate: true });
onUnmounted(stopTimer);

const title = computed(() => (props.offline ? t('common.offlineTitle') : t('common.errorTitle')));
const hint = computed(() => (props.offline ? t('common.offlineHint') : t('common.errorHint')));
</script>

<template>
  <!-- ======= ERROR BLOCK =======
       role="alert" announces the failure to screen readers. The retry button
       re-runs the failed request (see @retry handlers in each view). When
       `offline` is set the block explains the outage and can auto-retry. -->
  <div
    role="alert"
    class="mx-auto flex max-w-xl flex-col items-center rounded-2xl border text-center"
    :class="[
      offline ? 'border-amber-200 bg-amber-50/70' : 'border-rose-100 bg-rose-50/60',
      compact ? 'my-6 p-6' : 'my-16 p-10',
    ]"
  >
    <span
      class="flex h-12 w-12 items-center justify-center rounded-full"
      :class="offline ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-500'"
    >
      <i class="pi text-xl" :class="offline ? 'pi-wifi' : 'pi-exclamation-triangle'" aria-hidden="true"></i>
    </span>

    <h2 class="mt-4 text-lg font-bold text-ink-900">{{ title }}</h2>
    <p class="mt-1.5 text-sm text-ink-500">{{ message || hint }}</p>

    <p v-if="autoRetry > 0 && secondsLeft > 0" class="mt-3 text-xs font-medium text-amber-700">
      {{ $t('common.retryingIn', { seconds: secondsLeft }) }}
    </p>

    <button
      type="button"
      class="mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 active:scale-90"
      :class="offline ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary-600 hover:bg-primary-700'"
      @click="$emit('retry')"
    >
      <i class="pi pi-refresh" aria-hidden="true"></i>
      {{ $t('common.retry') }}
    </button>
  </div>
</template>
