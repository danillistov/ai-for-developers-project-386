import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { role: 'guest' },
    },
    {
      path: '/book/:id',
      name: 'book',
      component: () => import('@/views/BookView.vue'),
      props: true,
      meta: { role: 'guest' },
    },
    {
      path: '/admin',
      redirect: { name: 'admin-event-types' },
    },
    {
      path: '/admin/event-types',
      name: 'admin-event-types',
      component: () => import('@/views/AdminEventTypesView.vue'),
      meta: { role: 'owner' },
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('@/views/AdminBookingsView.vue'),
      meta: { role: 'owner' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'home' },
    },
  ],
})

export default router
