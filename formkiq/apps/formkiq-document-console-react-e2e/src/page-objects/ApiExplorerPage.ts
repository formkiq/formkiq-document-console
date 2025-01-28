import { Locator, Page } from '@playwright/test';

export class ApiExplorerPage {
  readonly page: Page;
  readonly navigateLink: Locator;
  readonly integrationDropdown: Locator;
  readonly fetchButton: Locator;
  readonly documentsSegment: Locator;

  constructor(page: Page) {
    this.page = page;
    this.integrationDropdown = page.getByTestId('expand-orchestrations');
    this.navigateLink = page.getByTestId('nav-api-explorer');
    this.fetchButton = page.getByTestId('apiItem-fetch');
    this.documentsSegment = page.getByTestId('Documents-&-Folders');
  }

  async openPage() {
    await this.integrationDropdown.click();
    await this.navigateLink.click();
  }

  async openDocuments() {
    await this.documentsSegment.click();
  }
}

export class ApiItem {
  readonly page: Page;
  readonly path: string;
  readonly fetchButton: Locator;
  readonly responseStatus: Locator;
  readonly responseData: Locator;
  readonly httpButton: Locator;
  readonly curlButton: Locator;
  readonly curlRequest: Locator;

  constructor(page: Page, apiMethod: string, apiPath: string) {
    this.page = page;
    this.path = `apiItem-${apiMethod}${apiPath}`;
    this.fetchButton = page.getByTestId(this.path).getByTestId('apiItem-fetch');
    this.responseStatus = page
      .getByTestId(this.path)
      .getByTestId('apiItem-response-status');
    this.responseData = page
      .getByTestId(this.path)
      .getByTestId('apiItem-response-data');

    this.httpButton = page.getByTestId(this.path).getByTestId('apiItem-HTTP');
    this.curlButton = page.getByTestId(this.path).getByTestId('apiItem-cURL');
    this.curlRequest = page
      .getByTestId(this.path)
      .getByTestId('apiItem-curl-request');
  }

  async setCurl() {
    await this.curlButton.click();
  }

  async open() {
    await this.page.getByTestId(this.path).click();
  }

  async fetch() {
    await this.fetchButton.click();
  }
}
