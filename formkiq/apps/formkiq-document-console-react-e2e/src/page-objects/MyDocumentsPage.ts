import { Locator, Page, expect } from '@playwright/test';

export class MyDocumentsPage {
  readonly page: Page;
  readonly newModal: NewDocumentModal;
  readonly uploadModal: UploadDocumentModal;
  readonly newButton: Locator;
  readonly uploadButton: Locator;
  readonly navigate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newModal = new NewDocumentModal(page);
    this.uploadModal = new UploadDocumentModal(page);
    this.newButton = page.getByTestId('new-document');
    this.navigate = page.getByTestId('nav-my-documents');
    this.uploadButton = page.getByTestId('upload-document');
  }

  async openPage() {
    await this.navigate.click();
    await this.page.waitForURL('/my-documents');
  }

  async openNewModal() {
    await this.newButton.click();
  }

  async openUploadModal() {
    await this.uploadButton.click();
  }

  async deleteFolder(name: string) {
    const folder = this.page.getByTestId(`folder-${name}`);
    await folder.getByTestId('delete-action').click();

    const modal = this.page.getByText(
      'Are you sure you want to delete this folder?'
    );

    await expect(modal).toBeVisible();

    const ok = this.page.getByTestId('global-modal-ok');
    await ok.click();

    await expect(modal).not.toBeVisible();
  }
}

export class NewDocumentModal {
  readonly page: Page;
  readonly body: Locator;
  readonly cancel: Locator;
  readonly create: Locator;
  readonly location: Locator;
  readonly close: Locator;
  readonly newFolder: Locator;

  constructor(page: Page) {
    this.page = page;
    this.body = page.getByTestId('new-document-modal');
    this.cancel = page.getByTestId('new-document-modal-cancel');
    this.close = page.getByTestId('new-document-modal-close');
    this.location = page.getByTestId('new-document-location-input');
    this.newFolder = page.getByTestId('new-document-folder');
    this.create = page.getByTestId('new-document-modal-create');
  }

  async addFolder(name: string) {
    await this.newFolder.click();

    //should be automatically focused
    await expect(this.location).toBeFocused();
    await this.location.type(name);
    await this.create.click();

    //modal should close
    await expect(this.body).not.toBeVisible();
  }

  async closeModal() {
    await this.close.click();
  }

  async cancelModal() {
    await this.cancel.click();
  }
}

export class UploadDocumentModal {
  readonly page: Page;
  readonly body: Locator;
  readonly close: Locator;
  readonly upload: Locator;
  readonly clear: Locator;
  readonly status: Locator;

  constructor(page: Page) {
    this.page = page;
    this.body = page.getByTestId('upload-document-modal');
    this.close = page.getByTestId('upload-modal-close');
    this.upload = page.getByTestId('upload');
    this.clear = page.getByTestId('clear-file-list');
    this.status = page.getByText('Ready to upload');
  }

  async closeModal() {
    await this.close.click();
  }

  async chooseTestFile() {
    // Start waiting for file chooser before clicking. Note no await.
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.page.getByText('BROWSE...').click();
    const fileChooser = await fileChooserPromise;
    //runs in cwd of test executor
    await fileChooser.setFiles(
      './apps/formkiq-document-console-react-e2e/src/test-files/test.txt'
    );

    await expect(this.status).toBeVisible();
  }

  async uploadFile() {
    await this.upload.click();
  }

  async clearFiles() {
    await this.clear.click();
  }
}
