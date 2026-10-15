import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { coverForCard, revealCard } from './transition';

const loadCardView = () => import('./views/CardView.vue');
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('./views/HomeView.vue'), meta: { title: 'Three stamps. One free gift.' } },
    { path: '/join/', component: () => import('./views/JoinView.vue'), meta: { title: 'Get your card' } },
    { path: '/card/', component: loadCardView, meta: { title: 'My card' } },
    { path: '/staff/', component: () => import('./views/StaffView.vue'), meta: { title: 'Staff checkout' } },
    { path: '/login/', redirect: '/card/' },
    { path: '/staff/login/', redirect: '/staff/' },
    { path: '/:pathMatch(.*)*', component: () => import('./views/NotFoundView.vue'), meta: { title: 'Page not found' } },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 88, behavior: 'smooth' };
    if (to.path !== from.path) return { top: 0 };
  },
});
// Arriving at the card from any other page plays the card curtain first (not on a fresh load, where nothing came before).
router.beforeEach(async (to, from) => {
  if (to.path !== '/card/' || from.path === to.path || !from.matched.length) return;
  void loadCardView();
  await coverForCard();
});
router.afterEach(async (to, from, failure) => {
  revealCard();
  if (failure) return;
  document.title = `${String(to.meta.title)} · M Souq Rewards`;
  if (to.path === from.path || to.hash) return;
  await nextTick();
  const content = document.getElementById('main-content');
  content?.setAttribute('tabindex', '-1');
  content?.focus({ preventScroll: true });
});
export default router;
