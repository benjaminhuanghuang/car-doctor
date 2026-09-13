import { test, expect } from '@playwright/test';

test.describe('unauthenticated visitor', () => {
  test('is redirected from a protected route to the login page', async ({ page }) => {
    await page.goto('/cars');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });

  test('sees the email and password fields on the login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('can navigate to the register page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /sign up|register|create/i }).click();
    await expect(page).toHaveURL(/\/register$/);
  });
});
