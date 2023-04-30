import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('Can log out from my profile', async ({ page, Profile }) => {
  await Profile.openProfile();
  await Profile.signOut();

  //expect to be redirected to login
  await page.waitForURL('/sign-in');
});
