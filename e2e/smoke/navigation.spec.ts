import { test, expect } from '../fixtures/app';

test.describe('Navigation', () => {
  test('home page loads athlete dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('My Triathlon')).toBeVisible();
  });

  test('athlete dashboard loads', async ({ page }) => {
    await page.goto('/athlete');
    await expect(page.getByText('My Triathlon')).toBeVisible();
  });

  test('header brand link is present', async ({ page }) => {
    await page.goto('/athlete');
    await expect(page.getByRole('link', { name: 'My Triathlon' })).toBeVisible();
  });

  test('nav links are present on dashboard', async ({ page }) => {
    await page.goto('/athlete');
    await expect(page.getByRole('link', { name: 'Journal' })).toBeVisible();
  });

  test('Journal nav link navigates to journal page', async ({ page }) => {
    await page.goto('/athlete');
    await page.getByRole('link', { name: 'Journal' }).click();
    await expect(page).toHaveURL('/athlete/journal');
    await expect(page.getByRole('heading', { name: 'Training Log' })).toBeVisible();
  });

  test('Dashboard nav link navigates back to athlete page', async ({ page }) => {
    await page.goto('/athlete/journal');
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/athlete');
  });
});
