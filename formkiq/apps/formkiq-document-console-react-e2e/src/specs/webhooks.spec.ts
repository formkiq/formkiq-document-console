import { expect } from '@playwright/test';
import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('can navigate to the webhooks page', async ({ page, Webhooks }) => {
  await Webhooks.openPage();

  await page.waitForURL('/integrations/webhooks');
});

test('can add and delete a new webhook', async ({ page, Webhooks }) => {
  await Webhooks.openPage();

  const webhook = page.getByTestId(`webhook-my-new-webhook`);

  await Webhooks.openNewModal();
  await Webhooks.newModal.enterName('my-new-webhook');
  await Webhooks.newModal.confirmCreation();

  await expect(webhook).toBeVisible();

  await Webhooks.openDeleteModal('my-new-webhook');
  await Webhooks.deleteModal.confirmDeletion();

  await expect(webhook).not.toBeVisible();

  await page.waitForTimeout(1000); //brief pause before the end of the test to ensure deletion action resolves
});

test('can cancel out of creating a webhook', async ({ Webhooks }) => {
  await Webhooks.openPage();

  await Webhooks.openNewModal();
  await Webhooks.newModal.enterName('my-new-webhook');
  await Webhooks.newModal.cancelCreation();

  await expect(Webhooks.newModal.body).not.toBeVisible();

  await Webhooks.openNewModal();
  await Webhooks.newModal.enterName('my-new-webhook');
  await Webhooks.newModal.closeModal();

  await expect(Webhooks.newModal.body).not.toBeVisible();
});
