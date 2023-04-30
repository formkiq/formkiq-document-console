import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('Favorites opens according to most recently chosen documents page', async ({
  page,
  MyDocuments,
  TeamDocuments,
  Favorites,
}) => {
  //open My Documents page first
  await MyDocuments.openPage();
  await Favorites.openPage();

  //assert URL corresponds to my-documents
  await page.waitForURL('/my-documents/folders/favorites');

  await TeamDocuments.openPage();
  await Favorites.openPage();

  //assert URL corresponds to team-documents
  await page.waitForURL('/team-documents/folders/favorites');
});

test('Can change system folder from the Favorites page', async ({
  page,
  Favorites,
}) => {
  await Favorites.openPage();
  await page.waitForURL('/my-documents/folders/favorites');

  await Favorites.selectSystemFolder('Team Documents');
  await page.waitForURL('/team-documents/folders/favorites');

  await Favorites.selectSystemFolder('My Documents');
  await page.waitForURL('/my-documents/folders/favorites');
});
