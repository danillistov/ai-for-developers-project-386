<script setup lang="ts">
import type { EventType } from '@/services/api'
import { RouterLink } from 'vue-router'
import AppButton from '@/components/AppButton.vue'

withDefaults(defineProps<{
  eventType: EventType
  variant?: 'guest' | 'owner' | 'feature'
}>(), { variant: 'guest' })
</script>

<template>
  <article
    class="surface-card group flex h-full flex-col gap-4 overflow-hidden transition-all hover:border-[color:var(--color-accent-soft)]"
    :class="variant === 'feature' ? 'p-6 md:p-7' : 'p-5'"
  >
    <header class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-col gap-1">
        <span class="eyebrow">Тип события</span>
        <h3
          class="font-display text-ink leading-tight"
          :class="variant === 'feature' ? 'text-3xl md:text-4xl' : 'text-2xl'"
        >
          {{ eventType.name }}
        </h3>
      </div>
      <span class="chip chip-accent shrink-0">
        {{ eventType.duration }} мин
      </span>
    </header>

    <p
      v-if="eventType.description"
      class="text-sm text-ink-soft"
      :class="variant === 'feature' ? 'max-w-prose' : 'line-clamp-3'"
    >
      {{ eventType.description }}
    </p>
    <p v-else class="text-sm italic text-ink-faint">
      Описание пока не добавлено.
    </p>

    <div class="mt-auto flex flex-wrap items-end justify-between gap-3 border-t hairline pt-4">
      <dl class="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-soft">
        <div class="flex items-center gap-1.5 whitespace-nowrap">
          <span class="text-ink-faint">Длительность</span>
          <span class="font-medium text-ink">{{ eventType.duration }} мин</span>
        </div>
        <div class="flex items-center gap-1.5 whitespace-nowrap">
          <span class="text-ink-faint">Окно</span>
          <span class="font-medium text-ink">14 дней</span>
        </div>
      </dl>

      <AppButton
        v-if="variant !== 'owner'"
        :as="RouterLink"
        :to="{ name: 'book', params: { id: eventType.id } }"
        :variant="variant === 'feature' ? 'primary' : 'outline'"
        size="md"
      >
        Выбрать слот
        <template #trailing>
          <svg
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
            class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </template>
      </AppButton>
    </div>
  </article>
</template>
