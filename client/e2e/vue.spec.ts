import { test, expect } from '@playwright/test'

test('visits the home page and shows the hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Master Technical Interviews')
  await expect(page.getByRole('link', { name: /Start Studying/i })).toBeVisible()
})

test('navigates to the study view and shows a flashcard', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Start Studying/i }).click()
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

test('toggles the light theme', async ({ page }) => {
  await page.goto('/')
  await page.locator('button[title]').click()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('light')
})

test('creates and deletes a card', async ({ page }) => {
  await page.goto('/manage')
  // wait for the lazy chunk + store hydration before snapshotting the count
  await expect(page.locator('.card-row').first()).toBeVisible()
  const before = await page.locator('.card-row').count()

  await page
    .getByRole('button', { name: /New Card/i })
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
  await expect(page.getByRole('heading', { name: /Manage Cards/i })).toBeVisible()

  await page
    .getByRole('button', { name: /New Card/i })
    .first()
    .click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText(/New Card/i)
})
