import { Locator, Page } from '@playwright/test';

export class FavoritesPage {
  readonly page: Page;
  readonly navigateLink: Locator;
  readonly systemSelect: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigateLink = page.getByTestId('nav-favorites');
    this.systemSelect = page.getByTestId('system-subfolder-select');
  }

  async openPage() {
    await this.navigateLink.click();
  }

  async selectSystemFolder(folder: 'My Documents' | 'Team Documents') {
    await this.systemSelect.selectOption(folder);
  }
}
