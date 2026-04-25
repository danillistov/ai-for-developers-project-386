<script setup lang="ts">
import type { BookingCreate, Slot } from '@/services/api'
import { useMutation, useQuery, useQueryCache } from '@pinia/colada'
import { computed, ref, shallowRef } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppAlert from '@/components/AppAlert.vue'
import AppButton from '@/components/AppButton.vue'
import AppEmptyState from '@/components/AppEmptyState.vue'
import BookingDialog from '@/components/BookingDialog.vue'
import SkeletonBlock from '@/components/SkeletonBlock.vue'
import SlotPicker from '@/components/SlotPicker.vue'
import { useNotify } from '@/composables/useNotify'
import { bookingsApi, eventTypesApi, HttpError } from '@/services/api'
import { formatDateTime } from '@/utils/dates'

const props = defineProps<{ id: string }>()

const router = useRouter()
const queryCache = useQueryCache()
const notify = useNotify()

const eventTypesQ = useQuery({
  key: ['event-types'],
  query: () => eventTypesApi.list(),
})

const eventType = computed(
  () => eventTypesQ.data.value?.find(et => et.id === props.id) ?? null,
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

const {
  mutate: book,
  isLoading: booking,
  error: bookError,
  reset: resetMutation,
} = useMutation({
  mutation: (body: BookingCreate) => bookingsApi.create(body),
  onSuccess: (created) => {
    queryCache.invalidateQueries({ key: ['event-types', props.id, 'slots'] })
    queryCache.invalidateQueries({ key: ['bookings'] })
    dialogOpen.value = false
    selected.value = null
    notify.success('Бронирование создано', `Ждём вас ${formatDateTime(created.startTime)}`)
    router.push({ name: 'home' })
  },
  onError: (err) => {
    const http = err instanceof HttpError ? err : null
    if (http?.status === 409)
      notify.error('Слот только что заняли', 'Выберите другое время — список обновлён.')
    else
      notify.error('Не удалось создать бронь', err.message)

    if (http && (http.status === 409 || http.status === 400))
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
    <!-- breadcrumb + title -->
    <header class="flex flex-col gap-3">
      <RouterLink
        to="/"
        class="inline-flex w-fit items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
          class="h-3.5 w-3.5" aria-hidden="true"
        >
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        <span>К каталогу</span>
      </RouterLink>

      <div v-if="eventTypesQ.isLoading.value && !eventType" class="flex flex-col gap-2" aria-hidden="true">
        <SkeletonBlock height="14px" width="120px" />
        <SkeletonBlock height="40px" width="60%" />
      </div>

      <div v-else-if="eventType" class="flex flex-col gap-2">
        <span class="eyebrow">Бронирование</span>
        <div class="flex flex-wrap items-end justify-between gap-4">
          <h2 class="font-display text-4xl text-ink md:text-5xl">
            {{ eventType.name }}
          </h2>
          <span class="chip chip-accent">
            {{ eventType.duration }} мин
          </span>
        </div>
        <p v-if="eventType.description" class="max-w-prose text-sm text-ink-soft">
          {{ eventType.description }}
        </p>
      </div>
    </header>

    <AppEmptyState
      v-if="!eventTypesQ.isLoading.value && !eventType"
      title="Тип не найден"
      padding="lg"
    >
      Такого типа события не существует или он был удалён.
      <div class="mt-3">
        <AppButton variant="outline" size="sm" :as="RouterLink" to="/">
          Вернуться к каталогу
        </AppButton>
      </div>
    </AppEmptyState>

    <!-- content -->
    <div v-else-if="eventType" class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <!-- slot picker column -->
      <div>
        <div v-if="slotsQ.isLoading.value && !slotsQ.data.value" class="bento flex flex-col gap-4" aria-hidden="true">
          <SkeletonBlock height="16px" width="30%" />
          <SkeletonBlock height="68px" />
          <SkeletonBlock height="160px" />
        </div>
        <AppAlert v-else-if="slotsQ.error.value" severity="error">
          Не удалось получить слоты: {{ slotsQ.error.value.message }}
        </AppAlert>
        <SlotPicker
          v-else
          :slots="slotsQ.data.value"
          :selected="selected"
          @select="onSlotSelect"
        />
      </div>

      <!-- aside: info + tips -->
      <aside class="flex flex-col gap-4">
        <div class="bento flex flex-col gap-3">
          <span class="eyebrow">Как это работает</span>
          <ol class="flex flex-col gap-2.5 text-sm text-ink-soft">
            <li class="flex gap-2.5">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] text-on-primary">1</span>
              <span>Выберите день и удобное время из списка свободных окон.</span>
            </li>
            <li class="flex gap-2.5">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] text-on-primary">2</span>
              <span>Подтвердите бронь, указав имя и email для уведомления.</span>
            </li>
            <li class="flex gap-2.5">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] text-on-primary">3</span>
              <span>Получите подтверждение — мы встретимся вовремя.</span>
            </li>
          </ol>
        </div>

        <div class="bento flex flex-col gap-2">
          <span class="eyebrow">О событии</span>
          <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
            <dt class="text-ink-faint">
              Длительность
            </dt>
            <dd class="font-medium text-ink">
              {{ eventType.duration }} мин
            </dd>
            <dt class="text-ink-faint">
              Окно
            </dt>
            <dd class="font-medium text-ink">
              Ближайшие 14 дней
            </dd>
            <dt class="text-ink-faint">
              Формат
            </dt>
            <dd class="font-medium text-ink">
              Онлайн-встреча
            </dd>
          </dl>
        </div>
      </aside>
    </div>

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
