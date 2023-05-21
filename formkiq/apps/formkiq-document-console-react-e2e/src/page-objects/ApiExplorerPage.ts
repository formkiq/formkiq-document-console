import { Locator, Page } from '@playwright/test';

export class ApiExplorerPage {
  readonly page: Page;
  readonly navigateLink: Locator;
  readonly integrationDropdown: Locator;
  readonly systemSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.integrationDropdown = page.getByTestId('expand-integrations');
    this.navigateLink = page.getByTestId('nav-api-explorer');
    this.systemSelect = page.getByTestId('system-subfolder-select');
  }

  async openPage() {
    await this.integrationDropdown.click();
    await this.navigateLink.click();
  }

  async selectSystemFolder(folder: 'My Documents' | 'Team Documents') {
    await this.systemSelect.selectOption(folder);
  }
}
