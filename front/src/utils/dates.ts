import type { Slot } from '@/services/api'

export interface DayBucket {
  date: Date
  key: string
  slots: Slot[]
}

const DAY_MS = 24 * 60 * 60 * 1000
export const BOOKING_WINDOW_DAYS = 14

function atMidnight(d: Date): Date {
  const copy = new Date(d)
  copy.setHours(0, 0, 0, 0)
  return copy
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Empty days are included so the calendar can render them as disabled.
export function groupSlotsByDay(slots: Slot[] | undefined, today: Date = new Date()): DayBucket[] {
  const start = atMidnight(today)
  const buckets: DayBucket[] = []
  const index = new Map<string, DayBucket>()

  for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
    const date = new Date(start.getTime() + i * DAY_MS)
    const bucket: DayBucket = { date, key: dayKey(date), slots: [] }
    buckets.push(bucket)
    index.set(bucket.key, bucket)
  }

  for (const slot of slots ?? []) {
    const slotDate = new Date(slot.startTime)
    const bucket = index.get(dayKey(slotDate))
    if (bucket)
      bucket.slots.push(slot)
  }

  for (const bucket of buckets) {
    bucket.slots.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  return buckets
}

const dayFmt = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
})

const dayLongFmt = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
})

const timeFmt = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
})

const dateTimeFmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDayShort(d: Date): string {
  return dayFmt.format(d)
}

export function formatDayLong(d: Date): string {
  return dayLongFmt.format(d)
}

export function formatTime(iso: string): string {
  return timeFmt.format(new Date(iso))
}

export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso))
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b)
}
