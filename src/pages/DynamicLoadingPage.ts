import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * /dynamic_loading - renders a "Start" button, then reveals #finish after a
 * random delay. The classic example of why auto-waiting beats sleeps.
 */
export class DynamicLoadingPage extends BasePage {
  readonly startButton: Locator = this.page.locator('#start button');
  readonly finish: Locator = this.page.locator('#finish');

  async open(example: 1 | 2 = 2): Promise<void> {
    await this.goto(`/dynamic_loading/${example}`);
  }

  async start(): Promise<void> {
    await this.startButton.click();
  }
}
