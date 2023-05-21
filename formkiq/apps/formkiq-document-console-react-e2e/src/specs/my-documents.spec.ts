import { expect } from '@playwright/test';
import { test } from '../fixtures';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('Can cancel out of creating a new document', async ({ MyDocuments }) => {
  await MyDocuments.openNewModal();
  await expect(MyDocuments.newModal.body).toBeVisible();

  await MyDocuments.newModal.closeModal();
  await expect(MyDocuments.newModal.body).not.toBeVisible();

  await MyDocuments.openNewModal();
  await expect(MyDocuments.newModal.body).toBeVisible();

  await MyDocuments.newModal.cancelModal();
  await expect(MyDocuments.newModal.body).not.toBeVisible();
});

//Skipped temporarily as trying to delete a folder is yielding a 500 error
test.skip('Can create a new document folder', async ({ page, MyDocuments }) => {
  await MyDocuments.openNewModal();
  await MyDocuments.newModal.addFolder('test-folder');
  const folder = page.getByTestId('folder-test-folder');
  await expect(folder).toBeVisible();

  await MyDocuments.deleteFolder('test-folder');

  await expect(folder).not.toBeVisible();
});

test('Can cancel out of uploading a file', async ({ MyDocuments }) => {
  await MyDocuments.openUploadModal();
  await MyDocuments.uploadModal.closeModal();

  await expect(MyDocuments.uploadModal.body).not.toBeVisible();
});

test('Can clear out a list of uploading files', async ({ MyDocuments }) => {
  await MyDocuments.openUploadModal();
  await MyDocuments.uploadModal.chooseTestFile();
  await MyDocuments.uploadModal.clearFiles();

  await expect(MyDocuments.uploadModal.status).not.toBeVisible();
});

test('Can upload and delete a file', async ({ page, MyDocuments }) => {
  await MyDocuments.openUploadModal();
  await MyDocuments.uploadModal.chooseTestFile();
  await MyDocuments.uploadModal.uploadFile();

  await page.waitForTimeout(1000);
  const uploadedFile =
    MyDocuments.uploadModal.body.getByTestId('uploaded-files-0');
  await expect(uploadedFile).toHaveText(/^blue-jay.*jpeg$/);

  await page.waitForTimeout(1000);
  await MyDocuments.uploadModal.closeModal();

  await MyDocuments.deleteFile(/^blue-jay.*jpeg$/);

  const file = page.getByTestId(/^blue-jay.*jpeg$/);
  await expect(file).not.toBeVisible();
});
