import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('./views/HomeView.vue'), meta: { title: '3 stamps. A free gift.' } },
    { path: '/join/', component: () => import('./views/JoinView.vue'), meta: { title: 'Create your card' } },
    { path: '/login/', component: () => import('./views/LoginView.vue'), meta: { title: 'Open your card' } },
    { path: '/card/', component: () => import('./views/CardView.vue'), meta: { title: 'My rewards card' } },
    { path: '/staff/login/', component: () => import('./views/StaffLoginView.vue'), meta: { title: 'Staff demo' } },
    { path: '/staff/', component: () => import('./views/StaffView.vue'), meta: { title: 'Staff checkout' } },
    { path: '/:pathMatch(.*)*', component: () => import('./views/NotFoundView.vue'), meta: { title: 'Page not found' } },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, top: 24, behavior: 'smooth' };
    if (to.path !== from.path) return { top: 0 };
  },
});
router.afterEach(async (to, from, failure) => {
  if (failure) return;
  document.title = `${String(to.meta.title)} | M Souq Rewards`;
  if (to.path === from.path || to.hash) return;
  await nextTick();
  const content = document.getElementById('main-content');
  content?.setAttribute('tabindex', '-1');
  content?.focus({ preventScroll: true });
});
export default router;
