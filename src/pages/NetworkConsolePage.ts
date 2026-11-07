import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * /network_console - each button triggers something observable from outside
 * the page (network, console, uncaught error, CSP report).
 */
export class NetworkConsolePage extends BasePage {
  readonly fetchJson: Locator = this.page.locator('#fetch-json');
  readonly fetchError: Locator = this.page.locator('#fetch-error');
  readonly logConsole: Locator = this.page.locator('#log-console');
  readonly throwError: Locator = this.page.locator('#throw-error');
  readonly cspViolation: Locator = this.page.locator('#csp-violation');
  readonly eventLog: Locator = this.page.locator('#event-log li');

  async open(): Promise<void> {
    await this.goto('/network_console');
  }
}
