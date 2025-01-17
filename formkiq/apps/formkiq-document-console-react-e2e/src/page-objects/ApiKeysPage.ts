import { Locator, Page } from '@playwright/test';

export class ApiKeysPage {
  readonly page: Page;
  readonly navigateLink: Locator;
  readonly integrationDropdown: Locator;
  readonly createButton: Locator;
  readonly newModal: NewApiKeyModalObject;
  readonly deleteModal: DeleteApiKeyModalObject;

  constructor(page: Page) {
    this.page = page;
    this.integrationDropdown = page.getByTestId('expand-orchestrations');
    this.navigateLink = page.getByTestId('nav-api-keys');
    this.createButton = page.getByTestId('create-api-key').first();
    this.newModal = new NewApiKeyModalObject(page);
    this.deleteModal = new DeleteApiKeyModalObject(page);
  }

  async openPage() {
    await this.integrationDropdown.click();
    await this.navigateLink.click();
  }

  async openNewModal() {
    await this.createButton.click();
  }

  async openDeleteModal(name: string) {
    await this.page
      .getByTestId(`api-key-${name}`)
      .getByTestId('delete-api-key')
      .click();
  }
}

class DeleteApiKeyModalObject {
  readonly page: Page;
  readonly ok: Locator;
  readonly cancel: Locator;
  readonly body: Locator;

  constructor(page: Page) {
    this.page = page;
    this.ok = page.getByTestId('global-modal-ok');
    this.cancel = page.getByTestId('global-modal-cancel');
    this.body = page.getByTestId('global-confirm-body');
  }

  async cancelDeletion() {
    await this.cancel.click();
  }

  async confirmDeletion() {
    await this.ok.click();
  }
}

class NewApiKeyModalObject {
  readonly page: Page;
  readonly confirm: Locator;
  readonly close: Locator;
  readonly cancel: Locator;
  readonly nameInput: Locator;
  readonly body: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirm = page.getByTestId('confirm-api-key-creation');
    this.close = page.getByTestId('close-api-key-creation');
    this.cancel = page.getByTestId('cancel-api-key-creation');
    this.nameInput = page.getByTestId('api-key-name-input');
    this.body = page.getByTestId('api-key-creation-modal');
  }

  async enterName(name: string) {
    await this.nameInput.type(name);
  }

  async cancelCreation() {
    await this.cancel.click();
  }

  async closeModal() {
    await this.close.click();
  }

  async confirmCreation() {
    await this.confirm.click();
  }
}
