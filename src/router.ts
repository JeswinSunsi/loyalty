import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('./views/HomeView.vue') },
    { path: '/join/', component: () => import('./views/JoinView.vue') },
    { path: '/login/', component: () => import('./views/LoginView.vue') },
    { path: '/card/', component: () => import('./views/CardView.vue') },
    { path: '/staff/login/', component: () => import('./views/StaffLoginView.vue') },
    { path: '/staff/', component: () => import('./views/StaffView.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('./views/NotFoundView.vue') },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.path !== from.path) return { top: 0 };
  },
});
export default router;
