import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '@/App.vue'

describe('app shell', () => {
  it('renders the application title', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Calendar Booking')
  })

  it('renders top-level navigation links', () => {
    const wrapper = mount(App)
    const text = wrapper.text()
    expect(text).toContain('Event types')
    expect(text).toContain('Bookings')
  })
})
