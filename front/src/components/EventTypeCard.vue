<script setup lang="ts">
import type { EventType } from '@/services/api'
import { Button } from '@vuetify/v0'
import { RouterLink } from 'vue-router'

defineProps<{
  eventType: EventType
  variant?: 'guest' | 'owner'
}>()
</script>

<template>
  <article
    class="flex flex-col gap-3 rounded-lg border border-black/10 bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
  >
    <header class="flex items-start justify-between gap-3">
      <div>
        <h3 class="text-lg font-semibold leading-snug">
          {{ eventType.name }}
        </h3>
        <p class="mt-0.5 text-xs opacity-60">
          ID: {{ eventType.id }}
        </p>
      </div>
      <span
        class="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
      >
        {{ eventType.duration }} мин
      </span>
    </header>

    <p v-if="eventType.description" class="text-sm opacity-80">
      {{ eventType.description }}
    </p>
    <p v-else class="text-sm italic opacity-50">
      Без описания
    </p>

    <div v-if="variant !== 'owner'" class="mt-auto pt-2">
      <Button.Root
        :as="RouterLink"
        :to="{ name: 'book', params: { id: eventType.id } }"
        class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-on-primary shadow-sm transition-opacity hover:opacity-90"
      >
        <Button.Content>
          Выбрать слот →
        </Button.Content>
      </Button.Root>
    </div>
  </article>
</template>
