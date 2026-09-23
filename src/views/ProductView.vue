<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { categories, products } from '../data/catalog';
import { getProductStock } from '../api/stock';
import { useAsyncData } from '../composables/useAsyncData';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import ProductCard from '../components/ProductCard.vue';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton.vue';
import SkeletonBlock from '../components/skeletons/SkeletonBlock.vue';
import { pickByLocale } from '../i18n';

// ======= SINGLE PRODUCT PAGE (route: /product/:id) =======
// Reads the :id param from the URL and pulls the product from src/data/catalog.js.
// Unknown ids render the 'not found' state.
// Product/category text is locale-keyed ({ en, ar }) -> pickByLocale.
// ======= LOADING STATE =======
// Sync today; flip `loading` true when this fetches GET /api/products/{id}
// (+ related, see apis.md) so the detail + related skeletons show first.
const loading = ref(false);
const { t } = useI18n();
const route = useRoute();
const cart = useCartStore();
const toast = useToastStore();

const product = computed(() => products.find((p) => p.id === Number(route.params.id)));
const category = computed(() => (product.value ? categories[product.value.category] : null));
// Products have `name` as a nested locale map ({ en, ar }) — resolve that field.
const localizedName = computed(() => (product.value ? pickByLocale(product.value.name) : ''));
const localizedCategory = computed(() => (category.value ? pickByLocale(category.value) : null));

const description = computed(() =>
  product.value
    ? `${localizedName.value} is part of the ${localizedCategory.value?.title || 'collection'} — designed to be versatile, comfortable and easy to style for everyday wear.`
    : '',
);

// Same-category suggestions (excluding the current product).
const related = computed(() =>
  product.value
    ? products.filter((p) => p.category === product.value.category && p.id !== product.value.id).slice(0, 4)
    : [],
);

const qty = ref(1);
const changeQty = (delta) => {
  qty.value = Math.min(10, Math.max(1, qty.value + delta));
};

// ======= PER-SIZE STOCK (GET /api/products/{id}/stock) =======
// Sizes + availability come from src/api/stock.js (faked, deterministic for now).
// The real backend returns the SAME shape, so only the api import changes later.
// Re-fetches when the route moves between products; selection resets per product.
const selectedSize = ref('');
const {
  data: stock,
  loading: stockLoading,
  error: stockError,
  execute: loadStock,
} = useAsyncData(() => getProductStock(product.value?.id).then((res) => res.data));

watch(
  () => product.value?.id,
  (id) => {
    selectedSize.value = '';
    if (id) loadStock();
  },
  { immediate: true },
);

// A size is only selectable when it has stock (see the sizeButtonClass styling).
const isSizeOut = (size) => {
  const entry = stock.value?.sizes?.find((s) => s.size === size);
  return !entry || !entry.in_stock;
};

const sizeButtonClass = (s) => {
  if (!s.in_stock) return 'border-ink-100 bg-ink-50 text-ink-300 line-through decoration-ink-300';
  return selectedSize.value === s.size
    ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
    : 'border-ink-200 bg-white text-ink-700 hover:border-primary-400 hover:text-primary-600';
};

const addToCart = () => {
  // A size must be chosen, and it must still be in stock, before adding.
  if (!selectedSize.value) {
    toast.error(t('product.selectSizeFirst'));
    return;
  }
  if (isSizeOut(selectedSize.value)) {
    toast.error(t('product.sizeOutOfStock', { size: selectedSize.value }));
    return;
  }
  cart.add({ ...product.value, name: localizedName.value, size: selectedSize.value }, qty.value);
  toast.success(t('product.addedToCartWithSize', { name: localizedName.value, size: selectedSize.value }));
  qty.value = 1;
};

// Trust features are UI chrome -> translated via i18n (product.feature*).
const features = [
  { icon: 'pi-truck', labelKey: 'product.featureShipping' },
  { icon: 'pi-credit-card', labelKey: 'product.featureSecure' },
  { icon: 'pi-shield', labelKey: 'product.featureSustainable' },
];
</script>

