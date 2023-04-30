import { Page, test as base } from '@playwright/test';
import { login } from './workflows/login';

type Fixture = {
  login: (page: Page) => Promise<void>;
};
// Extend basic test by providing a "todoPage" fixture.
export const test = base.extend<Fixture>({
  login: async ({ page }, use) => {
    await use(login);
  },
  page: async ({ page }, use) => {
    await page.goto('/');
    //expect to be redirected to login
    await page.waitForURL('/sign-in');
    await use(page);
  },
});
