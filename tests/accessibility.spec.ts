import { expect, test } from '../src/fixtures/test';

const KNOWN_RULES = [
  'image-alt',
  'label',
  'select-name',
  'button-name',
  'link-name',
  'color-contrast',
  'aria-roles',
  'heading-order',
];

// axe reports color-contrast as "incomplete" here because the site template
// renders over a background it cannot resolve, so it is checked separately.
const DETECTABLE_RULES = KNOWN_RULES.filter((rule) => rule !== 'color-contrast');

test.describe('Accessibility', () => {
  test('axe finds every documented issue on the broken page', async ({ page, makeAxeBuilder }) => {
    await page.goto('/accessibility_issues');

    const results = await makeAxeBuilder().analyze();
    await test.info().attach('axe-violations.json', {
      body: JSON.stringify(results.violations, null, 2),
      contentType: 'application/json',
    });

    const found = results.violations.map((v) => v.id);
    expect(found).toEqual(expect.arrayContaining(DETECTABLE_RULES));

    // Whether axe resolves the low-contrast text or flags it as needing manual
    // review can vary, so accept either outcome as "reported".
    const reported = [...results.violations, ...results.incomplete].map((v) => v.id);
    expect(reported).toContain('color-contrast');
  });

  test('the fixed page clears the documented issues', async ({ page, makeAxeBuilder }) => {
    await page.goto('/accessibility_issues?fixed=true');

    const results = await makeAxeBuilder().analyze();
    const found = results.violations.map((v) => v.id);

    expect(found.filter((id) => KNOWN_RULES.includes(id))).toEqual([]);
  });
});
