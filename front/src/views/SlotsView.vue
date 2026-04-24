<script setup lang="ts">
import type { BookingCreate, Slot } from '@/services/api'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { computed, reactive, shallowRef } from 'vue'
import { RouterLink } from 'vue-router'
import { bookingsApi, eventTypesApi } from '@/services/api'

const props = defineProps<{ id: string }>()

const queryCache = useQueryCache()

const eventTypeQ = useQuery({
  key: () => ['event-types'],
  query: () => eventTypesApi.list(),
})

const eventType = computed(() =>
  eventTypeQ.data.value?.find(et => et.id === props.id),
)

const slotsQ = useQuery({
  key: () => ['event-types', props.id, 'slots'],
  query: () => eventTypesApi.listSlots(props.id),
})

const selected = shallowRef<Slot | null>(null)

const form = reactive({
  guestName: '',
  guestEmail: '',
})

const { mutate: book, isLoading: booking, error: bookError } = useMutation({
  mutation: (body: BookingCreate) => bookingsApi.create(body),
  onSuccess: () => {
    queryCache.invalidateQueries({ key: ['event-types', props.id, 'slots'] })
    queryCache.invalidateQueries({ key: ['bookings'] })
    selected.value = null
    form.guestName = ''
    form.guestEmail = ''
  },
})

function confirmBooking() {
  if (!selected.value || !form.guestName.trim() || !form.guestEmail.trim())
    return
  book({
    eventTypeId: props.id,
    guestName: form.guestName.trim(),
    guestEmail: form.guestEmail.trim(),
    startTime: selected.value.startTime,
    endTime: selected.value.endTime,
  })
}

const fmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})
</script>

<template>
  <section class="flex flex-col gap-6">
    <header>
      <RouterLink to="/event-types" class="text-sm text-primary hover:underline">
        ← К списку event types
      </RouterLink>
      <h2 class="mt-1 text-2xl font-semibold">
        {{ eventType?.name ?? 'Слоты' }}
      </h2>
      <p v-if="eventType" class="text-sm opacity-75">
        {{ eventType.duration }} мин · Свободные окна на ближайшие 14 дней
      </p>
    </header>

    <div v-if="slotsQ.isLoading.value" class="text-sm opacity-70">
      Загрузка слотов…
    </div>
    <div v-else-if="slotsQ.error.value" class="text-sm text-red-600">
      {{ slotsQ.error.value.message }}
    </div>
    <div v-else-if="!slotsQ.data.value || slotsQ.data.value.length === 0" class="text-sm opacity-70">
      Свободных слотов нет.
    </div>
    <ul v-else class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2">
      <li v-for="slot in slotsQ.data.value" :key="slot.startTime">
        <button
          type="button"
          class="w-full rounded border border-black/10 px-3 py-2 text-left text-sm hover:border-primary"
          :class="{ 'border-primary bg-primary/10': selected?.startTime === slot.startTime }"
          @click="selected = slot"
        >
          {{ fmt.format(new Date(slot.startTime)) }}
          <span class="block text-xs opacity-60">
            до {{ fmt.format(new Date(slot.endTime)) }}
          </span>
        </button>
      </li>
    </ul>

    <form
      v-if="selected"
      class="grid gap-3 rounded-md border border-black/10 p-4 md:grid-cols-[1fr_1fr_auto]"
      @submit.prevent="confirmBooking"
    >
      <div class="text-sm md:col-span-3">
        Выбранный слот: <strong>{{ fmt.format(new Date(selected.startTime)) }}</strong>
      </div>
      <label class="flex flex-col gap-1 text-sm">
        <span>Имя</span>
        <input v-model="form.guestName" required class="rounded border border-black/15 px-2 py-1">
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span>Email</span>
        <input v-model="form.guestEmail" type="email" required class="rounded border border-black/15 px-2 py-1">
      </label>
      <button
        type="submit"
        :disabled="booking"
        class="self-end rounded bg-primary px-4 py-1.5 text-on-primary text-sm disabled:opacity-50"
      >
        {{ booking ? 'Бронируем…' : 'Забронировать' }}
      </button>
      <p v-if="bookError" class="text-sm text-red-600 md:col-span-3">
        {{ bookError.message }}
      </p>
    </form>
  </section>
</template>
