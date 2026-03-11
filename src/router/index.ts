import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/workbench',
    },
    {
      path: '/workbench',
      name: 'workbench',
      component: () => import('@/views/WorkbenchPage.vue'),
    },
  ],
})

export default router
