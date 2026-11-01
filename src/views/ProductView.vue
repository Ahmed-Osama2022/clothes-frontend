<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useCatalogStore } from '../stores/catalog';
import { useLocaleStore } from '../stores/locale';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import ProductCard from '../components/ProductCard.vue';
import SkeletonBlock from '../components/skeletons/SkeletonBlock.vue';
import ErrorState from '../components/ErrorState.vue';

// ======= SINGLE PRODUCT PAGE (route: /product/:slug) =======
// The API binds products by SLUG, so the route is /product/:slug.
// Data flow: stores/catalog.js -> GET /products/{slug}?lang=...
//   - the shared catalog list is loaded first (category name + related items)
//   - this page always refetches the detail so variants/stock are fresh
// Stock lives in product.variants[] (size + color), so the customer picks a
// size AND a color, and the quantity is capped by that variant's `quantity`.
const { t } = useI18n();
const route = useRoute();
const catalog = useCatalogStore();
const localeStore = useLocaleStore();
const cart = useCartStore();
const toast = useToastStore();

const product = ref(null);
const loading = ref(true);
const error = ref(null);
const notFound = ref(false);

// ======= FETCH PRODUCT =======
// `fetchProduct(slug)` awaits the shared catalog load, then calls the detail
// endpoint. 404 -> dedicated "not found" block; other failures -> error+retry.
const load = async () => {
  loading.value = true;
  error.value = null;
  notFound.value = false;
  product.value = null;

  try {
    product.value = await catalog.fetchProduct(route.params.slug);
  } catch (e) {
    // 404 = the slug really does not exist -> not-found block.
    // Network/5xx = outage -> "temporarily unavailable" + retry (never 404).
    if (e?.status === 404 || e?.code === 'NOT_FOUND') notFound.value = true;
    else error.value = e;
  } finally {
    loading.value = false;
  }
};

// Outage (not a missing product) drives the amber ErrorState + auto-retry.
const unavailable = computed(() => ['OFFLINE', 'SERVER'].includes(error.value?.code));

// Re-run on route change (related product click) and on language switch,
// because the API returns already-localized title/description/color.
watch(() => route.params.slug, load, { immediate: true });
watch(() => localeStore.locale, load);

// ======= IMAGE GALLERY =======
// The API sends images[] (3 per product). First image is the card thumbnail.
const activeImage = ref(0);
const gallery = computed(() => product.value?.images ?? []);

// ======= SIZE × COLOR VARIANTS =======
// Variants arrive as one row per size+color (XS..XL × White/Black/Beige/Navy).
// `available` is computed in the store from `isActive` + `quantity > 0`.
const variants = computed(() => product.value?.variants ?? []);

const sizes = computed(() => [...new Set(variants.value.map((variant) => variant.size))]);

const colors = computed(() => {
  const seen = new Map();
  variants.value.forEach((variant) => {
    if (!seen.has(variant.color)) seen.set(variant.color, variant.colorHex);
  });
  return [...seen.entries()].map(([color, colorHex]) => ({ color, colorHex }));
});

const selectedSize = ref('');
const selectedColor = ref('');

const findVariant = (size, color) =>
  variants.value.find((variant) => variant.size === size && variant.color === color) ?? null;

const selectedVariant = computed(() => findVariant(selectedSize.value, selectedColor.value));

// A size is selectable when the chosen color has it in stock. With no color
// chosen yet, the size is enabled if ANY color has it in stock.
const isSizeEnabled = (size) => {
  const pool = selectedColor.value ? [findVariant(size, selectedColor.value)] : variants.value;
  return pool.some((variant) => variant && variant.size === size && variant.available);
};

const isColorEnabled = (color) => {
  const pool = selectedSize.value ? [findVariant(selectedSize.value, color)] : variants.value;
  return pool.some((variant) => variant && variant.color === color && variant.available);
};

const hasStock = computed(() => variants.value.some((variant) => variant.available));
const maxQty = computed(() => Math.max(0, selectedVariant.value?.quantity ?? 0));
const price = computed(() => selectedVariant.value?.price ?? product.value?.price ?? 0);
const canAdd = computed(() => Boolean(selectedVariant.value?.available) && maxQty.value > 0);

// Choosing a size auto-switches to an in-stock color for that size (and vice
// versa) so the shopper never ends up on a dead combination.
const selectSize = (size) => {
  selectedSize.value = size;
  if (selectedColor.value && findVariant(size, selectedColor.value)?.available) return;
  const fallback = variants.value.find((variant) => variant.size === size && variant.available);
  if (fallback) selectedColor.value = fallback.color;
};

const selectColor = (color) => {
  selectedColor.value = color;
  if (selectedSize.value && findVariant(selectedSize.value, color)?.available) return;
  const fallback = variants.value.find((variant) => variant.color === color && variant.available);
  if (fallback) selectedSize.value = fallback.size;
};

