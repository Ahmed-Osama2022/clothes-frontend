<template>
  <!-- ======= 404 PAGE =======
       Shown for any unknown route (catch-all in src/router/index.js).
       Edit the headline / message / button below. -->
  <main class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
    <div class="mx-auto max-w-md text-center">
      <p class="text-7xl font-bold text-primary-500">404</p>
      <h1 class="mt-4 text-2xl font-semibold text-ink-900">Page not found</h1>
      <p class="mt-2 text-sm text-ink-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <RouterLink
        to="/"
        class="mt-8 inline-block rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700"
      >
        Back to Home
      </RouterLink>
    </div>
  </main>
</template>