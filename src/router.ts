import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

// import RenderComponents from './components/index.tsx';

const routercfg: RouteRecordRaw[] = [
  { path: '/login', component: () => import('./pages/login-new.vue') },
  { path: '/forget', component: () => import('./pages/forget-new.vue') },
  { path: '/change-password', component: () => import('./pages/changepassword.vue') },
  {
    path: '/networkPortal',
    component: () => import('./pages/networkPortal.vue'),
  },
  {
    path: '/change-bind-device',
    component: () => import('./pages/modifyInternetBindDevice.vue'),
  },
  {
    path: '/guest-verify',
    component: () => import('./pages/guest-verify.vue'),
  },
];

const routes = [
  {
    path: '/',
    redirect: '/login',
    // component: RenderComponents,
    children: [...routercfg],
  },
  {
    path: '/:w+',
    redirect: '/',
  },
];

const routerConfig = {
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to: any, from: any) {
    if (to.path !== from.path) {
      return { top: 0 };
    }
  },
};

const router = createRouter(routerConfig);

export default router;
