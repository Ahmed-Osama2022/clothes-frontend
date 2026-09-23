<script setup>
import { useI18n } from 'vue-i18n';
import { useLocaleStore } from '../stores/locale';
import { SUPPORTED_LOCALES } from '../i18n';

// ======= REUSABLE LOCALE SWITCHER =======
// Toggles through the supported locales (en / ar). Reads + writes the active
// locale through stores/locale.js which persists to localStorage and applies it
// app-wide (vue-i18n + RTL dir). Place inside shared headers/footers.
//   - Labels come from i18n keys `lang.en` / `lang.ar` (self-titled in each
//     locale: "English" / "العربية").
//   - Native-name dropdown style: lists every SUPPORTED_LOCALES entry.
const { t } = useI18n();
const localeStore = useLocaleStore();

const switchLocale = (locale) => {
  localeStore.setLocale(locale);
};
</script>

<template>
  <!-- ======= LOCALE SWITCHER =======
       Shows the two supported languages (add more by extending
       SUPPORTED_LOCALES in src/i18n/index.js + adding a messages bundle).
       Current language is highlighted; clicking one switches instantly. -->
  <div class="relative flex items-center gap-1 rounded-md bg-ink-100 p-1" role="group" :aria-label="'Switcher'">
    <button
      v-for="l in SUPPORTED_LOCALES"
      :key="l"
      type="button"
      class="rounded px-2 py-1 text-xs font-semibold transition duration-200 active:scale-90"
      :class="
        localeStore.locale === l
          ? 'bg-white text-primary-600 shadow-sm'
          : 'text-ink-500 hover:text-ink-700'
      "
      :aria-pressed="localeStore.locale === l"
      @click="switchLocale(l)"
    >
      {{ t(`lang.${l}`) }}
    </button>
  </div>
</template>