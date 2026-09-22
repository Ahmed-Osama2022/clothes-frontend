// ======= FAKE HOME ENDPOINT (GET /api/home) =======
// Temporary stand-in for the Laravel backend until it is live. It returns the
// EXACT payload shape the real endpoint will send (see apis.md, section 1), so
// swapping this file for `import api from './client'` later requires ZERO changes
// in the components that consume it.
//   Real swap (once backend is up and VITE_API_URL/BASE_URL point at it):
//     import api from './client';
//     export const getHomeData = () => api.get('/home');
// Everything else keeps working unchanged.
const FAKE_JSON = {
  data: {
    categories: [
      {
        slug: 'signature-collection',
        title: 'Signature Collection',
        eyebrow: 'New Season',
        count: 6,
        url: '/category/signature-collection',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1600',
      },
      {
        slug: 'mid-season-sale',
        title: 'Mid-Season Sale',
        eyebrow: 'Up to 50% Off',
        count: 6,
        url: '/category/mid-season-sale',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600',
      },
      {
        slug: 'best-sellers',
        title: 'Best Sellers',
        eyebrow: 'New Arrivals',
        count: 6,
        url: '/category/best-sellers',
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1600',
      },
    ],
  },
};

// Simulated backend latency so the loading state is visible (remove with the
// real client — it will be a true network call).
export const getHomeData = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(FAKE_JSON), 400);
  });
