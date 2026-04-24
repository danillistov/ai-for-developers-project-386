<script setup lang="ts">
import type { Slot } from '@/services/api'
import { Button } from '@vuetify/v0'
import { computed, ref } from 'vue'
import { formatDayLong, formatDayShort, formatTime, groupSlotsByDay } from '@/utils/dates'

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

const activeDay = computed(() => days.value.find(d => d.key === activeKey.value) ?? null)

function selectDay(key: string, hasSlots: boolean) {
  if (hasSlots)
    userPickedKey.value = key
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <h3 class="text-sm font-medium opacity-70">
        Выберите день (ближайшие 14 дней)
      </h3>
      <div
        class="mt-2 grid gap-2"
        style="grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));"
      >
        <Button.Root
          v-for="day in days"
          :key="day.key"
          type="button"
          :disabled="day.slots.length === 0"
          :aria-pressed="day.key === activeKey"
          class="flex flex-col items-center gap-0.5 rounded-md border px-2 py-2 text-xs transition-colors"
          :class="[
            day.key === activeKey
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-black/10 hover:border-primary/40',
            day.slots.length === 0 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
          ]"
          @click="selectDay(day.key, day.slots.length > 0)"
        >
          <Button.Content class="flex flex-col items-center">
            <span class="text-[11px] uppercase opacity-70">
              {{ formatDayShort(day.date).split(',')[0] }}
            </span>
            <span class="text-base font-semibold leading-none">
              {{ day.date.getDate() }}
            </span>
            <span class="mt-0.5 text-[10px] opacity-60">
              {{ day.slots.length ? `${day.slots.length} слот.` : 'нет' }}
            </span>
          </Button.Content>
        </Button.Root>
      </div>
    </div>

    <div v-if="activeDay">
      <h3 class="text-sm font-medium opacity-70">
        Свободное время · {{ formatDayLong(activeDay.date) }}
      </h3>
      <p
        v-if="activeDay.slots.length === 0"
        class="mt-2 rounded-md border border-dashed border-black/10 p-4 text-center text-sm opacity-60"
      >
        На этот день свободных слотов нет.
      </p>
      <div
        v-else
        class="mt-2 grid gap-2"
        style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));"
      >
        <Button.Root
          v-for="slot in activeDay.slots"
          :key="slot.startTime"
          type="button"
          :aria-pressed="props.selected?.startTime === slot.startTime"
          class="rounded-md border px-3 py-2 text-sm transition-colors"
          :class="
            props.selected?.startTime === slot.startTime
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-black/10 hover:border-primary/40'
          "
          @click="emit('select', slot)"
        >
          <Button.Content class="flex flex-col items-start">
            <span class="font-medium">{{ formatTime(slot.startTime) }}</span>
            <span class="text-xs opacity-60">
              до {{ formatTime(slot.endTime) }}
            </span>
          </Button.Content>
        </Button.Root>
      </div>
    </div>
  </div>
</template>
