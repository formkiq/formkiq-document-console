import { expect } from '@playwright/test';
import { test } from '../fixtures';

const e2eUser = process.env.E2E_USER;

test('can login with valid credentials', async ({ page, LoginPage }) => {
  await LoginPage.login(page);
});

test('cannot login with an invalid username', async ({ page, LoginPage }) => {
  await LoginPage.enterEmail('invalid@example.com');
  await LoginPage.enterPassword('password');
  await LoginPage.signIn();

  await expect(LoginPage.errorModal).toHaveText(
    'Incorrect email or password. Please try again.'
  );

  //should not be redirected
  await page.waitForURL('/sign-in');
});

test('cannot login with an invalid password', async ({ page, LoginPage }) => {
  await LoginPage.enterEmail(e2eUser);
  await LoginPage.enterPassword('password');
  await LoginPage.signIn();

  await expect(LoginPage.errorModal).toHaveText(
    'Incorrect email or password. Please try again.'
  );

  //should not be redirected
  await page.waitForURL('/sign-in');
});