// Default selection = first in-stock variant; otherwise first variant so the
// page still shows the options (add-to-cart stays disabled).
const resetSelection = () => {
  const list = variants.value;
  const first = list.find((variant) => variant.available) ?? list[0] ?? null;
  selectedSize.value = first?.size ?? '';
  selectedColor.value = first?.color ?? '';
  qty.value = 1;
};

// ======= QUANTITY =======
const qty = ref(1);
const changeQty = (delta) => {
  const ceiling = Math.min(Math.max(maxQty.value, 1), 10);
  qty.value = Math.min(ceiling, Math.max(1, qty.value + delta));
};

// Reset when the product (or locale) swaps or the chosen variant changes,
// keeping the quantity inside the new variant's stock.
watch(product, () => {
  activeImage.value = 0;
  resetSelection();
});
watch(selectedVariant, () => {
  if (qty.value > maxQty.value) qty.value = Math.max(1, Math.min(maxQty.value, 10));
});

// ======= ADD TO CART =======
const addToCart = () => {
  if (!product.value) return;
  if (!selectedSize.value || !selectedColor.value) {
    toast.error(t('product.selectOptionsFirst'));
    return;
  }
  if (!selectedVariant.value) {
    toast.error(t('product.variantUnavailable'));
    return;
  }
  if (!selectedVariant.value.available) {
    toast.error(t('product.variantOutOfStock'));
    return;
  }
  cart.add(product.value, selectedVariant.value, qty.value);
  toast.success(
    t('product.addedToCartWithVariant', {
      name: product.value.name,
      size: selectedVariant.value.size,
      color: selectedVariant.value.color,
    }),
  );
  qty.value = 1;
};

// ======= CATEGORY + RELATED =======
const category = computed(() => (product.value?.category ? catalog.categoryBySlug(product.value.category) : null));
const categoryTitle = computed(() => category.value?.title || product.value?.categoryName || '');
const related = computed(() => (product.value ? catalog.relatedTo(product.value, 4) : []));

// Trust features are UI chrome -> translated via i18n (product.feature*).
const features = [
  { icon: 'pi-truck', labelKey: 'product.featureShipping' },
  { icon: 'pi-credit-card', labelKey: 'product.featureSecure' },
  { icon: 'pi-shield', labelKey: 'product.featureSustainable' },
];
</script>

