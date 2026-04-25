<script setup lang="ts">
import { Button } from '@vuetify/v0'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

interface NavLink {
  name: string
  label: string
  icon: 'grid' | 'calendar' | 'list'
  matches?: readonly string[]
}

const guestLinks: readonly NavLink[] = [
  { name: 'home', label: 'Каталог', icon: 'grid', matches: ['home', 'book'] },
]

const ownerLinks: readonly NavLink[] = [
  { name: 'admin-event-types', label: 'Event types', icon: 'calendar' },
  { name: 'admin-bookings', label: 'Bookings', icon: 'list' },
]

const route = useRoute()

const activeRouteNames = computed(
  () => new Set(route.matched.map(r => r.name).filter(Boolean) as string[]),
)

function isActive(link: NavLink): boolean {
  const names = link.matches ?? [link.name]
  return names.some(n => activeRouteNames.value.has(n))
}
</script>

<template>
  <nav
    aria-label="Основная навигация"
    class="flex items-center gap-1 rounded-full border hairline bg-surface-elevated p-1 text-sm shadow-[0_1px_0_rgba(0,0,0,0.02)]"
  >
    <Button.Group class="contents">
      <Button.Root
        v-for="link in [...guestLinks, ...ownerLinks]"
        :key="link.name"
        :as="RouterLink"
        :to="{ name: link.name }"
        :aria-current="isActive(link) ? 'page' : undefined"
        class="group relative flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors"
        :class="[
          isActive(link)
            ? 'bg-primary text-on-primary shadow-sm'
            : 'text-ink-soft hover:bg-surface-muted hover:text-ink',
        ]"
      >
        <Button.Content class="flex items-center gap-1.5">
          <svg
            v-if="link.icon === 'grid'"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
            class="h-3.5 w-3.5" aria-hidden="true"
          >
            <rect x="4" y="4" width="7" height="7" rx="1.5" />
            <rect x="13" y="4" width="7" height="7" rx="1.5" />
            <rect x="4" y="13" width="7" height="7" rx="1.5" />
            <rect x="13" y="13" width="7" height="7" rx="1.5" />
          </svg>
          <svg
            v-else-if="link.icon === 'calendar'"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
            class="h-3.5 w-3.5" aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4M16 3v4M3 10h18" />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
            class="h-3.5 w-3.5" aria-hidden="true"
          >
            <path d="M8 6h13M8 12h13M8 18h13" />
            <circle cx="4" cy="6" r="1" />
            <circle cx="4" cy="12" r="1" />
            <circle cx="4" cy="18" r="1" />
          </svg>
          <span>{{ link.label }}</span>
        </Button.Content>
      </Button.Root>
    </Button.Group>
  </nav>
</template>
