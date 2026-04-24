<script setup lang="ts">
import type { EventType } from '@/services/api'
import { RouterLink } from 'vue-router'
import AppButton from '@/components/AppButton.vue'

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
      <span class="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
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
      <AppButton
        :as="RouterLink"
        :to="{ name: 'book', params: { id: eventType.id } }"
      >
        Выбрать слот →
      </AppButton>
    </div>
  </article>
</template>
