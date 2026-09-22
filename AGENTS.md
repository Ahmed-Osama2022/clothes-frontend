# Project Conventions

Vue 3 + Vite + Tailwind CSS v3 clothes shop frontend.

## Rules for this project

- **Never run `npm run build`** for this project. Use `npm run dev`, `node --check`, or `npx tailwindcss -i src/assets/main.css -o /tmp/out.css` to verify.
- **Add developer comments** inside every `<template>` block of new/existing components and views so the developer can easily edit things later (e.g. what to edit, which routes exist, where slider data lives). Mark each with `=======` so they are easy to spot.
- **Do NOT write custom CSS in `src/assets/main.css` or any global CSS file** — it stays as only the three `@tailwind` directives. Use Tailwind utility classes. Per-component animation/transition styles may go in a `<style scoped>` block. AOS CSS comes from the package import.
- **Theme colors** are defined in `tailwind.config.js` and used everywhere via utilities:
  - `primary` (purple scale, main accent)
  - `ink` (light black/charcoal scale)
  - `snow` (white family)
  Keep using these names instead of Tailwind defaults when the shop palette applies.
- **Router + Pinia** are wired in `src/main.js`. New pages go in `src/views/`, new store logic in `src/stores/`, new shared components in `src/components/`, routes in `src/router/index.js`.
- Always verify with Tailwind compile + `node --check` after changes.