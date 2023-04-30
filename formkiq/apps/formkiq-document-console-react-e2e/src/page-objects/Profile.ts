import { Locator, Page } from '@playwright/test';

export class Profile {
  readonly page: Page;
  readonly signout: Locator;
  readonly profileIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signout = page.getByTestId('sign-out');
    this.profileIcon = page.getByTestId('profile');
  }

  async openProfile() {
    await this.profileIcon.click();
  }

  async signOut() {
    await this.signout.click();
  }
}
