// ======= HOME PAGE CONTENT =======
// Placeholder home data used by HomeView sections. When the aggregated
// Laravel endpoint is live, swap this file for data from GET /api/home
// (see apis.md) — same shapes, so only the import source changes.

// -------------------- PROMO / COUNTDOWN SALE --------------------
// Consumed by components/PromoBanner.vue (live countdown to ends_at).
// NOTE: swap `ends_at` to the real promo end date from the API.
export const promo = {
  title: 'Mid-Season Sale',
  subtitle: 'Seasonal favorites at unbeatable prices — stock moves fast.',
  discount: 'UP TO 50% OFF',
  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
  ends_at: '2026-12-31T23:59:59',
  cta: { label: 'Shop the sale', url: '/shop' },
};

// -------------------- TESTIMONIALS --------------------
// Consumed by components/Testimonials.vue (auto-rotating carousel).
export const testimonials = [
  { author: 'Sarah M.', role: 'Verified buyer', rating: 5, text: 'The fabric quality blew me away — the tee still looks new after a dozen washes.', avatar: 'https://i.pravatar.cc/80?img=5' },
  { author: 'James L.', role: 'Repeat customer', rating: 5, text: 'Exactly as pictured, fits true to size IMPORTANT., and shipping was fast. My whole summer wardrobe came from here.', avatar: 'https://i.pravatar.cc/80?img=12' },
  { author: 'Priya R.', role: 'First order', rating: 4, text: 'Great value and the returns process was painless. Which is exactly what you want in 2026.', avatar: 'https://i.pravatar.cc/80?img=45' },
];
