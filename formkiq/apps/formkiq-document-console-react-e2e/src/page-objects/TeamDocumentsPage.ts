import { Locator, Page, expect } from '@playwright/test';

export class TeamDocumentsPage {
  readonly page: Page;
  navigate: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigate = page.getByTestId('nav-team-documents');
  }

  async openPage() {
    await this.navigate.click();
    await this.page.waitForURL('/team-documents');
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
