import { expect, test } from '@playwright/test';
import { ShadowDomAdvancedPage } from '../src/pages/ShadowDomAdvancedPage';

test.describe('Advanced Shadow DOM', () => {
  test('pierces nested open shadow roots', async ({ page }) => {
    const shadow = new ShadowDomAdvancedPage(page);
    await shadow.open();

    await expect(shadow.nestedResult).toHaveText('The button has not been clicked');
    await shadow.innerButton.click();
    await expect(shadow.nestedResult).toHaveText('You clicked the button in the inner shadow root');
  });

  test('renders slotted content from the light DOM', async ({ page }) => {
    const shadow = new ShadowDomAdvancedPage(page);
    await shadow.open();

    await expect(shadow.slottedTitle).toBeVisible();
    await expect(shadow.slottedTitle).toHaveText('Title from the light DOM');
    await expect(shadow.slottedBody).toHaveText('Body from the light DOM');

    // Slot fallback content lives inside the shadow root.
    await expect(shadow.slotCard.getByText(/Default footer/)).toBeVisible();
  });

  test('closed shadow roots are unreachable by design', async ({ page }) => {
    const shadow = new ShadowDomAdvancedPage(page);
    await shadow.open();

    // The platform hides closed roots, and so do Playwright locators.
    const shadowRoot = await shadow.closedCard.evaluate((el) => el.shadowRoot);
    expect(shadowRoot).toBeNull();

    await expect(page.getByText('This text is in a closed shadow root')).toHaveCount(0);
  });

  test('supports a form-associated custom element', async ({ page }) => {
    const shadow = new ShadowDomAdvancedPage(page);
    await shadow.open();

    // No rating yet -> the custom element reports a validation error.
    await shadow.formSubmit.click();
    await expect(shadow.formResult).toHaveText('Error: Pick a rating');

    await shadow.nameInput.fill('Ada Lovelace');
    await shadow.rate(4);
    await shadow.formSubmit.click();
    await expect(shadow.formResult).toHaveText('Submitted name: Ada Lovelace, rating: 4');
  });
});
