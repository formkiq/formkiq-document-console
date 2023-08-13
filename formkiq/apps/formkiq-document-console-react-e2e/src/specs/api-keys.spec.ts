import { expect } from '@playwright/test';
import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('can navigate to the api keys page', async ({ page, ApiKeys }) => {
  await ApiKeys.openPage();

  await page.waitForURL('/integrations/apiKeys');
});

test('can add and delete a new api key', async ({ page, ApiKeys }) => {
  await ApiKeys.openPage();

  const apiKey = page.getByTestId(`api-key-my-new-api-key`);

  await ApiKeys.openNewModal();
  await ApiKeys.newModal.enterName('my-new-api-key');
  await ApiKeys.newModal.confirmCreation();

  await expect(apiKey).toBeVisible();

  await ApiKeys.openDeleteModal('my-new-api-key');
  await ApiKeys.deleteModal.confirmDeletion();

  await expect(apiKey).not.toBeVisible();

  await page.waitForTimeout(1000); //brief pause before the end of the test to ensure deletion action resolves
});

test('can cancel out of creating an api key', async ({ ApiKeys }) => {
  await ApiKeys.openPage();

  await ApiKeys.openNewModal();
  await ApiKeys.newModal.enterName('my-new-api-key');
  await ApiKeys.newModal.cancelCreation();

  await expect(ApiKeys.newModal.body).not.toBeVisible();

  await ApiKeys.openNewModal();
  await ApiKeys.newModal.enterName('my-new-api-key');
  await ApiKeys.newModal.closeModal();

  await expect(ApiKeys.newModal.body).not.toBeVisible();
});
