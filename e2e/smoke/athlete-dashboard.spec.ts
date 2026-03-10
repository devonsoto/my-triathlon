import { test, expect } from '../fixtures/app';

test.describe('Athlete Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/athlete');
  });

  test('shows athlete name', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Devon Soto' })).toBeVisible();
  });

  test('shows race label', async ({ page }) => {
    await expect(page.getByText('Sprint Triathlon · April 12, 2026')).toBeVisible();
  });

  test('shows race countdown', async ({ page }) => {
    await expect(page.getByText('Days to Race Day')).toBeVisible();
  });

  test('shows discipline cards', async ({ page }) => {
    await expect(page.getByText('Swim').first()).toBeVisible();
    await expect(page.getByText('Bike').first()).toBeVisible();
    await expect(page.getByText('Run').first()).toBeVisible();
  });

  test('shows week strip with Mon label', async ({ page }) => {
    await expect(page.getByText('Mon', { exact: true }).first()).toBeVisible();
  });
});
