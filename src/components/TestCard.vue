<template>
  <div class="min-h-screen bg-snow-100 p-8 font-sans">
    <div class="mx-auto max-w-sm space-y-4">
      <div class="rounded-xl bg-white p-6 shadow-md">
        <p class="text-sm font-semibold uppercase tracking-wide text-primary-500">New Arrivals</p>
        <h1 class="mt-2 text-2xl font-bold text-ink-900">The Clothes Shop</h1>
        <p class="mt-2 text-sm text-ink-500">A light black, a pretty purple, and a clean white.</p>
        <button
          class="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white transition hover:bg-primary-700"
        >
          Shop Now
        </button>
      </div>

      <div class="flex items-center justify-between rounded-lg bg-ink-900 px-6 py-4 text-snow-100">
        <span class="text-sm">Free shipping on orders</span>
        <span class="text-primary-400">&#9733;</span>
      </div>

      <div class="flex justify-center gap-3">
        <span class="h-6 w-6 rounded-full bg-white ring-1 ring-ink-200"></span>
        <span class="h-6 w-6 rounded-full bg-ink-900"></span>
        <span class="h-6 w-6 rounded-full bg-primary-500"></span>
      </div>
    </div>
  </div>
</template>