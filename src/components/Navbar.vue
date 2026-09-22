<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import { getHomeData } from '../api/home';

const isOpen = ref(false);
const isCartOpen = ref(false);
const route = useRoute();
const cart = useCartStore();
const toast = useToastStore();

// ======= MOBILE MENU LINKS =======
// Static links for the hamburger menu on small screens. Category links are NOT
// listed here — they are added dynamically below (fetched from the backend).
const mobileLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/testcard', label: 'Test Card' },
];

// ======= DYNAMIC CATEGORY LINKS (hamburger menu) =======
// Categories come from the backend (GET /api/home -> data.categories, see
// src/api/home.js + apis.md). Fake data is served for now; swap src/api/home.js
// for the real client when the Laravel API is up — no changes needed here.
const categories = ref([]);
const isCategoriesLoading = ref(true);

onMounted(async () => {
  try {
    const { data } = await getHomeData();
    categories.value = data.categories;
  } catch {
    categories.value = []; // menu still works if the call fails
  } finally {
    isCategoriesLoading.value = false;
  }
});

// Close the mobile menu + cart panel on every route change.
watch(
  () => route.path,
  () => {
    isOpen.value = false;
    isCartOpen.value = false;
  },
);

// Lock background scroll while the full-screen mobile cart is open (< md).
watch(isCartOpen, (open) => {
  document.body.style.overflow = open && window.innerWidth < 768 ? 'hidden' : '';
});

const setQty = (id, delta) => {
  const item = cart.items.find((i) => i.id === id);
  if (item) cart.setQty(id, item.qty + delta);
};