<template>
  <main>
    <!-- ======= PRODUCT DETAIL SKELETON (slow connection) ======= -->
    <section v-if="loading" class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" role="status" aria-live="polite">
      <span class="sr-only">{{ $t('loading.placeholder') }}</span>
      <SkeletonBlock class="mb-6 h-4 w-56" />
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div class="space-y-3">
          <SkeletonBlock class="aspect-[4/5] w-full rounded-3xl" />
          <div class="flex gap-3">
            <SkeletonBlock v-for="n in 3" :key="n" class="h-20 w-20 rounded-xl" />
          </div>
        </div>
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

    <!-- ======= ERROR + RETRY (API down / slow network) =======
         Amber "temporarily unavailable" state with auto-retry. A missing
         product slug is handled by the 404 block below instead. -->
    <ErrorState
      v-else-if="error"
      :message="error.message"
      :offline="unavailable"
      :auto-retry="unavailable ? 15 : 0"
      @retry="load"
    />

    <!-- ======= PRODUCT NOT FOUND (unknown slug / 404) ======= -->
    <div v-else-if="notFound || !product" class="mx-auto max-w-7xl px-4 py-24 text-center" data-aos="fade-up">
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
        <!-- ======= BREADCRUMB (slugs come from the API) ======= -->
        <nav class="mb-6 text-sm text-ink-500" data-aos="fade-up">
          <RouterLink to="/" class="hover:text-primary-600">{{ $t('product.home') }}</RouterLink>
          <span class="mx-2 text-ink-300">/</span>
          <RouterLink v-if="product.category" :to="`/category/${product.category}`" class="hover:text-primary-600">
            {{ categoryTitle }}
          </RouterLink>
          <span v-else class="text-ink-400">{{ categoryTitle }}</span>
          <span class="mx-2 text-ink-300">/</span>
          <span class="font-medium text-ink-900">{{ product.name }}</span>
        </nav>

        <div class="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <!-- ======= IMAGE GALLERY =======
               Images: product.images[] from GET /products/{slug}.
               Click a thumbnail to swap the main image. -->
          <div class="space-y-3" data-aos="fade-up">
            <div class="overflow-hidden rounded-3xl bg-white shadow-sm">
              <img
                :src="gallery[activeImage] || product.image"
                :alt="product.name"
                class="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div v-if="gallery.length > 1" class="flex flex-wrap gap-3">
              <button
                v-for="(image, index) in gallery"
                :key="image"
                type="button"
                class="overflow-hidden rounded-xl ring-2 transition duration-200 hover:ring-primary-300 active:scale-90"
                :class="index === activeImage ? 'ring-primary-600' : 'ring-ink-100'"
                :aria-label="$t('product.viewImage', { n: index + 1 })"
                :aria-pressed="index === activeImage"
                @click="activeImage = index"
              >
                <img :src="image" :alt="`${product.name} ${index + 1}`" class="h-20 w-20 object-cover" />
              </button>
            </div>
          </div>

          <!-- ======= PRODUCT INFO ======= -->
          <div class="flex flex-col" data-aos="fade-up">
            <p class="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary-500">
              <i class="pi pi-tag" aria-hidden="true"></i>
              {{ categoryTitle }}
            </p>
            <h1 class="mt-2 text-3xl font-bold text-ink-900 sm:text-4xl">{{ product.name }}</h1>

            <p class="mt-5 text-3xl font-bold text-primary-600">
              {{ $t('product.price', { price: Number(price).toFixed(2) }) }}
            </p>

            <p class="mt-4 leading-relaxed text-ink-500">
              {{ product.description || $t('product.noDescription') }}
            </p>

            <!-- ======= SIZE SELECTOR =======
                 Sizes come from product.variants[].size. Unavailable combos are
                 disabled/struck-through. -->
            <div class="mt-6">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-sm font-semibold text-ink-700">{{ $t('product.selectSize') }}</p>
                <p v-if="selectedVariant && selectedVariant.available" class="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <i class="pi pi-check-circle" aria-hidden="true"></i>
                  {{ $t('product.inStock') }}
                </p>
                <p v-else-if="selectedVariant" class="text-xs font-medium text-rose-500">
                  {{ $t('product.outOfStock') }}
                </p>
              </div>

              <div role="group" :aria-label="t('product.selectSize')" class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="size in sizes"
                  :key="size"
                  type="button"
                  :disabled="!isSizeEnabled(size)"
                  :aria-pressed="selectedSize === size"
                  :title="isSizeEnabled(size) ? undefined : t('product.outOfStock')"
                  class="min-w-12 rounded-lg border px-4 py-2.5 text-sm font-semibold transition duration-200 active:scale-90 disabled:cursor-not-allowed"
                  :class="
                    !isSizeEnabled(size)
                      ? 'border-ink-100 bg-ink-50 text-ink-300 line-through decoration-ink-300'
                      : selectedSize === size
                        ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-primary-400 hover:text-primary-600'
                  "
                  @click="selectSize(size)"
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- ======= COLOR SELECTOR =======
                 Colors come from product.variants[].color + colorHex swatch. -->
            <div class="mt-6">
              <p class="text-sm font-semibold text-ink-700">
                {{ $t('product.selectColor') }}
                <span v-if="selectedColor" class="font-normal text-ink-400">· {{ selectedColor }}</span>
              </p>

              <div role="group" :aria-label="t('product.selectColor')" class="mt-3 flex flex-wrap gap-2.5">
                <button
                  v-for="color in colors"
                  :key="color.color"
                  type="button"
                  :disabled="!isColorEnabled(color.color)"
                  :aria-pressed="selectedColor === color.color"
                  :aria-label="color.color"
                  :title="isColorEnabled(color.color) ? color.color : t('product.outOfStock')"
                  class="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-offset-2 transition duration-200 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
                  :class="selectedColor === color.color ? 'ring-primary-600' : 'ring-ink-200 hover:ring-primary-300'"
                  @click="selectColor(color.color)"
                >
                  <span class="h-7 w-7 rounded-full ring-1 ring-ink-900/10" :style="{ backgroundColor: color.colorHex }"></span>
                </button>
              </div>

              <p v-if="!hasStock" class="mt-2 flex items-center gap-1 text-xs font-medium text-rose-500">
                <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
                {{ $t('product.stockUnavailable') }}
              </p>
            </div>

            <!-- ======= QTY + ADD TO CART =======
                 Quantity is capped by the selected variant's `quantity`
                 (max 10 per add for a sensible cart). -->
            <div class="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
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
                  :disabled="qty >= Math.min(Math.max(maxQty, 1), 10)"
                  @click="changeQty(1)"
                >
                  <i class="pi pi-plus text-xs" aria-hidden="true"></i>
                </button>
              </div>

              <button
                type="button"
                :disabled="!canAdd"
                class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90 disabled:cursor-not-allowed disabled:bg-ink-300"
                @click="addToCart"
              >
                <i class="pi pi-cart-plus" aria-hidden="true"></i>
                {{ $t('product.addToCart') }}
              </button>
            </div>

            <p v-if="canAdd && maxQty <= 5" class="mt-2 text-xs font-medium text-amber-600">
              {{ $t('product.lowStock', { count: maxQty }) }}
            </p>

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
           Same category, up to 4 items from the shared catalog store.
           Cards navigate to /product/:slug. -->
      <section v-if="related.length" class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-center justify-between" data-aos="fade-up">
          <h2 class="text-xl font-bold text-ink-900">{{ $t('product.related') }}</h2>
          <RouterLink
            v-if="product.category"
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
