import { expect, test } from '@playwright/test';
import { NetworkConsolePage } from '../src/pages/NetworkConsolePage';

test.describe('Network & Console', () => {
  test('observes a successful JSON request', async ({ page }) => {
    const nc = new NetworkConsolePage(page);
    await nc.open();

    const responsePromise = page.waitForResponse((r) => r.url().endsWith('/network_console/data'));
    await nc.fetchJson.click();
    const response = await responsePromise;

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Record<string, unknown>;
    expect(body).toMatchObject({ fruit: expect.any(String), count: expect.any(Number) });

    await expect(nc.eventLog.filter({ hasText: 'Fetched JSON:' })).toBeVisible();
  });

  test('observes a failing 500 response', async ({ page }) => {
    const nc = new NetworkConsolePage(page);
    await nc.open();

    const responsePromise = page.waitForResponse((r) => r.url().includes('/status_codes/500'));
    await nc.fetchError.click();
    const response = await responsePromise;

    expect(response.status()).toBe(500);
    await expect(nc.eventLog.filter({ hasText: 'Request failed with status 500' })).toBeVisible();
  });

  test('captures log, warning and error console messages', async ({ page }) => {
    const nc = new NetworkConsolePage(page);
    await nc.open();

    const messages: Array<{ type: string; text: string }> = [];
    page.on('console', (msg) => {
      if (msg.text().startsWith('the-internet:')) {
        messages.push({ type: msg.type(), text: msg.text() });
      }
    });

    await nc.logConsole.click();

    await expect.poll(() => messages).toHaveLength(3);
    expect(messages).toEqual([
      { type: 'log', text: 'the-internet: a log message' },
      { type: 'warning', text: 'the-internet: a warning' },
      { type: 'error', text: 'the-internet: an error message' },
    ]);
  });

  test('captures an uncaught page error', async ({ page }) => {
    const nc = new NetworkConsolePage(page);
    await nc.open();

    const errorPromise = page.waitForEvent('pageerror');
    await nc.throwError.click();
    const error = await errorPromise;

    expect(error.message).toContain('the-internet: thrown on purpose');
    await expect(nc.eventLog.filter({ hasText: 'Uncaught error:' })).toBeVisible();
  });

  test('captures a CSP report-only violation', async ({ page }) => {
    const nc = new NetworkConsolePage(page);
    await nc.open();

    await nc.cspViolation.click();
    await expect(nc.eventLog.filter({ hasText: /CSP violation: img-src/ })).toBeVisible();
  });
});
