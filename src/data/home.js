// ======= HOME PAGE CONTENT =======
// Placeholder home data used by HomeView sections. When the aggregated
// Laravel endpoint is live, swap this file for data from GET /api/home
// (see apis.md) — same shapes, so only the import source changes.
//
// ======= I18N =======
// Content here is BACKEND-tier (like database rows): locale-keyed so each
// language has its own text. Fields that read as `{ en: ..., ar: ... }` are
// resolved at render time by pickByLocale() (src/i18n/index.js). Shared
// fields (image, ends_at, avatar, rating) live outside the locale map.

// -------------------- PROMO / COUNTDOWN SALE --------------------
// Consumed by components/PromoBanner.vue (live countdown to ends_at).
// NOTE: swap `ends_at` to the real promo end date from the API.
export const promo = {
  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
  ends_at: '2026-12-31T23:59:59',
  en: {
    title: 'Mid-Season Sale',
    subtitle: 'Seasonal favorites at unbeatable prices — stock moves fast.',
    discount: 'UP TO 50% OFF',
    cta: { label: 'Shop the sale', url: '/shop' },
  },
  ar: {
    title: 'تخفيضات منتصف الموسم',
    subtitle: 'مفضلات الموسم بأسعار لا تُقاوم — الكمية محدودة وتنفد سريعًا.',
    discount: 'خصم حتى 50%',
    cta: { label: 'تسوق العرض', url: '/shop' },
  },
};

// -------------------- TESTIMONIALS --------------------
// Consumed by components/Testimonials.vue (auto-rotating carousel).
// `text` and `role` are locale-keyed (see note above).
export const testimonials = [
  {
    author: 'Sarah M.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/80?img=5',
    role: { en: 'Verified buyer', ar: 'مشترية موثقة' },
    text: {
      en: 'The fabric quality blew me away — the tee still looks new after a dozen washes.',
      ar: 'جودة القماش أذهلتني — التيشيرت ما زال يبدو جديدًا بعد أكثر من اثنتي عشرة غسلة.',
    },
  },
  {
    author: 'James L.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/80?img=12',
    role: { en: 'Repeat customer', ar: 'عميل دائم' },
    text: {
      en: 'Exactly as pictured, fits true to size, and shipping was fast. My whole summer wardrobe came from here.',
      ar: 'مطابق تمامًا للصور، المقاس مضبوط، والشحن كان سريعًا. خزانتي الصيفية كلها من هنا.',
    },
  },
  {
    author: 'Priya R.',
    rating: 4,
    avatar: 'https://i.pravatar.cc/80?img=45',
    role: { en: 'First order', ar: 'طلبية أولى' },
    text: {
      en: 'Great value and the returns process was painless. Which is exactly what you want.',
      ar: 'قيمة ممتازة وإجراءات الإرجاع سهلة وبلا تعقيد. وهذا بالضبط ما نريده.',
    },
  },
];