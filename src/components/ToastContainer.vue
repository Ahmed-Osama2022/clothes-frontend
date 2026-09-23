<script setup>
import { useI18n } from 'vue-i18n';
import { useToastStore } from '../stores/toast';

// ======= GLOBAL TOASTS =======
// Rendered once from App.vue. Shows success/error/info messages pushed by
// useToastStore(). Toasts are re-keyed, so they animate via Vue <transition-group>
// (never data-aos on these).
const { t } = useI18n();
const toast = useToastStore();

const iconFor = (type) => ({
  success: 'pi-check-circle',
  error: 'pi-times-circle',
  info: 'pi-info-circle',
}[type]);

const stylesFor = (type) => ({
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-primary-200 bg-snow-50 text-ink-800',
}[type]);

const iconColorFor = (type) => ({
  success: 'text-emerald-500',
  error: 'text-rose-500',
  info: 'text-primary-500',
}[type]);
</script>

<template>
  <div class="pointer-events-none fixed inset-x-4 top-20 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end">
    <transition-group name="toast" tag="div" class="flex w-full max-w-sm flex-col gap-2">
      <div
        v-for="t in toast.toasts"
        :key="t.id"
        class="pointer-events-auto flex w-full items-start gap-3 rounded-xl border bg-white p-4 shadow-lg"
        :class="stylesFor(t.type)"
      >
        <i class="pi mt-0.5 text-lg" :class="[iconFor(t.type), iconColorFor(t.type)]" aria-hidden="true"></i>
        <p class="flex-1 text-sm font-medium">{{ t.message }}</p>
        <button
          type="button"
          :aria-label="t('toast.dismiss')"
          class="rounded-md p-1 text-lg opacity-60 transition duration-200 hover:opacity-100 active:scale-90"
          @click="toast.dismiss(t.id)"
        >
          <i class="pi pi-times" aria-hidden="true"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.96);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(24px) scale(0.96);
}
</style>