import { rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { FullConfig } from '@playwright/test';

/**
 * Allure appends every run to `allure-results`, so a report generated after
 * several local runs would include stale tests. Start each run with a clean
 * results directory unless ALLURE_KEEP_RESULTS is set.
 */
export default function globalSetup(config: FullConfig): void {
  if (process.env.ALLURE_KEEP_RESULTS === 'true') {
    return;
  }

  const hasAllureReporter = config.reporter.some((reporter) => {
    const name = Array.isArray(reporter) ? reporter[0] : reporter;
    return typeof name === 'string' && name.includes('allure-playwright');
  });

  if (!hasAllureReporter) {
    return;
  }

  const projectRoot = config.configFile ? dirname(config.configFile) : process.cwd();
  rmSync(join(projectRoot, 'allure-results'), { recursive: true, force: true });
}
