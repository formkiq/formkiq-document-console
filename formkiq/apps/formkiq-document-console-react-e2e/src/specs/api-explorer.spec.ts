import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { ApiItem } from '../page-objects/ApiExplorerPage';

test.beforeEach(async ({ LoginPage }) => {
  await LoginPage.login();
});

test('can navigate to the api explorer', async ({ page, ApiExplorer }) => {
  await ApiExplorer.openPage();

  await page.waitForURL('/integrations/api');
});

test('can fetch documents with default parameters', async ({
  page,
  ApiExplorer,
}) => {
  await ApiExplorer.openPage();

  const apiItem = new ApiItem(page, 'GET/', 'documents');

  await apiItem.open();
  await apiItem.fetch();

  await expect(apiItem.responseStatus).toHaveText('200');

  const responseData = JSON.parse(await apiItem.responseData.textContent());
  expect(responseData.documents).toBeTruthy(); //assert property exists on the response
});

test('can curl documents with default parameters', async ({
  page,
  ApiExplorer,
}) => {
  await ApiExplorer.openPage();

  const apiItem = new ApiItem(page, 'GET/', 'documents');
  await apiItem.open();

  await apiItem.setCurl();
  await expect(apiItem.curlRequest).toBeVisible();

  await apiItem.fetch();

  await expect(apiItem.responseStatus).toHaveText('200');

  const responseData = JSON.parse(await apiItem.responseData.textContent());
  expect(responseData.documents).toBeTruthy(); //assert property exists on the response
});

test('can http post documents with default parameters', async ({
  page,
  ApiExplorer,
}) => {
  await ApiExplorer.openPage();

  const apiItem = new ApiItem(page, 'POST/', 'documents');

  await apiItem.open();
  await apiItem.fetch();

  await expect(apiItem.responseStatus).toHaveText('201');

  const responseData = JSON.parse(await apiItem.responseData.textContent());
  expect(responseData.documentId).toBeTruthy(); //assert property exists on the response
});
