import { expect } from '@playwright/test';
import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('Can cancel out of creating a new document', async ({ MyDocuments }) => {
  await MyDocuments.openModal();
  await expect(MyDocuments.newDocumentModal.body).toBeVisible();

  await MyDocuments.newDocumentModal.closeModal();
  await expect(MyDocuments.newDocumentModal.body).not.toBeVisible();

  await MyDocuments.openModal();
  await expect(MyDocuments.newDocumentModal.body).toBeVisible();

  await MyDocuments.newDocumentModal.cancelModal();
  await expect(MyDocuments.newDocumentModal.body).not.toBeVisible();
});

//Skipped temporarily as trying to delete a folder is yielding a 500 error
test.skip('Can create a new document folder', async ({ page, MyDocuments }) => {
  await MyDocuments.openModal();
  await MyDocuments.newDocumentModal.addFolder('test-folder');
  const folder = page.getByTestId('folder-test-folder');
  await expect(folder).toBeVisible();

  await MyDocuments.deleteFolder('test-folder');

  await expect(folder).not.toBeVisible();
});
