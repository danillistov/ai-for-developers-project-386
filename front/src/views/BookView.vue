<script setup lang="ts">
import type { BookingCreate, Slot } from '@/services/api'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { Button } from '@vuetify/v0'
import { computed, ref, shallowRef } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BookingDialog from '@/components/BookingDialog.vue'
import SlotPicker from '@/components/SlotPicker.vue'
import { useNotify } from '@/composables/useNotify'
import { bookingsApi, eventTypesApi, HttpError } from '@/services/api'

const props = defineProps<{ id: string }>()

const router = useRouter()
const queryCache = useQueryCache()
const notify = useNotify()

const eventTypesQ = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})

const eventType = computed(() =>
  eventTypesQ.data.value?.find(et => et.id === props.id) ?? null,
)

const slotsQ = useQuery({
  key: () => ['event-types', props.id, 'slots'],
  query: () => eventTypesApi.listSlots(props.id),
})

const selected = shallowRef<Slot | null>(null)
const dialogOpen = ref(false)

function onSlotSelect(slot: Slot) {
  selected.value = slot
  dialogOpen.value = true
}

const { mutate: book, isLoading: booking, error: bookError, reset: resetMutation } = useMutation({
  mutation: (body: BookingCreate) => bookingsApi.create(body),
  onSuccess: (created) => {
    queryCache.invalidateQueries({ key: ['event-types', props.id, 'slots'] })
    queryCache.invalidateQueries({ key: ['bookings'] })
    dialogOpen.value = false
    selected.value = null
    notify.success(
      'Бронирование создано',
      `Ждём вас ${new Date(created.startTime).toLocaleString('ru-RU')}`,
    )
    router.push({ name: 'home' })
  },
  onError: (err) => {
    if (err instanceof HttpError && err.status === 409)
      notify.error('Слот только что заняли', 'Выберите другое время — список обновлён.')
    else
      notify.error('Не удалось создать бронь', err.message)

    if (err instanceof HttpError && (err.status === 409 || err.status === 400))
      queryCache.invalidateQueries({ key: ['event-types', props.id, 'slots'] })
  },
})

const serverError = computed(() => {
  const err = bookError.value
  if (!err)
    return null
  if (err instanceof HttpError && err.status === 409)
    return 'Это время уже занято. Выберите другое.'
  return err.message
})

function confirmBooking(guest: { guestName: string, guestEmail: string }) {
  if (!selected.value || !eventType.value)
    return
  book({
    eventTypeId: eventType.value.id,
    guestName: guest.guestName,
    guestEmail: guest.guestEmail,
    startTime: selected.value.startTime,
    endTime: selected.value.endTime,
  })
}

function onDialogOpen(open: boolean) {
  dialogOpen.value = open
  if (!open)
    resetMutation()
}
</script>

<template>
  <section class="flex flex-col gap-6">
    <header class="flex flex-col gap-1">
      <RouterLink to="/" class="text-sm text-primary hover:underline">
        ← К каталогу
      </RouterLink>
      <h2 class="text-2xl font-semibold">
        {{ eventType?.name ?? 'Бронирование' }}
      </h2>
      <p v-if="eventType" class="text-sm opacity-75">
        {{ eventType.duration }} мин · свободные окна на ближайшие 14 дней
      </p>
      <p v-if="eventType?.description" class="text-sm opacity-80">
        {{ eventType.description }}
      </p>
    </header>

    <div v-if="eventTypesQ.isLoading.value && !eventType" class="text-sm opacity-70">
      Загрузка…
    </div>
    <div
      v-else-if="!eventType"
      class="rounded-md border border-dashed border-black/10 p-6 text-center text-sm opacity-70"
    >
      Такого типа события не существует.
      <div class="mt-2">
        <Button.Root
          :as="RouterLink"
          to="/"
          class="text-primary underline"
        >
          <Button.Content>Вернуться к каталогу</Button.Content>
        </Button.Root>
      </div>
    </div>
    <div v-else-if="slotsQ.isLoading.value && !slotsQ.data.value" class="text-sm opacity-70">
      Загружаем свободные слоты…
    </div>
    <div
      v-else-if="slotsQ.error.value"
      class="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      role="alert"
    >
      Не удалось получить слоты: {{ slotsQ.error.value.message }}
    </div>
    <SlotPicker
      v-else
      :slots="slotsQ.data.value"
      :selected="selected"
      @select="onSlotSelect"
    />

    <BookingDialog
      :open="dialogOpen"
      :event-type="eventType"
      :slot-value="selected"
      :submitting="booking"
      :server-error="serverError"
      @update:open="onDialogOpen"
      @confirm="confirmBooking"
    />
  </section>
</template>
