<script setup lang="ts">
import { Button } from '@vuetify/v0'
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

interface NavLink {
  name: string
  label: string
  matches?: readonly string[]
}

interface NavGroup {
  label: string
  links: readonly NavLink[]
}

const groups: readonly NavGroup[] = [
  {
    label: 'Гость',
    links: [
      { name: 'home', label: 'Каталог', matches: ['home', 'book'] },
    ],
  },
  {
    label: 'Владелец',
    links: [
      { name: 'admin-event-types', label: 'Event types' },
      { name: 'admin-bookings', label: 'Bookings' },
    ],
  },
]

const route = useRoute()

const activeRouteNames = computed(() => new Set(route.matched.map(r => r.name).filter(Boolean) as string[]))

function isActive(link: NavLink): boolean {
  const names = link.matches ?? [link.name]
  return names.some(n => activeRouteNames.value.has(n))
}
</script>

<template>
  <nav class="flex flex-wrap items-center gap-6 text-sm">
    <template v-for="(group, i) in groups" :key="group.label">
      <div v-if="i > 0" class="h-5 w-px bg-black/10" aria-hidden="true" />
      <div class="flex items-center gap-2">
        <span
          class="text-xs font-medium uppercase tracking-wide opacity-60"
          :class="{ 'text-primary opacity-100': group.links.some(isActive) }"
        >
          {{ group.label }}
        </span>
        <Button.Group class="flex gap-1">
          <Button.Root
            v-for="link in group.links"
            :key="link.name"
            :as="RouterLink"
            :to="{ name: link.name }"
            class="rounded px-3 py-1 transition-colors hover:bg-black/5"
            :class="{ 'bg-primary/10 text-primary': isActive(link) }"
          >
            <Button.Content>
              {{ link.label }}
            </Button.Content>
          </Button.Root>
        </Button.Group>
      </div>
    </template>
  </nav>
</template>
