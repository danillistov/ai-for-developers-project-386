<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { computed } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import AppButton from '@/components/AppButton.vue'
import AppEmptyState from '@/components/AppEmptyState.vue'
import SectionHeader from '@/components/SectionHeader.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import StatTile from '@/components/StatTile.vue'
import { bookingsApi, eventTypesApi } from '@/services/api'
import { formatDateTime } from '@/utils/dates'

const bookingsQ = useQuery({
  key: ['bookings'],
  query: () => bookingsApi.list(),
})

const eventTypesQ = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})

const eventTypeMap = computed(() => {
  const map = new Map<string, string>()
  for (const et of eventTypesQ.data.value ?? [])
    map.set(et.id, et.name)
  return map
})

const sorted = computed(() => {
  const list = bookingsQ.data.value ?? []
  return [...list].sort((a, b) => a.startTime.localeCompare(b.startTime))
})

const total = computed(() => sorted.value.length)

const upcoming = computed(() => {
  const now = Date.now()
  return sorted.value.filter(b => new Date(b.startTime).getTime() >= now).length
})

const nextBooking = computed(() => sorted.value.find(
  b => new Date(b.startTime).getTime() >= Date.now(),
) ?? null)

const uniqueGuests = computed(() => {
  const set = new Set<string>()
  for (const b of sorted.value)
    set.add(b.guestEmail.toLowerCase())
  return set.size
})

function guestInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0)
    return '·'
  if (parts.length === 1)
    return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now()
}
</script>

<template>
  <section class="flex flex-col gap-8">
    <SectionHeader
      eyebrow="Администратор"
      title="Bookings"
      description="Все брони по всем типам событий. По умолчанию отсортированы по возрастанию времени."
    >
      <div class="mt-3">
        <AppButton
          variant="outline"
          size="md"
          :disabled="bookingsQ.isLoading.value"
          @click="bookingsQ.refresh()"
        >
          {{ bookingsQ.isLoading.value ? 'Обновление…' : 'Обновить' }}
          <template #trailing>
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
              class="h-3.5 w-3.5" aria-hidden="true"
            >
              <path d="M3 12a9 9 0 0 1 15.6-6.1L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-15.6 6.1L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
          </template>
        </AppButton>
      </div>
    </SectionHeader>

    <!-- stat strip -->
    <div class="grid gap-3 md:grid-cols-4">
      <StatTile
        label="Всего"
        :value="total"
        hint="бронирований"
      />
      <StatTile
        label="Впереди"
        :value="upcoming"
        hint="ещё не состоялось"
      />
      <StatTile
        label="Гостей"
        :value="uniqueGuests"
        hint="уникальных email"
      />
      <StatTile
        label="Ближайшая"
        :value="nextBooking ? formatDateTime(nextBooking.startTime) : '—'"
        :hint="nextBooking ? (eventTypeMap.get(nextBooking.eventTypeId) ?? '') : ''"
      />
    </div>

    <!-- table -->
    <div v-if="bookingsQ.isLoading.value && !bookingsQ.data.value" class="bento flex flex-col gap-3" aria-hidden="true">
      <SkeletonBlock v-for="i in 4" :key="i" height="36px" />
    </div>
    <AppAlert v-else-if="bookingsQ.error.value" severity="error">
      {{ bookingsQ.error.value.message }}
    </AppAlert>
    <AppEmptyState
      v-else-if="sorted.length === 0"
      title="Бронирований пока нет"
    >
      Как только гости начнут записываться, их встречи появятся здесь.
    </AppEmptyState>
    <div
      v-else
      class="overflow-hidden rounded-2xl border hairline bg-surface-elevated"
    >
      <div class="hidden grid-cols-[1.2fr_1.3fr_1.3fr_1fr] border-b hairline bg-surface-muted px-5 py-3 md:grid">
        <span class="eyebrow">Когда</span>
        <span class="eyebrow">Тип события</span>
        <span class="eyebrow">Гость</span>
        <span class="eyebrow text-right">Email</span>
      </div>
      <ul class="divide-y divide-[color:var(--color-hairline)]">
        <li
          v-for="b in sorted"
          :key="b.id"
          class="grid gap-2 px-5 py-4 transition-colors hover:bg-surface md:grid-cols-[1.2fr_1.3fr_1.3fr_1fr] md:items-center md:gap-4"
        >
          <div class="flex items-center gap-2.5">
            <span
              class="h-8 w-1 rounded-full"
              :class="isPast(b.startTime) ? 'bg-ink-faint/40' : 'bg-accent'"
              aria-hidden="true"
            />
            <div class="flex flex-col leading-tight">
              <span class="font-medium text-ink">
                {{ formatDateTime(b.startTime) }}
              </span>
              <span v-if="isPast(b.startTime)" class="text-[11px] uppercase tracking-wider text-ink-faint">
                прошла
              </span>
              <span v-else class="text-[11px] uppercase tracking-wider text-accent">
                впереди
              </span>
            </div>
          </div>
          <div class="text-sm text-ink">
            <span class="md:hidden eyebrow mr-1">Тип:</span>
            {{ eventTypeMap.get(b.eventTypeId) ?? b.eventTypeId }}
          </div>
          <div class="flex items-center gap-2.5 text-sm text-ink">
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[11px] font-medium text-ink"
              aria-hidden="true"
            >
              {{ guestInitials(b.guestName) }}
            </span>
            <span>{{ b.guestName }}</span>
          </div>
          <div class="truncate text-xs text-ink-soft md:text-right">
            {{ b.guestEmail }}
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
