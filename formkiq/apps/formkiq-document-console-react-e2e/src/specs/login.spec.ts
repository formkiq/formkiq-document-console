import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { login } from '../workflows/login';

const e2eUser = process.env.E2E_USER;
const e2ePassword = process.env.E2E_PASSWORD;

test('can login with valid credentials', async ({ page }) => {
  await login(page);
});

test('cannot login with an invalid username', async ({ page }) => {
  const email = page.getByTestId('email');
  await email.type('invalid@example.com');

  const password = page.getByTestId('password');
  await password.type(e2ePassword);

  const signIn = page.getByTestId('sign-in');
  await signIn.click();

  const modal = page.getByTestId('modal-title');
  await expect(modal).toHaveText(
    'Incorrect email or password. Please try again.'
  );

  //should not be redirected
  await page.waitForURL('/sign-in');
});

test('cannot login with an invalid password', async ({ page }) => {
  const email = page.getByTestId('email');
  await email.type(e2eUser);

  const password = page.getByTestId('password');
  await password.type('invalid-password');

  const signIn = page.getByTestId('sign-in');
  await signIn.click();

  const modal = page.getByTestId('modal-title');
  await expect(modal).toHaveText(
    'Incorrect email or password. Please try again.'
  );

  //should not be redirected
  await page.waitForURL('/sign-in');
});
