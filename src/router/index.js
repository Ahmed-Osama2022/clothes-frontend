import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import HomeView from '../views/HomeView.vue';
import TestCard from '../components/TestCard.vue';
import NotFoundView from '../views/NotFoundView.vue';

// ======= ROUTE-LEVEL LOADING BAR =======
// NProgress shows a slim top progress bar while the router resolves the next
// route (covers lazy-route loads like /shop, /product/:id). Skeleton
// placeholders handle in-page async data (see AGENTS.md -> Loading states).
// Show a clean bar only — no spinner — and let the bar finish instantly on
// no-op navigations.
NProgress.configure({ showSpinner: false, trickleSpeed: 120, minimum: 0.1 });

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // TEST:
    {
      path: '/testcard',
      name: 'testcard',
      component: TestCard,
    },
    // Full catalog / shop page
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/ShopView.vue'),
    },
    // Single product detail page, e.g. /product/1
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
    },
    // Category listing pages, e.g. /category/best-sellers
    {
      path: '/category/:slug',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
    },
    // Auth pages (realtime validation + toasts, Sanctum-ready)
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    // For error page 404
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

// Start the bar on every navigation beginning; finish it once resolved/aborted.
router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

router.onError(() => {
  NProgress.done();
});

export default router;
