import { Locator, Page, expect } from '@playwright/test';

export class MyDocumentsPage {
  readonly page: Page;
  readonly newDocumentModal: NewDocumentModal;
  readonly newButton: Locator;
  readonly navigate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newDocumentModal = new NewDocumentModal(page);
    this.newButton = page.getByTestId('new-document');
    this.navigate = page.getByTestId('nav-my-documents');
  }

  async openPage() {
    await this.navigate.click();
    await this.page.waitForURL('/my-documents');
  }

  async openModal() {
    await this.newButton.click();
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
