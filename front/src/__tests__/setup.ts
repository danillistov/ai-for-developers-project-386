import { config } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

const testRouter = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/book/:id', name: 'book', component: { template: '<div />' } },
    { path: '/admin/event-types', name: 'admin-event-types', component: { template: '<div />' } },
    { path: '/admin/bookings', name: 'admin-bookings', component: { template: '<div />' } },
  ],
})

config.global.plugins = [testRouter]
config.global.stubs = {
  RouterLink: { template: '<a data-testid="router-link"><slot /></a>' },
  RouterView: { template: '<div data-testid="router-view"><slot /></div>' },
}
