import { expect, test } from '@playwright/test'
import { BACKEND_URL, bookSlotViaApi, loadFixtures } from './helpers'

const fixtures = loadFixtures()

test.describe('Calendar booking — main user scenarios', () => {
  test('S1: guest books an available slot via the catalog', async ({ page, request }) => {
    const guestName = 'Алиса Тестовая'
    const guestEmail = `alice-${Date.now()}@example.com`

    // 1. Catalog
    await page.goto('/')
    const card = page.locator(`[data-event-type-id="${fixtures.eventTypeId}"]`)
    await expect(card).toBeVisible()

    // 2. Open booking page
    await card.getByRole('link', { name: /Выбрать слот/i }).click()
    await expect(page).toHaveURL(new RegExp(`/book/${fixtures.eventTypeId}$`))

    // 3. Pick first available slot
    const slotButton = page.getByTestId('slot-button').first()
    await expect(slotButton).toBeVisible()
    const startTime = await slotButton.getAttribute('data-start')
    const endTime = await slotButton.getAttribute('data-end')
    expect(startTime, 'slot data-start attribute').toBeTruthy()
    expect(endTime, 'slot data-end attribute').toBeTruthy()
    await slotButton.click()

    // 4. Booking dialog
    const dialog = page.getByRole('dialog', { name: /Забронировать встречу/i })
    await expect(dialog).toBeVisible()
    await dialog.getByPlaceholder('Как к вам обращаться?').fill(guestName)
    await dialog.getByPlaceholder('you@example.com').fill(guestEmail)
    await dialog.getByRole('button', { name: 'Подтвердить' }).click()

    // 5. Success: redirect to home + success snackbar
    await expect(page).toHaveURL(/\/$/)
    const snackbar = page.locator('[data-test="snackbar"]').filter({ hasText: 'Бронирование создано' })
    await expect(snackbar).toBeVisible()

    // 6. Verify booking via backend API
    const list = await request.get(`${BACKEND_URL}/bookings`)
    expect(list.ok()).toBeTruthy()
    const bookings = (await list.json()) as Array<{
      eventTypeId: string
      guestEmail: string
      guestName: string
      startTime: string
      endTime: string
    }>
    const created = bookings.find(b => b.guestEmail === guestEmail)
    expect(created, 'booking should be visible via API').toBeDefined()
    expect(created!.eventTypeId).toBe(fixtures.eventTypeId)
    expect(created!.guestName).toBe(guestName)
    expect(new Date(created!.startTime).toISOString()).toBe(new Date(startTime!).toISOString())
    expect(new Date(created!.endTime).toISOString()).toBe(new Date(endTime!).toISOString())
  })

  test('S2: guest is told the slot was just taken when a race occurs', async ({ page, request }) => {
    await page.goto(`/book/${fixtures.eventTypeId}`)

    const slotButton = page.getByTestId('slot-button').first()
    await expect(slotButton).toBeVisible()
    const startTime = await slotButton.getAttribute('data-start')
    const endTime = await slotButton.getAttribute('data-end')
    expect(startTime).toBeTruthy()
    expect(endTime).toBeTruthy()
    await slotButton.click()

    const dialog = page.getByRole('dialog', { name: /Забронировать встречу/i })
    await expect(dialog).toBeVisible()
    await dialog.getByPlaceholder('Как к вам обращаться?').fill('Боб Опоздавший')
    await dialog.getByPlaceholder('you@example.com').fill(`bob-${Date.now()}@example.com`)

    // Simulate a competing client who books exactly the same slot first.
    await bookSlotViaApi(request, {
      eventTypeId: fixtures.eventTypeId,
      startTime: startTime!,
      endTime: endTime!,
    })

    await dialog.getByRole('button', { name: 'Подтвердить' }).click()

    // Expect the conflict snackbar surfaced by BookView.onError.
    const conflictSnackbar = page
      .locator('[data-test="snackbar"]')
      .filter({ hasText: 'Слот только что заняли' })
    await expect(conflictSnackbar).toBeVisible()

    // After the slots query is invalidated, the taken slot should disappear.
    const stillThere = page.locator(`[data-testid="slot-button"][data-start="${startTime}"]`)
    await expect(stillThere).toHaveCount(0)
  })
})
