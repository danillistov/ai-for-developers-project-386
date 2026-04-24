<script setup lang="ts">
import { Button } from '@vuetify/v0'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

interface NavLink {
  to: string
  label: string
}

const guestLinks: NavLink[] = [
  { to: '/', label: 'Каталог' },
]

const ownerLinks: NavLink[] = [
  { to: '/admin/event-types', label: 'Event types' },
  { to: '/admin/bookings', label: 'Bookings' },
]

const route = useRoute()

function isActive(to: string): boolean {
  const path = route?.path ?? ''
  if (to === '/')
    return path === '/' || path.startsWith('/book')
  return path.startsWith(to)
}

const guestActive = computed(() => guestLinks.some(l => isActive(l.to)))
const ownerActive = computed(() => ownerLinks.some(l => isActive(l.to)))
</script>

<template>
  <nav class="flex flex-wrap items-center gap-6 text-sm">
    <div class="flex items-center gap-2">
      <span
        class="text-xs font-medium uppercase tracking-wide opacity-60"
        :class="{ 'text-primary opacity-100': guestActive }"
      >
        Гость
      </span>
      <Button.Group class="flex gap-1">
        <Button.Root
          v-for="link in guestLinks"
          :key="link.to"
          :as="RouterLink"
          :to="link.to"
          class="rounded px-3 py-1 transition-colors hover:bg-black/5"
          :class="{ 'bg-primary/10 text-primary': isActive(link.to) }"
        >
          <Button.Content>
            {{ link.label }}
          </Button.Content>
        </Button.Root>
      </Button.Group>
    </div>

    <div class="h-5 w-px bg-black/10" aria-hidden="true" />

    <div class="flex items-center gap-2">
      <span
        class="text-xs font-medium uppercase tracking-wide opacity-60"
        :class="{ 'text-primary opacity-100': ownerActive }"
      >
        Владелец
      </span>
      <Button.Group class="flex gap-1">
        <Button.Root
          v-for="link in ownerLinks"
          :key="link.to"
          :as="RouterLink"
          :to="link.to"
          class="rounded px-3 py-1 transition-colors hover:bg-black/5"
          :class="{ 'bg-primary/10 text-primary': isActive(link.to) }"
        >
          <Button.Content>
            {{ link.label }}
          </Button.Content>
        </Button.Root>
      </Button.Group>
    </div>
  </nav>
</template>
