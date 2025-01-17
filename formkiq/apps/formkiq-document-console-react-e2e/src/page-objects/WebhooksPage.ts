import { Locator, Page } from '@playwright/test';

export class WebhooksPage {
  readonly page: Page;
  readonly navigateLink: Locator;
  readonly integrationDropdown: Locator;
  readonly createButton: Locator;
  readonly newModal: NewWebhookModalObject;
  readonly deleteModal: DeleteWebhookModalObject;

  constructor(page: Page) {
    this.page = page;
    this.integrationDropdown = page.getByTestId('expand-orchestrations');
    this.navigateLink = page.getByTestId('nav-webhooks');
    this.createButton = page.getByTestId('create-webhook').first();
    this.newModal = new NewWebhookModalObject(page);
    this.deleteModal = new DeleteWebhookModalObject(page);
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
      .getByTestId(`webhook-${name}`)
      .getByTestId('delete-webhook')
      .click();
  }
}

class DeleteWebhookModalObject {
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

class NewWebhookModalObject {
  readonly page: Page;
  readonly confirm: Locator;
  readonly close: Locator;
  readonly cancel: Locator;
  readonly nameInput: Locator;
  readonly body: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirm = page.getByTestId('confirm-webhook-creation');
    this.close = page.getByTestId('close-webhook-creation');
    this.cancel = page.getByTestId('cancel-webhook-creation');
    this.nameInput = page.getByTestId('webhook-name-input');
    this.body = page.getByTestId('webhook-creation-modal');
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
