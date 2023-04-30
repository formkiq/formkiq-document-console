import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('Trash opens according to most recently chosen documents page', async ({
  page,
  MyDocuments,
  TeamDocuments,
  Trash,
}) => {
  //open My Documents page first
  await MyDocuments.openPage();
  await Trash.openPage();

  //assert URL corresponds to my-documents
  await page.waitForURL('/my-documents/folders/deleted');

  await TeamDocuments.openPage();
  await Trash.openPage();

  //assert URL corresponds to team-documents
  await page.waitForURL('/team-documents/folders/deleted');
});

test('Can change system folder from the Trash page', async ({
  page,
  Trash,
}) => {
  await Trash.openPage();
  await page.waitForURL('/my-documents/folders/deleted');

  await Trash.selectSystemFolder('Team Documents');
  await page.waitForURL('/team-documents/folders/deleted');

  await Trash.selectSystemFolder('My Documents');
  await page.waitForURL('/my-documents/folders/deleted');
});
