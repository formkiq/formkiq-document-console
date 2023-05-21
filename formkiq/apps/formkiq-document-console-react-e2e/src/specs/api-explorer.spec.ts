import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('can navigate to the api explorer', async ({ page, ApiExplorer }) => {
  await ApiExplorer.openPage();

  await page.waitForURL('/integrations/api');
});
