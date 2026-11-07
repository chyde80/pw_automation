import { expect, test } from '@playwright/test';
import { DynamicLoadingPage } from '../src/pages/DynamicLoadingPage';

test.describe('Dynamic loading', () => {
  test('auto-waits for the delayed element instead of sleeping', async ({ page }) => {
    const dynamic = new DynamicLoadingPage(page);
    await dynamic.open(2);

    await expect(dynamic.finish).toBeHidden();
    await dynamic.start();
    await expect(dynamic.finish.getByText('Hello World!')).toBeVisible();
  });
});
