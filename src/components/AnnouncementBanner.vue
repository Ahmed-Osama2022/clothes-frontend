<template>
  <!-- ======= ANNOUNCEMENT / PROMO BANNER =======
       Edit the promo text and the link below. Shown only on the home page (HomeView).
       Text uses i18n: announcement.freeShipping / announcement.shopNow
       (src/i18n/locales/*.js) — edit translations there. -->
  <div
    class="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 text-white"
    data-aos="fade-down"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2.5 text-center sm:px-6 lg:px-8">
      <p class="text-sm font-medium">
        {{ $t('announcement.freeShipping') }}
      </p>
      <router-link
        to="/shop"
        class="text-sm font-semibold underline underline-offset-2 transition hover:text-primary-100"
      >
        {{ $t('announcement.shopNow') }}
      </router-link>
    </div>
  </div>
</template>