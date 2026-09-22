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
- **Router + Pinia** are wired in `src/main.js`. New pages go in `src/views/`, new store logic in `src/stores/`, new shared components in `src/components/`, routes in `src/router/index.js`.
- **Backend auth (Laravel + Sanctum)**: token strategy is not localStorage-first — prefer Sanctum SPA cookie auth (`withCredentials: true` + `X-XSRF-TOKEN` header, both already set in `src/api/client.js`). The auth token stays in Laravel's httpOnly cookie; Pinia stores only the reactive `user` object (`src/stores/auth.js`). Bearer tokens are supported as a fallback via `localStorage['auth_token']` but should be avoided for production (XSS-readable). API base URL comes from `.env` (`VITE_API_URL`, falls back to `BASE_URL`/http://localhost:3200).
- Always verify with Tailwind compile + `node --check` after changes.