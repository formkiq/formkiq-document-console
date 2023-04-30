import { test as base } from '@playwright/test';
import { FavoritesPage } from './page-objects/FavoritesPage';
import { LoginPage } from './page-objects/LoginPage';
import { MyDocumentsPage } from './page-objects/MyDocumentsPage';
import { Profile } from './page-objects/Profile';
import { TeamDocumentsPage } from './page-objects/TeamDocumentsPage';
import { TrashPage } from './page-objects/TrashPage';

type Fixture = {
  LoginPage: LoginPage;
  MyDocuments: MyDocumentsPage;
  Profile: Profile;
  TeamDocuments: TeamDocumentsPage;
  Trash: TrashPage;
  Favorites: FavoritesPage;
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
  TeamDocuments: async ({ page }, use) => {
    const teamDocuments = new TeamDocumentsPage(page);
    await use(teamDocuments);
  },
  Trash: async ({ page }, use) => {
    const trash = new TrashPage(page);
    await use(trash);
  },
  Favorites: async ({ page }, use) => {
    const favorites = new FavoritesPage(page);
    await use(favorites);
  },
  page: async ({ page }, use) => {
    await page.goto('/');
    //expect to be redirected to login
    await page.waitForURL('/sign-in');
    await use(page);
  },
});
