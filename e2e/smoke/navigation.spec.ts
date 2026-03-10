import { test, expect } from '../fixtures/app';

test.describe('Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
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
    await expect(page.getByRole('link', { name: 'Mental' })).toBeVisible();
  });

  test('Journal nav link navigates to journal page', async ({ page }) => {
    await page.goto('/athlete');
    await page.getByRole('link', { name: 'Journal' }).click();
    await expect(page).toHaveURL('/athlete/journal');
    await expect(page.getByRole('heading', { name: 'Training Log' })).toBeVisible();
  });

  test('Mental nav link navigates to mental page', async ({ page }) => {
    await page.goto('/athlete');
    await page.getByRole('link', { name: 'Mental' }).click();
    await expect(page).toHaveURL('/athlete/mental');
  });

  test('Dashboard nav link navigates back to athlete page', async ({ page }) => {
    await page.goto('/athlete/journal');
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL('/athlete');
  });
});
