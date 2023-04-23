import { test } from '@playwright/test';

test('passes', async ({ page }) => {
  await page.goto('/');
});
