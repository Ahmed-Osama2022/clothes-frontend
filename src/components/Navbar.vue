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

          <div class="flex items-center gap-4">
            <div class="sm:flex sm:gap-4">
              <RouterLink
                to="/login"
                class="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary-700"
              >
                Login
              </RouterLink>

              <div class="hidden sm:flex">
                <RouterLink
                  to="/register"
                  class="rounded-md bg-ink-100 px-5 py-2.5 text-sm font-medium text-primary-600 transition hover:bg-ink-200"
                >
                  Register
                </RouterLink>
              </div>
            </div>

            <div class="block md:hidden">
              <button
                type="button"
                class="rounded-sm bg-ink-100 p-2 text-ink-600 transition hover:text-ink-700"
              >
                <span class="sr-only">Toggle menu</span>

                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>