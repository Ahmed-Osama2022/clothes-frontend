# apis.md — Backend data contract (this level of development)

> **Frontend ↔ backend contract for the current dev level.** The frontend reads local
> placeholder data today (`src/data/catalog.js`, `src/data/home.js`). Everything below
> documents the **Laravel + Sanctum** endpoints that replace those local sources. The
> axios client (`src/api/client.js`) is already prepared (cookie auth via
> `withCredentials`, `X-XSRF-TOKEN`), so wiring the API is a data-shape swap, not an
> architecture change.

---

## 1. Aggregated home feed — `GET /api/home`

Frontend `HomeView` renders this **one** call (HomeSection data flows into the
`HeroSection`, `FeaturedCategories`, `BestSellers`, `PromoBanner`, `Testimonials`
sections — see the "connect the dots" map at the end).

```json
{
  "data": {
    "hero": [
      { "name": "Signature Collection", "eyebrow": "New Season 2026", "title": "New Season. New You.", "accent": "Elevate.", "subtitle": "Refresh your everyday wardrobe with premium essentials.", "image": "https://…/w=1600", "category": "signature-collection" },
      { "name": "Mid-Season Sale", "eyebrow": "Up to 50% Off", "title": "The Sale You've Been Waiting For.", "accent": "Save big.", "subtitle": "Clearance on last season's favorites.", "image": "https://…/w=1600", "category": "mid-season-sale" },
      { "name": "Best Sellers", "eyebrow": "Customer Favorites", "title": "Worn Again & Again.", "accent": "Essentials.", "subtitle": "The pieces our customers reach for most.", "image": "https://…/w=1600", "category": "best-sellers" }
    ],
    "categories": [
      { "slug": "signature-collection", "title": "Signature Collection", "eyebrow": "New Season", "image": "https://…/w=1600", "count": 6, "url": "/category/signature-collection" }
    ],
    "best_sellers": [
      {
        "id": 13, "name": "Hanging Everyday Set", "price": 74.99,
        "category": "best-sellers", "image": "https://…/w=800",
        "badge": "Best Seller", "url": "/product/13"
      }
    ],
    "promo": {
      "title": "Mid-Season Sale", "discount": "UP TO 50% OFF",
      "subtitle": "Clearance on last season's favorites — while stock lasts.",
      "image": "https://…/w=1600", "ends_at": "2026-12-31T23:59:59",
      "cta": { "label": "Shop the sale", "url": "/shop" }
    },
    "promo_unit": 50,
    "testimonials": [
      { "author": "Sarah M.", "role": "Verified buyer", "rating": 5, "text": "…", "avatar": "https://…" }
    ]
  }
}
```

> Sanity note for me: the SQL window on Laravel is simple — fetch rows, group in
> PHP, return a single JSON. If seeds should vary per visit, wrap the payload in
> `meta` with a `generated_at` stamp; **do not** re-seed randomly on read.

---

## 2. Supporting endpoints (reused by shop / category / product / auth)

### Products
| Method | Path | Query | Purpose |
|---|---|---|---|
| GET | `/api/products` | `category`, `sort` (recommended\|price-low\|price-high\|name) | shop grid |
| GET | `/api/products/{id}` | — | product page (+ `related`) |
| GET | `/api/products/{id}/related` | `limit` | related grid |
| POST | `/api/products/{id}/reviews` | — | submit a review |

`GET /api/products` response (Sanctum-friendly `data`/`meta` shape):

```json
{ "data": [ { "id": 1, "name": "Classic White Tee", "price": 24.99, "category": "signature-collection", "image": "https://…/w=800" } ], "meta": { "current_page": 1, "last_page": 2, "total": 18 } }
```

### Categories
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/categories` | navbar/featured tiles |
| GET | `/api/categories/{slug}` | category page (header + products) |

### Auth (Sanctum — see `src/api/auth.js` + `src/stores/auth.js`)
| Method | Path | Purpose |
|---|---|---|
| GET | `/sanctum/csrf-cookie` | prime the CSRF cookie (call first) |
| GET | `/api/auth/me` | current user |
| POST | `/api/auth/login` | login (`email`, `password`) |
| POST | `/api/auth/register` | register (`name`, `email`, `password`) |
| POST | `/api/auth/logout` | revoke session (Accept: application/json) |

### Orders + home (future)
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/orders` | place an order (status: pending) |

---

## 3. Models (Laravel migration/SQL shapes to add later)

- **products**: `id`, `name`, `price(decimal 10,2)`, `category_id` FK, `description(optional)`, `image_url`, `is_featured(unsigned tinyint bool)`, `created_at/deleted_at` (soft delete for the sale-based demo).
  - Notes: `price` stays decimal in SQL to avoid float drift; the frontend formats with `.toFixed(2)` so the bytes sent can ignore trailing zeros. Keep a `deleted_at` because this demo both "sells out" and "returns for sale" items — soft delete makes the swap reversible without reseeding.
- **categories**: `id`, `slug` (unique), `title`, `eyebrow`, `description`, `image_url`, `sort_order`.
- **reviews**: `id`, `product_id` FK, `author`, `role`, `rating (1..5)`, `text`, `avatar_url`.
- **promo**: columns the PromoBanner needs → `title`, `discount`, `subtitle`, `image_url`, `ends_at(timestamp)`, `cta_label`, `cta_url`.
- **orders**: `id`, `user_id` FK nullable, `status`, `total(decimal 10,2)`, timestamps.

> Frontend fixture data lives in `src/data/catalog.js` — match migration seeds to those exact slugs (`signature-collection`, `mid-season-sale`, `best-sellers`) so category pages keep working with zero frontend changes.

---

## 4. Shared conventions (apply to every endpoint)

- **Sanctum SPA cookie auth**: the token lives in Laravel's httpOnly `laravel_session` cookie — the frontend never reads it (XSS-safe). Axios already sends `withCredentials` + `X-XSRF-TOKEN`. → For the **API-token fallback** (`localStorage`), see `src/stores/auth.js` comment: use only when the SPA cookie flow is off the table.
- **Auth errors**: `401` = unauthenticated, `419` = stale CSRF. Axios 401 → clears session + redirects `/login`; 419 → retries once after refreshing the cookie. Do not send HTML for errors — return `{ message }` JSON.
- **Validation shape** (Login/Register views already render these): on `422`, return
  `{ "message": "...", "errors": { "email": ["The email field is required."] } }`.
- **Pagination**: list endpoints return `{ data, meta }` so the shop grid can keep its keys after filter/sort swaps. Frontend default: 12 per page.
- These links point to the **API generated by the Laravel backend + Sanctum** that this project will run against; keep them consistent with what you enforce server-side.

---

## 5. "Connect the dots" — which section reads what

| Frontend home section | Local source (today) | Web source (final) |
|---|---|---|
| `HeroSection` | `slides` array inside `src/components/HeroSection.vue` | `/api/home` → `data.hero` |
| `FeaturedCategories` | `categories` + products in `src/data/catalog.js` | `/api/home` → `data.categories` |
| `BestSellers` | `products` filtered `best-sellers` in `catalog.js` | `/api/home` → `data.best_sellers` |
| `PromoBanner` | `promo` in `src/data/home.js` | `/api/home` → `data.promo` |
| `Testimonials` | `testimonials` in `src/data/home.js` | `/api/home` → `data.testimonials` |

Swap strategy: keep `src/data/*.js` as a **fallback** (feature-flag `VITE_USE_API`), so the site still renders if the API is down. Only the data import changes — no component edits.
