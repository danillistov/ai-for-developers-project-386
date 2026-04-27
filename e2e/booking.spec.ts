import { expect, test } from '@playwright/test'
import { BACKEND_URL, bookSlotViaApi, getFirstAvailableSlotViaApi, loadFixtures } from './helpers'

const fixtures = loadFixtures()

function isoDate(iso: string): string {
  return iso.slice(0, 10)
}

test.describe('Calendar booking — main user scenarios', () => {
  test('S1: guest books an available slot via the catalog', async ({ page, request }) => {
    const guestName = 'Алиса Тестовая'
    const guestEmail = `alice-${Date.now()}@example.com`

    // 1. Catalog
    await page.goto('/')
    const card = page.locator(`[data-event-type-id="${fixtures.eventTypeId}"]`)
    await expect(card).toBeVisible()

    // 2. Open booking page
    await card.getByRole('button', { name: /Выбрать слот/i }).click()
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

  test('S4: a booking created via API shows up in the admin /admin/bookings table', async ({ page, request }) => {
    const guestName = 'Виктор Аудитор'
    const guestEmail = `viktor-${Date.now()}@example.com`

    // 1. Reserve a slot directly through the backend (no UI).
    const slot = await getFirstAvailableSlotViaApi(request, fixtures.eventTypeId)
    await bookSlotViaApi(request, {
      eventTypeId: fixtures.eventTypeId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      guestName,
      guestEmail,
    })

    // 2. Open the admin ledger and locate the row by guest email.
    await page.goto('/admin/bookings')
    const row = page.locator('li').filter({ hasText: guestEmail })
    await expect(row).toBeVisible()

    // 3. The same row must surface the event type name and the guest name.
    await expect(row).toContainText(fixtures.eventTypeName)
    await expect(row).toContainText(guestName)
  })

  test('S5: invalid email in the booking dialog blocks submit and keeps the dialog open', async ({ page, request }) => {
    const guestName = 'Павел Невалидный'
    const invalidEmail = 'not-an-email'

    await page.goto(`/book/${fixtures.eventTypeId}`)

    const slotButton = page.getByTestId('slot-button').first()
    await expect(slotButton).toBeVisible()
    await slotButton.click()

    const dialog = page.getByRole('dialog', { name: /Забронировать встречу/i })
    await expect(dialog).toBeVisible()
    await dialog.getByPlaceholder('Как к вам обращаться?').fill(guestName)
    await dialog.getByPlaceholder('you@example.com').fill(invalidEmail)
    await dialog.getByRole('button', { name: 'Подтвердить' }).click()

    // Client-side validation must keep the dialog open and inline error visible.
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Некорректный email')).toBeVisible()

    // No success snackbar should appear (request must not have been sent).
    const successSnackbar = page
      .locator('[data-test="snackbar"]')
      .filter({ hasText: 'Бронирование создано' })
    await expect(successSnackbar).toHaveCount(0)

    // Backend must not contain a record with the invalid email.
    const list = await request.get(`${BACKEND_URL}/bookings`)
    expect(list.ok()).toBeTruthy()
    const bookings = (await list.json()) as Array<{ guestEmail: string }>
    expect(bookings.find(b => b.guestEmail === invalidEmail)).toBeUndefined()
  })

  test('S6: switching the active day in the slot picker swaps the visible slots', async ({ page }) => {
    await page.goto(`/book/${fixtures.eventTypeId}`)

    // Snapshot the first visible slot — it belongs to the currently active day.
    const firstSlot = page.getByTestId('slot-button').first()
    await expect(firstSlot).toBeVisible()
    const initialSlotStart = await firstSlot.getAttribute('data-start')
    expect(initialSlotStart).toBeTruthy()
    const initialDate = isoDate(initialSlotStart!)

    // Pick any enabled day whose key differs from the initial slot's date.
    const otherDay = page
      .locator(`[data-testid="day-button"]:not([disabled]):not([data-day-key="${initialDate}"])`)
      .first()
    await expect(otherDay).toBeVisible()
    await otherDay.click()

    // After the click, the first visible slot must belong to a different calendar date.
    await expect.poll(async () => {
      const start = await page.getByTestId('slot-button').first().getAttribute('data-start')
      return start ? isoDate(start) : null
    }).not.toBe(initialDate)
  })
})
