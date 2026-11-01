# Project Conventions

Vue 3 + Vite + Tailwind CSS v3 clothes shop frontend.

## Rules for this project

- **Never run `npm run build`** for this project. Use `npm run dev`, `node --check`, or `npx tailwindcss -i src/assets/main.css -o /tmp/out.css` to verify.
- **Single-File Component (`.vue`) block order** — always put the blocks in this order across the whole project:
  1. `<script setup>` (first, only if the component has logic)
  2. `<template>`
  3. `<style scoped>` (last, only if needed)
- **Add developer comments** inside every `<template>` block of new/existing components and views so the developer can easily edit things later (e.g. what to edit, which routes exist, where slider data lives). Mark each with `=======` so they are easy to spot.
- **Use the AOS library as much as possible** for scroll/entrance animations (`data-aos` attributes). BUT be aware of responsive/re-mount pitfalls:
  - Never put `data-aos` on Vue-`<transition>`/keyed blocks (carousel slides, filter grids) — those re-mount, AOS would leave them stuck at `opacity:0`. Use Vue `<transition>` for those.
  - `AOS.init` in `src/App.vue` disables AOS below `md` (768px) so mobile never shows hidden content — keep that.
  - Keep `once: true` and only animate persistent, static sections.
- **Do NOT write custom CSS in `src/assets/main.css` or any global CSS file** — it stays as only the three `@tailwind` directives. Use Tailwind utility classes. Per-component animation/transition styles may go in a `<style scoped>` block. AOS CSS comes from the package import.
- **Theme colors** are defined in `tailwind.config.js` and used everywhere via utilities:
  - `primary` (purple scale, main accent)
  - `ink` (light black/charcoal scale)
  - `snow` (white family)
  Keep using these names instead of Tailwind defaults when the shop palette applies.
- **Buttons (all new buttons too)**: every `<button>` and button-styled link (anything with a `bg-*` fill + padding) must include the press-feedback classes `transition duration-200 hover:<state> active:scale-90` (200ms transitions, 0.9 scale on press). Apply this to any new button created going forward.
- **Router + Pinia** are wired in `src/main.js`. New pages go in `src/views/`, new store logic in `src/stores/`, new shared components in `src/components/`, routes in `src/router/index.js`.
- **Reusable components**: any UI marked up the same way in **2+ places** (product cards, filter controls, input fields, dropdowns) must be extracted into its own file in `src/components/` and imported where needed — never copy-paste the markup. Example already done: `ProductCard.vue` is used by Shop/Category/Product views and the BestSellers home section.
- **Loading states (data that will load from the API later)**: never show raw "Loading…" text. Use the shimmer skeleton system:
  - Shared skeleton components live in `src/components/skeletons/` — `SkeletonBlock.vue` (the shimmer primitive: size/shape via `class` passthrough, `circle` prop for avatars), `SectionHeaderSkeleton.vue`, `ProductCardSkeleton.vue`, `CategoryTileSkeleton.vue`. Always reuse these and build new ones to **mirror the exact layout** of the real content so the grid never jumps.
  - Shimmer animation comes from `animate-shimmer` (registered in `tailwind.config.js` keyframes) — do not hand-roll a new pulse/label.
  - Async state lives in the Pinia stores (`src/stores/catalog.js` → `loading` / `error` / `retry()`). Show the skeleton via `v-if="loading"`, the error block via `v-else-if="error"`, and content with `v-else`, wrapped in a scoped Vue `<transition>` (never `data-aos` on skeleton/transient blocks — same rule as carousel slides).
  - Skeleton containers must carry `role="status"` + `aria-live="polite"`; the sr-only label comes from the i18n `loading.placeholder` key (already in `en`/`ar`). Add new UI strings to BOTH locale files (`src/i18n/locales/en.js` + `ar.js`) — never hardcode visible text.
  - Route-level loading: the slim top progress bar (`NProgress`, wired in `src/router/index.js`) covers lazy route loads; reserve skeletons for in-page async data.
- **Backend auth (Laravel + Sanctum)**: token strategy is not localStorage-first — prefer Sanctum SPA cookie auth (`withCredentials` + `X-XSRF-TOKEN` header). The auth token stays in Laravel's httpOnly cookie; Pinia stores only the reactive `user` object (`src/stores/auth.js`). Bearer tokens are supported as a fallback via `localStorage['auth_token']` but should be avoided for production (XSS-readable).
- Always verify with Tailwind compile + `node --check` after changes.

## Workflow rules (API is live)

- **API-first — no mock data files.** Every piece of remote content comes from `src/api/*.js` → `src/stores/*.js`. Never re-introduce fake endpoints (`api/home.js`, `api/stock.js`) or a local catalog that pretends to be the backend. The only local content allowed is **editorial site content** clearly kept in `src/data/site.js` (hero slides, promo banner, testimonials, category eyebrows, image fallback) because the API has no endpoint for it yet.
- **Real API contract** (`VITE_API_URL`, default `http://api.clothes.test/api/v1`):
  - Envelope: every response is `{ data: ... }` — the axios response interceptor already unwraps the HTTP response, so callers read `res.data`.
  - Locale: `?lang=en|ar` (NOT `?locale=`). The backend returns already-localized strings: `title` is the display name, `name` is always English.
  - Resource routes are bound by **slug** (`/products/{slug}`, `/categories/{slug}`), not numeric ids.
  - Money arrives as a string (`"24.99"`) — always `Number(...)` before arithmetic/formatting.
  - Stock lives in `product.variants[]` (`size`, `color`, `colorHex`, `sku`, `quantity`, `price` override).
- **The Laravel backend is read-only** (`/home/ahmed/Clothes-project/clothes-backend`). Read routes/controllers/resources to learn the contract; never edit anything there.
- **Never remove a must-do feature because the API lags behind.** If an endpoint is missing (auth, orders), keep the UI and the store, call the documented path, and degrade gracefully with a translated message. Add a `TODO(api)` comment naming the endpoint that will make it real.
- **No credentials on public calls.** The MVP API answers with `Access-Control-Allow-Origin: *`, so `withCredentials: true` makes every request fail CORS. Credentials stay env-driven (`VITE_API_CREDENTIALS`) and OFF until Sanctum cookie auth ships.
- **Every async surface has 3 states**: skeleton while `loading` (mirroring the real layout), content when loaded, and a translated error block with a **retry** action when it fails (reuse `ErrorState.vue`). Never leave a blank screen on a slow or failed connection.
- **Degraded mode, never fake data.** Distinguish the failure: a missing resource (`code === 'NOT_FOUND'` / HTTP 404) gets the 404 block; network/timeout/5xx (`OFFLINE` / `SERVER`) gets the amber `ErrorState` (`offline` prop) with manual + auto retry — never the 404 page and never mock data. `stores/catalog.js` mirrors the last-good catalog to `sessionStorage` and rehydrates it on boot; when a refresh fails, `ConnectivityBanner.vue` labels it as saved data and retries every 15 s (and immediately on the browser `online` event). Error codes are produced in `src/api/client.js` (`OFFLINE` / `NOT_FOUND` / `VALIDATION` / `SERVER` / `HTTP`).
- **`Report.md` is living documentation — update it every time you change something** (feature, API wiring, file added/removed, known gap). It is gitignored on purpose: local notes only.
- **No orphan files.** Every file must be imported somewhere (or be a route target / config). When a mock, demo page, or one-off helper is replaced, delete it in the same change.
- **Product/category links use slugs** (`/product/:slug`, `/category/:slug`) to match the API and keep URLs shareable.