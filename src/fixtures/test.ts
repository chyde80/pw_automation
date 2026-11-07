import AxeBuilder from '@axe-core/playwright';
import { test as base, expect } from '@playwright/test';

type Fixtures = {
  /** Returns a pre-configured axe builder scoped to the current page. */
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<Fixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    // Default rule set: includes the WCAG rules plus best-practice rules such
    // as heading-order, which this site documents as a known issue.
    await use(() => new AxeBuilder({ page }));
  },
});

export { expect };
