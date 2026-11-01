// ======= EDITORIAL SITE CONTENT (not API data) =======
// The Laravel MVP exposes categories + products only. Everything below is
// hand-written marketing content that has no endpoint yet, so it lives here
// as a single clearly-labelled module instead of pretending to be API data.
//
// TODO(api): replace each block when the backend ships the matching endpoint
// (see Report.md -> "Backend gaps"):
//   hero         -> GET /home -> data.hero
//   promo        -> GET /home -> data.promo
//   testimonials -> GET /home -> data.testimonials
//   categoryEyebrows -> GET /categories (an `eyebrow` column)
//
// Fields inside `en` / `ar` are resolved at render time with pickByLocale()
// (src/i18n/index.js). Shared fields (image, ends_at, avatar, rating) live
// outside the locale map because they are language-independent.
import { pickByLocale } from '../i18n';

// -------------------- HERO SLIDER --------------------
// Consumed by components/HeroSection.vue (7s auto-rotate).
// `category` is a real API slug and drives the "Shop Now" CTA.
export const heroSlides = [
  {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=900',
    category: 'signature-collection',
    en: {
      badge: 'New Season 2026',
      title: 'Fresh Styles,',
      accent: 'Bold Looks',
      subtitle: 'Discover the latest drops curated for your everyday — effortless pieces made to move with you.',
      tag: 'Signature Collection',
      price: 'From $49.90',
      discount: '20%',
      pill: 'Just in',
    },
    ar: {
      badge: 'موسم جديد 2026',
      title: 'إطلالات جديدة،',
      accent: 'جريئة',
      subtitle: 'اكتشف أحدث الإطلالات المختارة ليومك — قطع بسيطة صُنعت لتتحرك معك.',
      tag: 'المجموعة المميزة',
      price: 'ابتداءً من $49.90',
      discount: '20%',
      pill: 'وصل حديثًا',
    },
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=900',
    category: 'mid-season-sale',
    en: {
      badge: 'Weekly Sale',
      title: 'Up to 50% Off',
      accent: 'This Week',
      subtitle: 'Seasonal favorites at unbeatable prices. Stock up before the sale ends this Sunday.',
      tag: 'Mid-Season Sale',
      price: 'From $19.99',
      discount: '50%',
      pill: 'Limited',
    },
    ar: {
      badge: 'عرض الأسبوع',
      title: 'خصم يصل إلى 50%',
      accent: 'هذا الأسبوع',
      subtitle: 'مفضلات موسمية بأسعار لا تُقاوم. خزّن قبل انتهاء العرض يوم الأحد.',
      tag: 'تخفيضات منتصف الموسم',
      price: 'ابتداءً من $19.99',
      discount: '50%',
      pill: 'محدود',
    },
  },
  {
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=900',
    category: 'best-sellers',
    en: {
      badge: 'New Arrivals',
      title: 'Your Wardrobe,',
      accent: 'Upgraded',
      subtitle: 'Everyday essentials and statement pieces — sustainably made, seriously comfortable.',
      tag: 'Best Sellers',
      price: 'From $29.00',
      discount: '15%',
      pill: 'Trending',
    },
    ar: {
      badge: 'وصل حديثًا',
      title: 'خزانتك،',
      accent: 'بمستوى جديد',
      subtitle: 'أساسيات يومية وقطع مميزة — صُنّعت بطرق مستدامة وراحة حقيقية.',
      tag: 'الأكثر مبيعًا',
      price: 'ابتداءً من $29.00',
      discount: '15%',
      pill: 'رائج',
    },
  },
];

// -------------------- PROMO / COUNTDOWN --------------------
// Consumed by components/PromoBanner.vue (live countdown to ends_at).
// Swap `ends_at` when the real campaign date is known.
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
// Consumed by components/Testimonials.vue (6s auto-rotating carousel).
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

// -------------------- CATEGORY EYEBROWS --------------------
// The API returns `title` + `description` but no short eyebrow line. This map
// supplies the accent label used on the home tiles, keyed by API slug. Unknown
// slugs fall back to the generic `featured.eyebrow` translation.
export const categoryEyebrows = {
  'signature-collection': { en: 'New Season 2026', ar: 'موسم جديد 2026' },
  'mid-season-sale': { en: 'Up to 50% Off', ar: 'خصم حتى 50%' },
  'best-sellers': { en: 'New Arrivals', ar: 'وصل حديثًا' },
};

export const categoryEyebrow = (slug) => (categoryEyebrows[slug] ? pickByLocale(categoryEyebrows[slug]) : '');
