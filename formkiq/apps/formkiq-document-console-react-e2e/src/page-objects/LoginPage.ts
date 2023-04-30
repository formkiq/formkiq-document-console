import { Locator, Page } from '@playwright/test';
const e2eUser = process.env.E2E_USER;
const e2ePassword = process.env.E2E_PASSWORD;

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly signInButton: Locator;
  readonly errorModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.signInButton = page.getByTestId('sign-in');
    this.errorModal = page.getByTestId('modal-title');
  }

  async login() {
    await this.email.type(e2eUser);
    await this.password.type(e2ePassword);
    await this.signInButton.click();

    await this.page.waitForURL('/my-documents');
  }

  async enterEmail(email: string) {
    await this.email.type(email);
  }

  async enterPassword(password: string) {
    await this.password.type(password);
  }

  async signIn() {
    await this.signInButton.click();
  }
}
