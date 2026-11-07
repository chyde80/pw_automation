import type { Locator, Page } from '@playwright/test';

/**
 * Shared behaviour for every example page on the-internet.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /** The site-wide flash banner used by login, forgot-password, etc. */
  get flash(): Locator {
    return this.page.locator('#flash');
  }
}
