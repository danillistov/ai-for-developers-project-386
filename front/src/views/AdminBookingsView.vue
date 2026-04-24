<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { computed } from 'vue'
import AppAlert from '@/components/AppAlert.vue'
import AppButton from '@/components/AppButton.vue'
import AppEmptyState from '@/components/AppEmptyState.vue'
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
</script>

<template>
  <section class="flex flex-col gap-4">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-2xl font-semibold">
          Предстоящие встречи
        </h2>
        <p class="text-sm opacity-75">
          Все бронирования по всем типам событий, по возрастанию времени.
        </p>
      </div>
      <AppButton
        variant="outline"
        :disabled="bookingsQ.isLoading.value"
        @click="bookingsQ.refresh()"
      >
        {{ bookingsQ.isLoading.value ? 'Обновление…' : 'Обновить' }}
      </AppButton>
    </header>

    <p v-if="bookingsQ.isLoading.value && !bookingsQ.data.value" class="text-sm opacity-70" role="status" aria-live="polite">
      Загрузка…
    </p>
    <AppAlert v-else-if="bookingsQ.error.value" severity="error">
      {{ bookingsQ.error.value.message }}
    </AppAlert>
    <AppEmptyState v-else-if="sorted.length === 0">
      Бронирований пока нет.
    </AppEmptyState>
    <div v-else class="overflow-x-auto rounded-lg border border-black/10">
      <table class="w-full border-collapse text-sm">
        <thead class="bg-black/5 text-left">
          <tr>
            <th class="px-3 py-2 font-medium">
              Когда
            </th>
            <th class="px-3 py-2 font-medium">
              Тип события
            </th>
            <th class="px-3 py-2 font-medium">
              Гость
            </th>
            <th class="px-3 py-2 font-medium">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="b in sorted"
            :key="b.id"
            class="border-t border-black/5 hover:bg-black/[0.02]"
          >
            <td class="px-3 py-2 whitespace-nowrap font-medium">
              {{ formatDateTime(b.startTime) }}
            </td>
            <td class="px-3 py-2">
              {{ eventTypeMap.get(b.eventTypeId) ?? b.eventTypeId }}
            </td>
            <td class="px-3 py-2">
              {{ b.guestName }}
            </td>
            <td class="px-3 py-2 text-xs opacity-70">
              {{ b.guestEmail }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
