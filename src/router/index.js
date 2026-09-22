import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import TestCard from '../components/TestCard.vue';
import NotFoundView from '../views/NotFoundView.vue';

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
    // Category listing pages, e.g. /category/best-sellers
    {
      path: '/category/:slug',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
    },
    // For errro 404
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;
