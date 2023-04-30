import { expect } from '@playwright/test';
import { test } from '../fixtures';

test.beforeEach(async ({ page, login }) => {
  await login(page);
});

test('Can log out from my profile', async ({ page }) => {
  const profile = page.getByTestId('profile');
  await profile.click();

  const signout = page.getByTestId('sign-out');
  await expect(signout).toBeVisible();

  await signout.click();

  //expect to be redirected to login
  await page.waitForURL('/sign-in');
});
