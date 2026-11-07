import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * /login and the authenticated /secure area.
 */
export class LoginPage extends BasePage {
  readonly username: Locator = this.page.locator('#username');
  readonly password: Locator = this.page.locator('#password');
  readonly submit: Locator = this.page.locator('button[type="submit"]');
  readonly logoutLink: Locator = this.page.getByRole('link', { name: 'Logout' });

  async open(): Promise<void> {
    await this.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
