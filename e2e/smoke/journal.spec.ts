import { test, expect } from '../fixtures/app';

test.describe('Journal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/athlete/journal');
  });

  test('shows Training Log heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Training Log' })).toBeVisible();
  });

  test('shows discipline filter with All pill', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'All' }).first()).toBeVisible();
  });

  test('shows mood filter with All moods pill', async ({ page }) => {
    await expect(page.getByText('All moods')).toBeVisible();
  });

  test('shows floating new entry button', async ({ page }) => {
    await expect(page.getByRole('button', { name: '+' })).toBeVisible();
  });

  test('FAB opens new entry form', async ({ page }) => {
    await page.getByRole('button', { name: '+' }).click();
    await expect(page.getByRole('heading', { name: 'New Entry' })).toBeVisible();
  });

  test('new entry form has title input', async ({ page }) => {
    await page.getByRole('button', { name: '+' }).click();
    await expect(page.getByPlaceholder('What did you work on?')).toBeVisible();
  });

  test('new entry form has back button', async ({ page }) => {
    await page.getByRole('button', { name: '+' }).click();
    await expect(page.getByRole('button', { name: /← Back/ })).toBeVisible();
  });

  test('back button returns to list view', async ({ page }) => {
    await page.getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: /← Back/ }).click();
    await expect(page.getByRole('heading', { name: 'Training Log' })).toBeVisible();
  });
});
