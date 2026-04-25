import type { EventType } from '@/services/api'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { eventTypesApi, HttpError } from '@/services/api'

describe('services/api', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    fetchMock.mockReset()
    vi.unstubAllGlobals()
  })

  it('returns typed payload on success', async () => {
    const payload: EventType[] = [
      { id: 'et_1', name: 'Intro', duration: 30 },
    ]
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(payload), { status: 200 }))

    const result = await eventTypesApi.list()

    expect(result).toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/event-types',
      expect.objectContaining({ headers: expect.objectContaining({ 'Content-Type': 'application/json' }) }),
    )
  })

  it('throws HttpError with parsed ApiError body on 4xx', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ code: 'booking_conflict', message: 'Overlap' }),
        { status: 409 },
      ),
    )

    await expect(eventTypesApi.list()).rejects.toMatchObject({
      name: 'HttpError',
      status: 409,
      payload: { code: 'booking_conflict', message: 'Overlap' },
      message: 'Overlap',
    })
  })

  it('httpError is catchable by class', async () => {
    fetchMock.mockResolvedValueOnce(new Response('oops', { status: 500 }))

    try {
      await eventTypesApi.list()
    }
    catch (e) {
      expect(e).toBeInstanceOf(HttpError)
      expect((e as HttpError).status).toBe(500)
    }
  })
})
