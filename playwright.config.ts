import * as os from 'node:os';
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.BASE_URL ?? 'https://the-internet.herokuapp.com';
const IS_CI = process.env.CI?.toLowerCase() === 'true' || process.env.CI === '1';

export default defineConfig({
  testDir: './tests',
  globalSetup: './src/global-setup.ts',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 2 : undefined,
  timeout: 60_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: { maxDiffPixels: 0 },
  },
  reporter: [
    IS_CI ? ['github'] : ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        environmentInfo: {
          base_url: BASE_URL,
          node_version: process.version,
          os_platform: os.platform(),
          os_release: os.release(),
          ci: String(IS_CI),
        },
        globalLabels: {
          layer: 'e2e',
          framework: 'playwright',
        },
      },
    ],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      // Pixel baselines are generated per browser; visual tests only run on chromium.
      testIgnore: /visual-diff\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /visual-diff\.spec\.ts/,
    },
  ],
});
