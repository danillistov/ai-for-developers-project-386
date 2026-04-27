import type { APIRequestContext } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const BACKEND_URL = 'http://localhost:4010'
export const FRONTEND_URL = 'http://localhost:5173'

export interface Fixtures {
  eventTypeId: string
  eventTypeName: string
  eventTypeDuration: number
}

const FIXTURE_PATH = resolve(__dirname, '.fixtures.json')

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
