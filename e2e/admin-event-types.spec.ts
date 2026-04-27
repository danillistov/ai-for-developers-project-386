import { expect, test } from '@playwright/test'

test.describe('Admin event types — main user scenarios', () => {
  test('S3: admin creates an event type and a guest sees it on the home page', async ({ page }) => {
    const uniqueName = `E2E услуга ${Date.now()}`

    // 1. Open admin form
    await page.goto('/admin/event-types')
    await expect(page.getByRole('heading', { name: 'Event types' })).toBeVisible()

    // 2. Fill the form (duration default = 30 min, description is optional)
    await page.getByPlaceholder('Например, «Консультация»').fill(uniqueName)

    // 3. Submit and confirm success snackbar
    await page.getByRole('button', { name: 'Добавить тип' }).click()
    const successSnackbar = page
      .locator('[data-test="snackbar"]')
      .filter({ hasText: 'Тип события создан' })
    await expect(successSnackbar).toBeVisible()

    // 4. Owner-side: the new card is visible in the existing types catalog
    await expect(
      page.locator('section').filter({ hasText: 'Существующие типы' }).getByText(uniqueName),
    ).toBeVisible()

    // 5. Guest-side: the new event type appears on the public home catalog
    await page.goto('/')
    await expect(page.getByText(uniqueName).first()).toBeVisible()
  })
})