<template>
  <main>
    <!-- ======= PRODUCT DETAIL SKELETON (while loading from API) ======= -->
    <section v-if="loading" class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SkeletonBlock class="mb-6 h-4 w-56" />
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <SkeletonBlock class="aspect-[4/5] w-full rounded-3xl" />
        <div class="flex flex-col justify-center space-y-4">
          <SkeletonBlock class="h-5 w-32" />
          <SkeletonBlock class="h-10 w-3/4" />
          <SkeletonBlock class="h-4 w-40" />
          <SkeletonBlock class="h-9 w-28" />
          <SkeletonBlock class="h-5 w-full" />
          <SkeletonBlock class="h-5 w-5/6" />
          <SkeletonBlock class="h-5 w-2/3" />
          <SkeletonBlock class="h-4 w-32" />
          <SkeletonBlock class="h-11 w-full" />
          <div class="flex gap-4 pt-2">
            <SkeletonBlock class="h-11 w-32" />
            <SkeletonBlock class="h-11 w-44" />
          </div>
        </div>
      </div>
    </section>

    <!-- ======= PRODUCT NOT FOUND ======= -->
    <div v-else-if="!product" class="mx-auto max-w-7xl px-4 py-24 text-center" data-aos="fade-up">
      <i class="pi pi-tag text-5xl text-ink-300" aria-hidden="true"></i>
      <h1 class="mt-4 text-2xl font-bold text-ink-900">{{ $t('product.notFound') }}</h1>
      <p class="mt-2 text-sm text-ink-500">{{ $t('product.notFoundHint') }}</p>
      <RouterLink
        to="/shop"
        class="mt-6 inline-block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-primary-700 active:scale-90"
      >
        {{ $t('product.browseShop') }}
      </RouterLink>
    </div>

    <!-- ======= PRODUCT DETAIL ======= -->
    <template v-else>
      <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <nav class="mb-6 text-sm text-ink-500" data-aos="fade-up">
          <RouterLink to="/" class="hover:text-primary-600">{{ $t('product.home') }}</RouterLink>
          <span class="mx-2 text-ink-300">/</span>
          <RouterLink :to="`/category/${product.category}`" class="hover:text-primary-600">
            {{ localizedCategory?.title }}
          </RouterLink>
          <span class="mx-2 text-ink-300">/</span>
          <span class="font-medium text-ink-900">{{ localizedName }}</span>
        </nav>

        <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <!-- ======= PRODUCT IMAGE ======= -->
          <div class="relative overflow-hidden rounded-3xl bg-white shadow-sm" data-aos="fade-up">
            <img :src="product.image" :alt="localizedName" class="aspect-[4/5] w-full object-cover" />
          </div>

          <!-- ======= PRODUCT INFO ======= -->
          <div class="flex flex-col" data-aos="fade-up">
            <p
              class="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary-500"
            >
              <i class="pi pi-tag" aria-hidden="true"></i>
              {{ localizedCategory?.eyebrow }}
            </p>
            <h1 class="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">{{ localizedName }}</h1>

            <div class="mt-3 flex items-center gap-2 text-sm text-ink-500">
              <span class="flex items-center gap-0.5 text-amber-400">
                <i v-for="n in 5" :key="n" class="pi pi-star text-xs" aria-hidden="true"></i>
              </span>
              <span>{{ $t('product.reviews', { rating: '4.9', count: 120 }) }}</span>
            </div>

            <p class="mt-5 text-3xl font-bold text-primary-600">${{ product.price.toFixed(2) }}</p>

            <p class="mt-4 leading-relaxed text-ink-500">{{ description }}</p>

            <!-- ======= SIZE SELECTOR =======
                 Per-size stock comes from src/api/stock.js (fake now)
                 -> real: GET /api/products/{id}/stock (see apis.md).
                 Out-of-stock sizes are disabled/struck-through; selecting a size
                 is required before add-to-cart and the size is saved on the line. -->
            <div class="mt-6">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-sm font-semibold text-ink-700">{{ $t('product.selectSize') }}</p>
                <p v-if="stockLoading" class="text-xs text-ink-400">{{ $t('product.checkingStock') }}</p>
                <p
                  v-else-if="selectedSize && !isSizeOut(selectedSize)"
                  class="flex items-center gap-1 text-xs font-medium text-emerald-600"
                >
                  <i class="pi pi-check-circle" aria-hidden="true"></i>
                  {{ $t('product.inStock') }}
                </p>
              </div>

              <div role="group" :aria-label="t('product.selectSize')" class="mt-3 grid grid-cols-5 gap-2">
                <template v-if="stockLoading">
                  <SkeletonBlock v-for="n in 5" :key="n" class="h-11" />
                </template>
                <template v-else-if="stock?.sizes && stock.sizes.length">
                  <button
                    v-for="s in stock.sizes"
                    :key="s.size"
                    type="button"
                    :disabled="!s.in_stock"
                    :aria-pressed="selectedSize === s.size"
                    :title="s.in_stock ? undefined : t('product.outOfStock')"
                    class="rounded-lg border py-2.5 text-sm font-semibold transition duration-200 active:scale-90 disabled:cursor-not-allowed"
                    :class="sizeButtonClass(s)"
                    @click="selectedSize = s.size"
                  >
                    {{ s.size }}
                  </button>
                </template>
                <p v-else class="col-span-5 text-sm text-ink-400">{{ $t('product.stockUnavailable') }}</p>
              </div>

              <p v-if="!stockLoading && !selectedSize && stock?.sizes?.length" class="mt-1.5 text-xs text-ink-400">
                {{ $t('product.sizeHint') }}
              </p>
            </div>

            <!-- ======= QTY + ADD TO CART ======= -->
            <div class="mt-6 flex items-center gap-4">
              <div class="flex items-center gap-1 rounded-lg border border-ink-200 bg-white p-1">
                <button
                  type="button"
                  :aria-label="t('product.decreaseQty')"
                  class="rounded-md p-2 text-ink-600 transition duration-200 hover:bg-ink-100 active:scale-90 disabled:opacity-40"
                  :disabled="qty <= 1"
                  @click="changeQty(-1)"
                >
                  <i class="pi pi-minus text-xs" aria-hidden="true"></i>
                </button>
                <span class="w-8 text-center text-sm font-semibold text-ink-900">{{ qty }}</span>
                <button
                  type="button"
                  :aria-label="t('product.increaseQty')"
                  class="rounded-md p-2 text-ink-600 transition duration-200 hover:bg-ink-100 active:scale-90 disabled:opacity-40"
                  :disabled="qty >= 10"
                  @click="changeQty(1)"
                >
                  <i class="pi pi-plus text-xs" aria-hidden="true"></i>
                </button>
              </div>

              <button
                type="button"
                class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
                @click="addToCart"
              >
                <i class="pi pi-cart-plus" aria-hidden="true"></i>
                {{ $t('product.addToCart') }}
              </button>
            </div>

            <!-- ======= TRUST FEATURES ======= -->
            <ul class="mt-8 space-y-3 border-t border-ink-100 pt-6">
              <li
                v-for="feature in features"
                :key="feature.labelKey"
                class="flex items-center gap-3 text-sm text-ink-500"
              >
                <i class="pi text-primary-500" :class="feature.icon" aria-hidden="true"></i>
                {{ $t(feature.labelKey) }}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- ======= RELATED PRODUCTS =======
           Same category, up to 4 items. Cards navigate to /product/:id. -->
      <section v-if="related.length" class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-center justify-between" data-aos="fade-up">
          <h2 class="text-xl font-bold text-ink-900">{{ $t('product.related') }}</h2>
          <RouterLink
            :to="`/category/${product.category}`"
            class="text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            {{ $t('product.viewAll') }}
          </RouterLink>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
          <ProductCard v-for="item in related" :key="item.id" :product="item" />
        </div>
      </section>
    </template>
  </main>
</template>
