import type { components } from '@/types/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export type EventType = components['schemas']['EventType']
export type EventTypeCreate = components['schemas']['EventTypeCreate']
export type Slot = components['schemas']['Slot']
export type Booking = components['schemas']['Booking']
export type BookingCreate = components['schemas']['BookingCreate']
export type ApiError = components['schemas']['ApiError']

/** Error thrown for any non-2xx response, carries parsed `ApiError` body when available. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: ApiError | null,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init.headers },
    ...init,
  })

  if (!res.ok) {
    let payload: ApiError | null = null
    try {
      payload = await res.json() as ApiError
    }
    catch { /* non-JSON error body */ }
    throw new HttpError(
      res.status,
      payload,
      payload?.message ?? `HTTP ${res.status}: ${res.statusText}`,
    )
  }

  return res.status === 204 ? (undefined as T) : await res.json() as T
}

export const eventTypesApi = {
  list: () => request<EventType[]>('/event-types'),
  create: (body: EventTypeCreate) =>
    request<EventType>('/event-types', { method: 'POST', body: JSON.stringify(body) }),
  listSlots: (id: string) => request<Slot[]>(`/event-types/${encodeURIComponent(id)}/slots`),
}

export const bookingsApi = {
  list: () => request<Booking[]>('/bookings'),
  create: (body: BookingCreate) =>
    request<Booking>('/bookings', { method: 'POST', body: JSON.stringify(body) }),
}
