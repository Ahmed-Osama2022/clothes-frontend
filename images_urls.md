# Images Used in the Project

All images in this project are **hotlinked from external CDNs** — there are no local product/hero images checked into the repo (only `public/favicon.ico` lives locally). Sources are **[Unsplash](https://unsplash.com)** (fashion photography, free license) and **[PRAvatar](https://pravatar.cc)** (generated placeholder avatars).

---

## 1. Product & Category Images — Unsplash

Source: `https://images.unsplash.com` — free-to-use photos from Unsplash. Each photo ID below can be opened directly at `https://unsplash.com/photos/<id>` to see the author & license.

### Category / Hero images (w=1600 or w=900)

| # | URL | Photo ID | Used in | What it shows |
|---|-----|----------|---------|---------------|
| 1 | `https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600` | [photo-1445205170230-053b83016050](https://unsplash.com/photos/1445205170230-053b83016050) | `src/data/catalog.js:14` — Signature Collection cover | Clothing rack in a fashion store |
| 2 | `https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600` | [photo-1441986300917-64674bd600d8](https://unsplash.com/photos/1441986300917-64674bd600d8) | `src/data/catalog.js:27` — Mid-Season Sale cover; `src/data/home.js:16` — promo banner; `src/components/PromoBanner.vue:22` — promo banner | Retail clothing store interior |
| 3 | `https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1600` | [photo-1434389677669-e08b4cac3105](https://unsplash.com/photos/1434389677669-e08b4cac3105) | `src/data/catalog.js:40` — Best Sellers cover | Clothes hanging on a rail |

### Hero slider images (w=900)

| # | URL | Photo ID | Used in | What it shows |
|---|-----|----------|---------|---------------|
| 4 | `https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=900` | same as #1 | `src/components/HeroSection.vue:22` — hero slide 1 | Clothing rack in a fashion store |
| 5 | `https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=900` | same as #2 | `src/components/HeroSection.vue:46` — hero slide 2 | Retail clothing store interior |
| 6 | `https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=900` | same as #3 | `src/components/HeroSection.vue:70` — hero slide 3 | Clothes hanging on a rail |

### Product images (w=800, from `src/data/catalog.js`)

| # | URL | Photo ID | Products using it | What it shows |
|---|-----|----------|-------------------|---------------|
| 7 | `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800` | [photo-1521572163474-6864f9cf17ab](https://unsplash.com/photos/1521572163474-6864f9cf17ab) | #1 Classic White Tee, #16 Ribbed Tank | White t-shirt on a hanger/model |
| 8 | `https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800` | [photo-1523381210434-271e8be1f52b](https://unsplash.com/photos/1523381210434-271e8be1f52b) | #2 Essential Crewneck, #11 Sale Basics 3-Pack | Folded t-shirts / crewneck stack |
| 9 | `https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800` | same as #1 | #3 Street Co-ord, #14 Runway Model Top | Clothing rack in a fashion store |
| 10 | `https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800` | [photo-1583743814966-8936f5b7be1a](https://unsplash.com/photos/1583743814966-8936f5b7be1a) | #4 Summer Linen Shirt, #12 Raglan Sleeve Top | Black t-shirt / dark top |
| 11 | `https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800` | same as #3 | #5 Classic Hoodie, #13 Hanging Everyday Set | Clothes hanging on a rail |
| 12 | `https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800` | [photo-1483985988355-763728e1935b](https://unsplash.com/photos/1483985988355-763728e1935b) | #6 Urban Jacket, #9 Weekend Overshirt | Fashion / shopping scene |
| 13 | `https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800` | [photo-1503341504253-dff4815485f1](https://unsplash.com/photos/1503341504253-dff4815485f1) | #7 Rack Clearance Tee, #17 Studio Top | Clothing rack / apparel display |
| 14 | `https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=800` | [photo-1543087903-1ac2ec7aa8c5](https://unsplash.com/photos/1543087903-1ac2ec7aa8c5) | #8 Denim Day Fit | Denim / jeans outfit |
| 15 | `https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800` | [photo-1525507119028-ed4c629a60a3](https://unsplash.com/photos/1525507119028-ed4c629a60a3) | #10 Lounge Set Two-Piece, #18 Pleated Flare Skirt | Clothing / fashion still-life |

### Demo product image (w=900)

| # | URL | Photo ID | Used in | What it shows |
|---|-----|----------|---------|---------------|
| 16 | `https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=900` | same as #7 | `src/components/TestCard.vue:21` — demo product card (route `/testcard`) | White t-shirt |

---

## 2. Testimonial Avatars — PRAvatar

Source: `https://i.pravatar.cc` — free generated placeholder avatar service (random face photos, no real identities).

| # | URL | Used in | For |
|---|-----|---------|-----|
| 17 | `https://i.pravatar.cc/80?img=5` | `src/data/home.js:39` — Testimonials | Sarah M. avatar |
| 18 | `https://i.pravatar.cc/80?img=12` | `src/data/home.js:49` — Testimonials | James L. avatar |
| 19 | `https://i.pravatar.cc/80?img=45` | `src/data/home.js:59` — Testimonials | Priya R. avatar |

---

## 3. Local Images

| # | Path | Used in | Notes |
|---|------|---------|-------|
| 20 | `public/favicon.ico` | `index.html` | Site favicon (only local image in the repo) |

---

## Summary

| Source | Domain | Count (unique URLs) | License / Notes |
|--------|--------|---------------------|-----------------|
| Unsplash | `images.unsplash.com` | 16 | Free license ([Unsplash License](https://unsplash.com/license)) — free for commercial & non-commercial use, no permission needed (attribution appreciated) |
| PRAvatar | `i.pravatar.cc` | 3 | Free placeholder avatar generator ([pravatar.cc](https://pravatar.cc)) |
| Local | `public/` | 1 | `favicon.ico` |

**Total unique image URLs: 20** (many products reuse the same Unsplash photo at different sizes; see the "Products using it" columns above for the reuse map).

> **Note:** When the Laravel backend goes live, product/category/testimonial images will come from the API (`GET /api/home` per `src/api/home.js`) instead of these hardcoded placeholder URLs.
