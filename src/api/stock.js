// ======= FAKE PRODUCT STOCK ENDPOINT =======
// Placeholder for `GET /api/products/{id}/stock` (Laravel + Sanctum).
// Suggested backend behaviour + response shape are documented in apis.md
// (Products section). Swap for the real client when the Laravel API is up:
//
//   import { api } from './client';
//   export const getProductStock = (productId) =>
//     api.get(`/products/${productId}/stock`);
//
// Today: deterministic fake so per-size availability is stable and varied.
// Sizes themselves are locale-independent (S/M/L/XL…) so no locale is passed.
const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const buildStock = (productId) =>
  PRODUCT_SIZES.map((size, index) => {
    // Deterministic pseudo-random: roughly every 4th size of a product is out.
    const soldOut = (productId + index * 3) % 5 === 0;
    return {
      size,
      in_stock: !soldOut,
      quantity: soldOut ? 0 : 3 + ((productId * 7 + index * 5) % 12),
    };
  });

export const getProductStock = (productId, { latency = 350 } = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { product_id: productId, sizes: buildStock(productId) } });
    }, latency);
  });