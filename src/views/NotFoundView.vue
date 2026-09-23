<template>
  <!-- ======= 404 PAGE =======
       Shown for any unknown route (catch-all in src/router/index.js).
       Headline / message / button come from i18n (notFound.* keys). -->
  <main class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
    <div class="mx-auto max-w-md text-center" data-aos="fade-up">
      <p class="text-7xl font-bold text-primary-500" data-aos-delay="100">404</p>
      <h1 class="mt-4 text-2xl font-semibold text-ink-900">{{ $t('notFound.title') }}</h1>
      <p class="mt-2 text-sm text-ink-500">
        {{ $t('notFound.hint') }}
      </p>
      <RouterLink
        to="/"
        class="mt-8 inline-block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:bg-primary-700 active:scale-90"
      >
        {{ $t('notFound.backToHome') }}
      </RouterLink>
    </div>
  </main>
</template>