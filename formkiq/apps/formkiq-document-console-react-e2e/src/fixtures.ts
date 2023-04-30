import { test as base } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { MyDocumentsPage } from './page-objects/MyDocumentsPage';
import { Profile } from './page-objects/Profile';

type Fixture = {
  LoginPage: LoginPage;
  MyDocuments: MyDocumentsPage;
  Profile: Profile;
};

// Extend basic test by providing our fixtures.
export const test = base.extend<Fixture>({
  LoginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  MyDocuments: async ({ page }, use) => {
    const myDocumentsPage = new MyDocumentsPage(page);
    await use(myDocumentsPage);
  },
  Profile: async ({ page }, use) => {
    const profile = new Profile(page);
    await use(profile);
  },
  page: async ({ page }, use) => {
    await page.goto('/');
    //expect to be redirected to login
    await page.waitForURL('/sign-in');
    await use(page);
  },
});
