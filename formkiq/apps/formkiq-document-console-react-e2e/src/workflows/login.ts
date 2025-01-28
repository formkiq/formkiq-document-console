import { Page } from '@playwright/test';

const e2eUser = process.env.E2E_USER;
const e2ePassword = process.env.E2E_PASSWORD;

export const login = async (page: Page) => {
  const email = page.getByTestId('email');
  await email.type(e2eUser);

  const password = page.getByTestId('password');
  await password.type(e2ePassword);

  const signIn = page.getByTestId('sign-in');
  await signIn.click();

  await page.waitForURL('/my-documents');
};
