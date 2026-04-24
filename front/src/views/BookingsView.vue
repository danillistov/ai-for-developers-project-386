<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { computed } from 'vue'
import { bookingsApi, eventTypesApi } from '@/services/api'

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

const fmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
</script>

<template>
  <section class="flex flex-col gap-4">
    <header>
      <h2 class="text-2xl font-semibold">
        Bookings
      </h2>
      <p class="text-sm opacity-75">
        Админская выдача: все будущие бронирования, отсортированные по времени.
      </p>
    </header>

    <p v-if="bookingsQ.isLoading.value" class="text-sm opacity-70">
      Загрузка…
    </p>
    <p v-else-if="bookingsQ.error.value" class="text-sm text-red-600">
      {{ bookingsQ.error.value.message }}
    </p>
    <p v-else-if="!bookingsQ.data.value || bookingsQ.data.value.length === 0" class="text-sm opacity-70">
      Бронирований пока нет.
    </p>
    <table v-else class="w-full border-collapse text-sm">
      <thead>
        <tr class="border-b border-black/10 text-left">
          <th class="py-2 font-medium">
            Когда
          </th>
          <th class="py-2 font-medium">
            Тип события
          </th>
          <th class="py-2 font-medium">
            Гость
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="b in bookingsQ.data.value"
          :key="b.id"
          class="border-b border-black/5"
        >
          <td class="py-2">
            {{ fmt.format(new Date(b.startTime)) }}
          </td>
          <td class="py-2">
            {{ eventTypeMap.get(b.eventTypeId) ?? b.eventTypeId }}
          </td>
          <td class="py-2">
            {{ b.guestName }}
            <span class="text-xs opacity-60">· {{ b.guestEmail }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
