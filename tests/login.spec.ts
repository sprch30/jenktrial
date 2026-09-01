import { test, expect } from '@playwright/test';

test('Verify dynamic system login automation across separate environments', async ({ page }) => {
  // Navigate directly to the dynamic baseURL inherited from configuration profiles
  await page.goto('/login');

  // Read environment properties injected cleanly into process run context
  const username = process.env.USER || '';
  const password = process.env.PASS || '';

  console.log(`Targeting URL address profile: ${page.url()}`);
  console.log(`Injecting credential payload for user: ${username}`);

  // Both distinct sites conveniently utilize identical standard element selectors
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('button[type="submit"]').click();

  // Assert successful access by confirming presence of flash system message banner
  await expect(page.locator('#flash')).toBeVisible();
});
