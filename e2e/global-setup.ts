import type { FullConfig } from '@playwright/test'
import { request } from '@playwright/test'
import { writeFileSync } from 'node:fs'
import { BACKEND_URL, type Fixtures, FIXTURE_PATH } from './helpers'

export default async function globalSetup(_config: FullConfig): Promise<void> {
  const ctx = await request.newContext()

  // Best-effort wait for the backend to be reachable. Playwright's webServer
  // already polls the URL, but on a cold CI the first request can race.
  await waitForBackend(ctx)

  const eventTypeName = `E2E встреча ${Date.now()}`
  const eventTypeDuration = 30

  const res = await ctx.post(`${BACKEND_URL}/event-types`, {
    data: {
      name: eventTypeName,
      description: 'Создан автоматически глобальной настройкой Playwright.',
      duration: eventTypeDuration,
    },
  })
  if (!res.ok()) {
    throw new Error(
      `globalSetup: failed to seed event type: ${res.status()} ${await res.text()}`,
    )
  }
  const created = (await res.json()) as { id: string }

  const fixtures: Fixtures = {
    eventTypeId: created.id,
    eventTypeName,
    eventTypeDuration,
  }
  writeFileSync(FIXTURE_PATH, JSON.stringify(fixtures, null, 2), 'utf8')

  await ctx.dispose()
}

async function waitForBackend(ctx: import('@playwright/test').APIRequestContext): Promise<void> {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    try {
      const res = await ctx.get(`${BACKEND_URL}/event-types`)
      if (res.ok())
        return
    }
    catch {
      // ignore connection errors
    }
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error('globalSetup: backend at :4010 never became reachable')
}
