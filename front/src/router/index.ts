import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/event-types',
      name: 'event-types',
      component: () => import('@/views/EventTypesView.vue'),
    },
    {
      path: '/event-types/:id/slots',
      name: 'event-type-slots',
      component: () => import('@/views/SlotsView.vue'),
      props: true,
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: () => import('@/views/BookingsView.vue'),
    },
  ],
})

export default router
