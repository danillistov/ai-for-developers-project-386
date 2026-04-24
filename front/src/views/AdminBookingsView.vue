<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { Button } from '@vuetify/v0'
import { computed } from 'vue'
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
      <Button.Root
        type="button"
        class="rounded-md border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50"
        :disabled="bookingsQ.isLoading.value"
        @click="bookingsQ.refresh()"
      >
        <Button.Content>
          {{ bookingsQ.isLoading.value ? 'Обновление…' : 'Обновить' }}
        </Button.Content>
      </Button.Root>
    </header>

    <div v-if="bookingsQ.isLoading.value && !bookingsQ.data.value" class="text-sm opacity-70">
      Загрузка…
    </div>
    <p
      v-else-if="bookingsQ.error.value"
      class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      role="alert"
    >
      {{ bookingsQ.error.value.message }}
    </p>
    <p
      v-else-if="sorted.length === 0"
      class="rounded-md border border-dashed border-black/10 p-6 text-center text-sm opacity-70"
    >
      Бронирований пока нет.
    </p>
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
