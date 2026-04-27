import type { APIRequestContext } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

export const BACKEND_URL = 'http://localhost:4010'
export const FRONTEND_URL = 'http://localhost:5173'

export interface Fixtures {
  eventTypeId: string
  eventTypeName: string
  eventTypeDuration: number
}

// Avoid `__dirname`: Playwright’s TS transform can make it point at a temp dir, not `e2e/`.
function e2eDirFromCwd(): string {
  const cwd = process.cwd()
  return basename(cwd) === 'e2e' ? cwd : join(cwd, 'e2e')
}

export const FIXTURE_PATH = join(e2eDirFromCwd(), '.fixtures.json')

export function loadFixtures(): Fixtures {
  const raw = readFileSync(FIXTURE_PATH, 'utf8')
  return JSON.parse(raw) as Fixtures
}

export async function bookSlotViaApi(
  request: APIRequestContext,
  params: {
    eventTypeId: string
    startTime: string
    endTime: string
    guestName?: string
    guestEmail?: string
  },
): Promise<void> {
  const res = await request.post(`${BACKEND_URL}/bookings`, {
    data: {
      eventTypeId: params.eventTypeId,
      guestName: params.guestName ?? 'Race Winner',
      guestEmail: params.guestEmail ?? 'race-winner@example.com',
      startTime: params.startTime,
      endTime: params.endTime,
    },
  })
  if (!res.ok()) {
    throw new Error(
      `bookSlotViaApi failed: ${res.status()} ${await res.text()}`,
    )
  }
}

export interface ApiSlot {
  startTime: string
  endTime: string
}

export async function getFirstAvailableSlotViaApi(
  request: APIRequestContext,
  eventTypeId: string,
): Promise<ApiSlot> {
  const res = await request.get(`${BACKEND_URL}/event-types/${eventTypeId}/slots`)
  if (!res.ok()) {
    throw new Error(
      `getFirstAvailableSlotViaApi failed: ${res.status()} ${await res.text()}`,
    )
  }
  const slots = (await res.json()) as ApiSlot[]
  if (slots.length === 0)
    throw new Error(`getFirstAvailableSlotViaApi: no slots for event type ${eventTypeId}`)
  return slots[0]
}
