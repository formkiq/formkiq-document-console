import { test } from '../fixtures';

test.beforeEach(async ({ page, LoginPage }) => {
  await LoginPage.login(page);
});

test('Can log out from my profile', async ({ page, Profile }) => {
  await Profile.openProfile();
  await Profile.signOut();

  //expect to be redirected to login
  await page.waitForURL('/sign-in');
});
