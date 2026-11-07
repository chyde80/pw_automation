import { expect, test } from '@playwright/test';
import { VisualDiffPage } from '../src/pages/VisualDiffPage';

/**
 * These tests only run in the chromium project (see playwright.config.ts).
 * Baselines are OS- and browser-specific; regenerate with `npm run baseline`.
 */
test.describe('Visual differences', () => {
  test('baseline card matches the stored snapshot', async ({ page }) => {
    const visual = new VisualDiffPage(page);
    await visual.open();

    await expect(visual.card).toHaveScreenshot('card-baseline.png');
    await expect(visual.activeChanges).toHaveText('Changes: none');
  });

  test('the same URL always renders identically', async ({ page }) => {
    const visual = new VisualDiffPage(page);
    await visual.open();

    const first = await visual.card.screenshot();
    await page.reload();
    const second = await visual.card.screenshot();

    expect(second.equals(first)).toBe(true);
  });

  test('each query parameter produces a visibly different card', async ({ page }) => {
    const visual = new VisualDiffPage(page);
    await visual.open();
    const baseline = await visual.card.screenshot();

    const variants = ['?shift=10', '?color=red', '?font=large', '?hide_logo=true', '?typo=true'];

    for (const variant of variants) {
      await visual.open(variant);
      const variantShot = await visual.card.screenshot();
      expect(variantShot.equals(baseline), `expected ${variant} to differ from the baseline`).toBe(
        false,
      );
    }
  });
});
