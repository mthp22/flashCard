import { test, expect } from '@playwright/test'

test('visits the home page and shows the hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText(/drawer of \d+ interview cards/)
  await expect(page.getByRole('link', { name: /Open the drawer/i }).first()).toBeVisible()
})

test('navigates to the study view and shows a flashcard', async ({ page }) => {
  await page.goto('/')
  await page
    .getByRole('link', { name: /Open the drawer/i })
    .first()
    .click()
  await expect(page.locator('.code-card')).toBeVisible()

  const counter = page.locator('.navigation .btn-secondary')
  await expect(counter).toHaveText(/\d+ \/ \d+/)
})

test('flips the card with GSAP and navigates with Next', async ({ page }) => {
  await page.goto('/flashcards')
  const card = page.locator('.code-card')
  await expect(card).toBeVisible()

  const before = await card.evaluate((el) => getComputedStyle(el).transform)
  await card.click()
  await expect
    .poll(async () => card.evaluate((el) => getComputedStyle(el).transform))
    .not.toBe(before)

  await page.locator('.navigation button', { hasText: 'Next' }).click()
  await expect(page.locator('.navigation .btn-secondary')).toHaveText('2 / 21')
})

test('animates the progress bar', async ({ page }) => {
  await page.goto('/flashcards')
  const bar = page.locator('.progress-bar').first()
  await expect.poll(async () => bar.evaluate((el) => (el as HTMLElement).style.width)).not.toBe('')
})

test('reveals every section when scrolling to the bottom', async ({ page }) => {
  await page.goto('/')
  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y)
    await page.waitForTimeout(80)
  }
  // the last sections must actually reveal (opacity, not just layout)
  const drawers = page.locator('.section-title', { hasText: 'The drawers' })
  const colophon = page.locator('.colophon-section .reveal-item').first()
  await expect.poll(async () => drawers.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
  await expect.poll(async () => colophon.evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
})

test('toggles between paper and dim themes', async ({ page }) => {
  await page.goto('/')
  // paper is the default
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('light')
  await page.locator('button[title]').click()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
})

test('creates and deletes a card', async ({ page }) => {
  await page.goto('/manage')
  // wait for the lazy chunk + store hydration before snapshotting the count
  await expect(page.locator('.card-row').first()).toBeVisible()
  const before = await page.locator('.card-row').count()

  await page
    .getByRole('button', { name: /Add a card/i })
    .first()
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()

  await page.getByLabel('Question').fill('What is an effect?')
  await page.getByLabel('Answer').fill('A function that re-runs when its signals change.')
  await page.getByLabel('Category', { exact: true }).selectOption('javascript')
  await dialog.getByRole('button', { name: /Create/ }).click()

  await expect(page.locator('.card-row')).toHaveCount(before + 1)

  await page
    .locator('.card-row')
    .first()
    .getByRole('button', { name: /Delete/i })
    .click()
  await expect(page.locator('.card-row')).toHaveCount(before)
})

test('manage view lists cards and opens the create modal', async ({ page }) => {
  await page.goto('/manage')
  await expect(page.getByRole('heading', { name: /The catalog/i })).toBeVisible()

  await page
    .getByRole('button', { name: /Add a card/i })
    .first()
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText(/New Card/i)
})
