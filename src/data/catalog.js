// ======= SHOP CATALOG DATA =======
// Single source of truth for the shop. Edit products & categories here;
// both the /shop page and /category/:slug pages read from this file.
//
// ======= I18N =======
// Backend-tier content (like DB rows): `title`/`eyebrow`/`description` and
// product `name` are locale-keyed ({ en, ar }) — resolved at render time via
// pickByLocale() (src/i18n/index.js). Shared fields (image, price, id,
// category, count) stay outside the locale map. The fake GET /api/home serves
// these translated for the requested locale (http://src/api/home.js).

export const categories = {
  'signature-collection': {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600',
    en: {
      title: 'Signature Collection',
      eyebrow: 'New Season 2026',
      description: 'Curated everyday pieces — effortless, versatile and made to move with you.',
    },
    ar: {
      title: 'المجموعة المميزة',
      eyebrow: 'موسم جديد 2026',
      description: 'قطع يومية مختارة بعناية — بسيطة ومتعددة الاستخدامات، صُنعت لتتحرك معك.',
    },
  },
  'mid-season-sale': {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
    en: {
      title: 'Mid-Season Sale',
      eyebrow: 'Up to 50% Off',
      description: 'Seasonal favorites at unbeatable prices. Stock up before the sale ends.',
    },
    ar: {
      title: 'تخفيضات منتصف الموسم',
      eyebrow: 'خصم حتى 50%',
      description: 'مفضلات موسمية بأسعار لا تُقاوم. خزّن قبل انتهاء العرض.',
    },
  },
  'best-sellers': {
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1600',
    en: {
      title: 'Best Sellers',
      eyebrow: 'New Arrivals',
      description: 'Everyone is wearing these right now — sustainably made, seriously comfortable.',
    },
    ar: {
      title: 'الأكثر مبيعًا',
      eyebrow: 'وصل حديثًا',
      description: 'الجميع يرتديها الآن — صناعة مستدامة وراحة حقيقية.',
    },
  },
};

// `category` must match a key in `categories` above.
// `id` is the unique stable key used by the cart store — never reorder the list,
// keep ids sequential if you add products.
// `name` is locale-keyed (see note at the top of this file).
export const products = [
  {
    id: 1,
    name: { en: 'Classic White Tee', ar: 'تيشيرت أبيض كلاسيكي' },
    price: 24.99,
    category: 'signature-collection',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    name: { en: 'Essential Crewneck', ar: 'بلوفر أساسي رقبة مدورة' },
    price: 34.99,
    category: 'signature-collection',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    name: { en: 'Street Co-ord', ar: 'طقم ستريت' },
    price: 59.99,
    category: 'signature-collection',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    name: { en: 'Summer Linen Shirt', ar: 'قميص كتان صيفي' },
    price: 39.99,
    category: 'signature-collection',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 5,
    name: { en: 'Classic Hoodie', ar: 'هودي كلاسيكي' },
    price: 44.99,
    category: 'signature-collection',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 6,
    name: { en: 'Urban Jacket', ar: 'جاكيت عصري' },
    price: 69.99,
    category: 'signature-collection',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 7,
    name: { en: 'Rack Clearance Tee', ar: 'تيشيرت تخفيضات' },
    price: 9.99,
    category: 'mid-season-sale',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 8,
    name: { en: 'Denim Day Fit', ar: 'جينز يومي' },
    price: 44.99,
    category: 'mid-season-sale',
    image: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 9,
    name: { en: 'Weekend Overshirt', ar: 'قميص عطلة نهاية الأسبوع' },
    price: 29.99,
    category: 'mid-season-sale',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 10,
    name: { en: 'Lounge Set Two-Piece', ar: 'طقم استرخاء من قطعتين' },
    price: 19.99,
    category: 'mid-season-sale',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 11,
    name: { en: 'Sale Basics 3-Pack', ar: 'حزمة أساسيات 3 قطع' },
    price: 24.99,
    category: 'mid-season-sale',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 12,
    name: { en: 'Raglan Sleeve Top', ar: 'توب بأكمام راجلان' },
    price: 14.99,
    category: 'mid-season-sale',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 13,
    name: { en: 'Hanging Everyday Set', ar: 'طقم يومي معلق' },
    price: 74.99,
    category: 'best-sellers',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 14,
    name: { en: 'Runway Model Top', ar: 'توب موديل الكات ووك' },
    price: 49.99,
    category: 'best-sellers',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 15,
    name: { en: 'Boutique Blazer', ar: 'بليزر بوتيك' },
    price: 89.99,
    category: 'best-sellers',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 16,
    name: { en: 'Ribbed Tank', ar: 'تانك بضلوع' },
    price: 18.99,
    category: 'best-sellers',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 17,
    name: { en: 'Studio Top', ar: 'توب ستوديو' },
    price: 32.99,
    category: 'best-sellers',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 18,
    name: { en: 'Pleated Flare Skirt', ar: 'تنورة بليسيه واسعة' },
    price: 42.99,
    category: 'best-sellers',
    image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800',
  },
];
