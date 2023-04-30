import { Locator, Page, expect } from '@playwright/test';

export class MyDocumentsPage {
  readonly page: Page;
  readonly newDocumentModal: NewDocumentModal;
  readonly newButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newDocumentModal = new NewDocumentModal(page);
    this.newButton = page.getByTestId('new-document');
  }

  async openModal() {
    await this.newButton.click();
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
