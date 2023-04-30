import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('Can navigate to the team documents page', async ({ TeamDocuments }) => {
  await TeamDocuments.openPage();
});
