import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * /visual_diff - server-rendered variants of the same card. Each query
 * parameter turns on exactly one visual change.
 */
export class VisualDiffPage extends BasePage {
  readonly card: Locator = this.page.locator('#card');
  readonly activeChanges: Locator = this.page.locator('#active-changes');

  async open(query = ''): Promise<void> {
    await this.goto(`/visual_diff${query}`);
  }
}
