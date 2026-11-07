import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * /shadowdom_advanced - nested open roots, a closed root, slots, and a
 * form-associated custom element.
 *
 * Playwright locators pierce open shadow roots automatically, but they do not
 * pierce closed roots (that is intentional, and matches the platform).
 */
export class ShadowDomAdvancedPage extends BasePage {
  readonly nestedResult: Locator = this.page.locator('#nested-result');
  readonly innerCard: Locator = this.page.locator('outer-card').locator('inner-card');
  readonly innerButton: Locator = this.innerCard.getByRole('button', { name: 'Click me' });

  readonly slotCard: Locator = this.page.locator('#slot-card');
  readonly slottedTitle: Locator = this.page.locator('#slot-card span[slot="title"]');
  readonly slottedBody: Locator = this.page.locator('#slot-card span[slot="body"]');

  readonly closedCard: Locator = this.page.locator('#closed-card');

  readonly ratingForm: Locator = this.page.locator('#rating-form');
  readonly nameInput: Locator = this.page.locator('#name');
  readonly rating: Locator = this.page.locator('star-rating');
  readonly formSubmit: Locator = this.page.locator('#rating-form button[type="submit"]');
  readonly formResult: Locator = this.page.locator('#form-result');

  async open(): Promise<void> {
    await this.goto('/shadowdom_advanced');
  }

  async rate(stars: 1 | 2 | 3 | 4 | 5): Promise<void> {
    const label = stars === 1 ? '1 star' : `${stars} stars`;
    await this.rating.getByRole('button', { name: label, exact: true }).click();
  }
}