const checkout = () => {
  isCartOpen.value = false;
  toast.info('Checkout is coming soon');
};
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-ink-100 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex-1 md:flex md:items-center md:gap-12">
          <RouterLink to="/" class="flex items-center gap-2 text-primary-600">
            <span class="sr-only">Home</span>
            <svg
              class="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 3 4 8l1 2 1-1v11h12V9l1 1 1-2-8-5Zm0 1.8 5.6 3.5-1.6 1.1c-1-.6-2.2-1-3.9-1s-3 .4-4 1.1L6.4 8.3 12 4.8ZM7.5 11.3c.8-.8 2.4-1.3 4.5-1.3s3.8.5 4.5 1.3V20h-9v-8.7ZM9 14h6v1.5H9V14Zm0 3h6v1.5H9V17Z"
                fill="currentColor"
              />
            </svg>
            <span class="text-lg font-bold text-ink-900">Clothes Shop</span>
          </RouterLink>
        </div>

        <div class="md:flex md:items-center md:gap-12">
          <nav aria-label="Global" class="hidden md:block">
            <!-- ======= DESKTOP NAV LINKS =======
                 Edit the links/routes and their labels here. -->
            <ul class="flex items-center gap-6 text-sm">
              <li>
                <RouterLink
                  to="/"
                  class="text-ink-500 transition hover:text-ink-700"
                  active-class="text-primary-600 font-semibold"
                  exact-active-class="text-primary-600 font-semibold"
                >
                  Home
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/shop"
                  class="text-ink-500 transition hover:text-ink-700"
                  active-class="text-primary-600 font-semibold"
                >
                  Shop
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/about"
                  class="text-ink-500 transition hover:text-ink-700"
                  active-class="text-primary-600 font-semibold"
                >
                  About
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/testcard"
                  class="text-ink-500 transition hover:text-ink-700"
                  active-class="text-primary-600 font-semibold"
                >
                  Test Card
                </RouterLink>
              </li>
            </ul>
          </nav>

          <div class="relative flex items-center gap-3">
            <!-- ======= CTA BUTTONS (Login / Register) =======
                 Routes /login and /register exist now (src/views/). -->
            <div class="hidden sm:flex sm:gap-2 md:flex">
              <RouterLink
                to="/login"
                class="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
              >
                <i class="pi pi-sign-in" aria-hidden="true"></i>
                Login
              </RouterLink>

              <RouterLink
                to="/register"
                class="hidden inline-flex items-center gap-2 rounded-md bg-ink-100 px-4 py-2.5 text-sm font-medium text-primary-600 transition duration-200 hover:bg-ink-200 active:scale-90 sm:inline-flex"
              >
                <i class="pi pi-user-plus" aria-hidden="true"></i>
                Register
              </RouterLink>
            </div>

            <!-- ======= CART BUTTON + BADGE =======
                 Count comes from the cart store (marked up under badge). -->
            <button
              type="button"
              aria-label="Open your cart"
              class="relative rounded-md bg-ink-100 px-3 py-2.5 text-ink-600 transition duration-200 hover:text-ink-700 active:scale-90"
              @click="isCartOpen = !isCartOpen"
            >
              <i class="pi pi-shopping-cart text-sm" aria-hidden="true"></i>
              <span
                v-if="cart.count"
                class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white"
              >
                {{ cart.count }}
              </span>
            </button>

            <button
              type="button"
              aria-label="Toggle menu"
              :aria-expanded="isOpen"
              class="rounded-sm bg-ink-100 p-2.5 text-ink-600 transition duration-200 hover:text-ink-700 active:scale-90 md:hidden"
              @click="isOpen = !isOpen"
            >
              <i class="pi text-sm" :class="isOpen ? 'pi-times' : 'pi-bars'" aria-hidden="true"></i>
            </button>

            <!-- ======= CART SHEET / DROPDOWN =======
                 Small screens (< md): full-width + full-height sheet that slides
                 from under the navbar (fixed inset-x-0 top-16 bottom-0).
                 md and up: compact dropdown anchored to the cart button.
                 Uses a Vue transition (re-keyed block — never data-aos here). -->
            <transition name="cart-panel">
              <div
                v-if="isCartOpen"
                class="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col overflow-hidden bg-white shadow-xl md:absolute md:inset-auto md:right-0 md:top-[4.2rem] md:z-50 md:w-80 md:max-w-[calc(100vw-2rem)] md:rounded-2xl md:border md:border-ink-100"
              >
                <div class="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                  <p class="text-sm font-semibold text-ink-900">
                    Your Cart
                    <span v-if="cart.count" class="ml-1 text-ink-400">({{ cart.count }})</span>
                  </p>
                  <button
                    type="button"
                    aria-label="Close cart"
                    class="rounded-md p-1 text-ink-400 transition duration-200 hover:text-ink-700 active:scale-90"
                    @click="isCartOpen = false"
                  >
                    <i class="pi pi-times text-sm" aria-hidden="true"></i>
                  </button>
                </div>

                <ul v-if="cart.items.length" class="flex-1 min-h-0 overflow-y-auto divide-y divide-ink-100 md:max-h-72">
                  <li v-for="item in cart.items" :key="item.id" class="flex gap-3 p-3">
                    <img :src="item.image" :alt="item.name" class="h-16 w-12 shrink-0 rounded-lg object-cover" />
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-2">
                        <p class="truncate text-sm font-medium text-ink-900">{{ item.name }}</p>
                        <button
                          type="button"
                          aria-label="Remove item"
                          class="rounded-md p-0.5 text-ink-400 transition duration-200 hover:text-rose-500 active:scale-90"
                          @click="cart.remove(item.id)"
                        >
                          <i class="pi pi-times text-xs" aria-hidden="true"></i>
                        </button>
                      </div>
                      <p class="mt-0.5 text-xs font-semibold text-primary-600">
                        ${{ (item.price * item.qty).toFixed(2) }}
                      </p>
                      <div class="mt-1.5 flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          class="rounded-md bg-ink-100 p-1 text-ink-600 transition duration-200 hover:bg-ink-200 active:scale-90"
                          @click="setQty(item.id, -1)"
                        >
                          <i class="pi pi-minus text-xs" aria-hidden="true"></i>
                        </button>
                        <span class="w-4 text-center text-sm font-medium text-ink-900">{{ item.qty }}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          class="rounded-md bg-ink-100 p-1 text-ink-600 transition duration-200 hover:bg-ink-200 active:scale-90"
                          @click="setQty(item.id, 1)"
                        >
                          <i class="pi pi-plus text-xs" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </li>
                </ul>

                <div v-else class="px-4 py-10 text-center">
                  <i class="pi pi-shopping-cart text-3xl text-ink-300" aria-hidden="true"></i>
                  <p class="mt-3 text-sm text-ink-500">Your cart is empty</p>
                  <RouterLink
                    to="/shop"
                    class="mt-3 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700"
                    @click="isCartOpen = false"
                  >
                    Start shopping
                  </RouterLink>
                </div>

                <div v-if="cart.items.length" class="border-t border-ink-100 px-4 py-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-ink-500">Total</span>
                    <span class="text-base font-bold text-ink-900">${{ cart.total.toFixed(2) }}</span>
                  </div>
                  <button
                    type="button"
                    class="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
                    @click="checkout"
                  >
                    <i class="pi pi-check" aria-hidden="true"></i>
                    Checkout
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- ======= MOBILE MENU DROPDOWN (full-width) =======
         Shown below the header only on small screens (< md).
         Edit the list of links in the `mobileLinks` array inside <script setup>. -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div v-if="isOpen" class="lg:hidden">
        <div class="space-y-1 border-t border-ink-100 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <RouterLink
            v-for="link in mobileLinks"
            :key="link.to"
            :to="link.to"
            class="block rounded-md px-3 py-2.5 text-sm font-medium text-ink-500 transition hover:bg-primary-50 hover:text-primary-600"
            active-class="bg-primary-50 text-primary-600 font-semibold"
            exact-active-class="bg-primary-50 text-primary-600 font-semibold"
            @click="isOpen = false"
          >
            {{ link.label }}
          </RouterLink>

          <!-- ======= DYNAMIC CATEGORY LINKS =======
               Rendered from `categories` ref populated on mount via
               src/api/home.js (fake backend data today). Remove the divider +
               heading if the menu feels busy, or keep them to separate pages
               from shop categories. -->
          <div class="mt-2 border-t border-ink-100 pt-3">
            <p class="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Categories</p>
            <p v-if="isCategoriesLoading" class="px-3 py-2.5 text-sm text-ink-400">Loading categories…</p>
            <RouterLink
              v-for="cat in categories"
              :key="cat.slug"
              :to="cat.url"
              class="block rounded-md px-3 py-2.5 text-sm font-medium text-ink-500 transition hover:bg-primary-50 hover:text-primary-600"
              active-class="bg-primary-50 text-primary-600 font-semibold"
              exact-active-class="bg-primary-50 text-primary-600 font-semibold"
              @click="isOpen = false"
            >
              <span class="flex items-center justify-between">
                <span>{{ cat.title }}</span>
                <span class="text-xs text-ink-400">{{ cat.eyebrow }}</span>
              </span>
            </RouterLink>
          </div>

          <div class="mt-3 flex gap-3 border-t border-ink-100 pt-4">
            <RouterLink
              to="/login"
              class="flex-1 rounded-md bg-primary-600 px-4 py-2.5 text-center text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
              @click="isOpen = false"
            >
              Login
            </RouterLink>
            <RouterLink
              to="/register"
              class="flex-1 rounded-md bg-ink-100 px-4 py-2.5 text-center text-sm font-medium text-primary-600 transition duration-200 hover:bg-ink-200 active:scale-90"
              @click="isOpen = false"
            >
              Register
            </RouterLink>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.cart-panel-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.cart-panel-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.cart-panel-enter-from,
.cart-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
