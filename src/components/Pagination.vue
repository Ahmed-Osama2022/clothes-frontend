<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

// ======= SHARED PAGINATION =======
// Client-side pagination control (the MVP API returns the whole catalog without
// `meta`). Emits `update:page`; the parent slices its filtered list.
// Used by: ShopView.
//   <Pagination :page="page" :total-pages="totalPages" @update:page="page = $event" />
const { t } = useI18n();

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
});

const emit = defineEmits(['update:page']);

// Windowed page numbers: first, last, and current ±1 with ellipsis gaps.
const pages = computed(() => {
  const total = props.totalPages;
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const current = props.page;
  const window = new Set([1, total, current - 1, current, current + 1]);
  const list = [...window].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  return list.reduce((result, page, index) => {
    if (index > 0 && page - list[index - 1] > 1) result.push('gap');
    result.push(page);
    return result;
  }, []);
});

const goTo = (page) => {
  if (page < 1 || page > props.totalPages || page === props.page) return;
  emit('update:page', page);
};
</script>

<template>
  <!-- ======= PAGINATION BAR =======
       Hidden when everything fits on one page. Ellipsis entries render as
       plain text (not buttons) so keyboard users only tab through real pages. -->
  <nav
    v-if="totalPages > 1"
    :aria-label="t('shop.pagination')"
    class="mt-10 flex flex-wrap items-center justify-center gap-1.5"
  >
    <button
      type="button"
      :aria-label="t('shop.previousPage')"
      :disabled="page <= 1"
      class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-600 ring-1 ring-ink-200 transition duration-200 hover:text-primary-600 hover:ring-primary-300 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
      @click="goTo(page - 1)"
    >
      <i class="pi pi-angle-left rtl:rotate-180 text-sm" aria-hidden="true"></i>
    </button>

    <template v-for="(entry, index) in pages" :key="`${entry}-${index}`">
      <span v-if="entry === 'gap'" class="px-1 text-ink-400" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        :aria-label="t('shop.goToPage', { page: entry })"
        :aria-current="entry === page ? 'page' : undefined"
        class="h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition duration-200 active:scale-90"
        :class="
          entry === page
            ? 'bg-primary-600 text-white shadow-sm'
            : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:text-primary-600 hover:ring-primary-300'
        "
        @click="goTo(entry)"
      >
        {{ entry }}
      </button>
    </template>

    <button
      type="button"
      :aria-label="t('shop.nextPage')"
      :disabled="page >= totalPages"
      class="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-ink-600 ring-1 ring-ink-200 transition duration-200 hover:text-primary-600 hover:ring-primary-300 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
      @click="goTo(page + 1)"
    >
      <i class="pi pi-angle-right rtl:rotate-180 text-sm" aria-hidden="true"></i>
    </button>
  </nav>
</template>
