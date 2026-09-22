// ======= SHOP CATALOG DATA =======
// Single source of truth for the shop. Edit products & categories here;
// both the /shop page and /category/:slug pages read from this file.

export const categories = {
  'signature-collection': {
    title: 'Signature Collection',
    eyebrow: 'New Season 2026',
    description: 'Curated everyday pieces — effortless, versatile and made to move with you.',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600',
  },
  'mid-season-sale': {
    title: 'Mid-Season Sale',
    eyebrow: 'Up to 50% Off',
    description: 'Seasonal favorites at unbeatable prices. Stock up before the sale ends.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
  },
  'best-sellers': {
    title: 'Best Sellers',
    eyebrow: 'New Arrivals',
    description: 'Everyone is wearing these right now — sustainably made, seriously comfortable.',
    image:
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1600',
  },
};

// `category` must match a key in `categories` above.
export const products = [
  { name: 'Classic White Tee', price: 24.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
  { name: 'Essential Crewneck', price: 34.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Street Co-ord', price: 59.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800' },
  { name: 'Summer Linen Shirt', price: 39.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Classic Hoodie', price: 44.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800' },
  { name: 'Urban Jacket', price: 69.99, category: 'signature-collection', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Rack Clearance Tee', price: 9.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Denim Day Fit', price: 44.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Weekend Overshirt', price: 29.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Lounge Set Two-Piece', price: 19.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sale Basics 3-Pack', price: 24.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Raglan Sleeve Top', price: 14.99, category: 'mid-season-sale', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800' },
  { name: 'Hanging Everyday Set', price: 74.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800' },
  { name: 'Runway Model Top', price: 49.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800' },
  { name: 'Boutique Blazer', price: 89.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Ribbed Tank', price: 18.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800' },
  { name: 'Studio Top', price: 32.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pleated Flare Skirt', price: 42.99, category: 'best-sellers', image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=800' },
];