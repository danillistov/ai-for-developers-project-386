<script setup lang="ts">
import type { Slot } from '@/services/api'
import { Button } from '@vuetify/v0'
import { computed, ref } from 'vue'
import { formatDayLong, formatTime, groupSlotsByDay } from '@/utils/dates'

const props = defineProps<{
  slots: Slot[] | undefined
  selected: Slot | null
}>()

const emit = defineEmits<{
  select: [slot: Slot]
}>()

const days = computed(() => groupSlotsByDay(props.slots))

const userPickedKey = ref<string | null>(null)

const activeKey = computed(() => {
  const list = days.value
  if (userPickedKey.value && list.some(d => d.key === userPickedKey.value))
    return userPickedKey.value
  return list.find(d => d.slots.length > 0)?.key ?? list[0]?.key ?? null
})

const activeDay = computed(
  () => days.value.find(d => d.key === activeKey.value) ?? null,
)

const weekdayShort = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })

const totalFree = computed(() => days.value.reduce((sum, d) => sum + d.slots.length, 0))
const firstAvailable = computed(() => days.value.find(d => d.slots.length > 0) ?? null)

function selectDay(key: string, hasSlots: boolean) {
  if (hasSlots)
    userPickedKey.value = key
}
</script>

<template>
  <div class="bento flex flex-col gap-6">
    <header class="flex flex-wrap items-end justify-between gap-3 border-b hairline pb-4">
      <div>
        <span class="eyebrow">Доступные окна</span>
        <h3 class="font-display text-2xl text-ink">
          Ближайшие 14 дней
        </h3>
      </div>
      <dl class="flex flex-wrap items-center gap-6 text-xs text-ink-soft">
        <div class="flex flex-col">
          <dt class="eyebrow">
            Всего
          </dt>
          <dd class="font-display text-xl text-ink">
            {{ totalFree }}
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="eyebrow">
            Ближайшее
          </dt>
          <dd class="font-medium text-ink">
            {{ firstAvailable ? formatDayLong(firstAvailable.date) : 'нет' }}
          </dd>
        </div>
      </dl>
    </header>

    <!-- day strip -->
    <div>
      <div class="mb-2 flex items-center justify-between">
        <span class="eyebrow">День</span>
      </div>
      <div
        class="grid gap-1.5"
        style="grid-template-columns: repeat(auto-fill, minmax(58px, 1fr));"
      >
        <Button.Root
          v-for="day in days"
          :key="day.key"
          type="button"
          :disabled="day.slots.length === 0"
          :aria-pressed="day.key === activeKey"
          class="flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 transition-colors"
          :class="[
            day.key === activeKey
              ? 'border-ink bg-primary text-on-primary'
              : 'border-[color:var(--color-hairline)] bg-surface-elevated hover:border-ink/30',
            day.slots.length === 0 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
          ]"
          @click="selectDay(day.key, day.slots.length > 0)"
        >
          <Button.Content class="flex flex-col items-center leading-none">
            <span class="text-[10px] uppercase tracking-wider opacity-70">
              {{ weekdayShort.format(day.date) }}
            </span>
            <span class="mt-1 font-display text-lg">
              {{ day.date.getDate() }}
            </span>
            <span
              class="mt-1 text-[10px]"
              :class="day.key === activeKey ? 'opacity-80' : 'opacity-60'"
            >
              {{ day.slots.length || '—' }}
            </span>
          </Button.Content>
        </Button.Root>
      </div>
    </div>

    <!-- time slots -->
    <div v-if="activeDay">
      <div class="mb-2 flex items-baseline justify-between">
        <span class="eyebrow">Время · {{ formatDayLong(activeDay.date) }}</span>
        <span class="text-xs text-ink-faint">
          {{ activeDay.slots.length }} {{ activeDay.slots.length === 1 ? 'окно' : 'окон' }}
        </span>
      </div>

      <p
        v-if="activeDay.slots.length === 0"
        class="rounded-xl border border-dashed border-[color:var(--color-hairline)] bg-surface p-5 text-center text-sm text-ink-soft"
      >
        На этот день свободных слотов нет. Выберите другой день.
      </p>

      <div
        v-else
        class="grid gap-2"
        style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));"
      >
        <Button.Root
          v-for="slot in activeDay.slots"
          :key="slot.startTime"
          type="button"
          :aria-pressed="props.selected?.startTime === slot.startTime"
          class="flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors"
          :class="
            props.selected?.startTime === slot.startTime
              ? 'border-accent bg-[color:var(--color-accent-soft)] text-[#7a2f15]'
              : 'border-[color:var(--color-hairline)] bg-surface-elevated hover:border-ink/30'
          "
          @click="emit('select', slot)"
        >
          <Button.Content class="flex w-full flex-col items-start leading-tight">
            <span class="font-medium">{{ formatTime(slot.startTime) }}</span>
            <span class="text-[11px] text-ink-faint">до {{ formatTime(slot.endTime) }}</span>
          </Button.Content>
        </Button.Root>
      </div>
    </div>
  </div>
</template>
