import { expect, test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';

test.describe('Basic authentication', () => {
  test.use({ httpCredentials: { username: 'admin', password: 'admin' } });

  test('sends credentials for the HTTP auth challenge', async ({ page }) => {
    await page.goto('/basic_auth');
    await expect(
      page.getByText('Congratulations! You must have the proper credentials.'),
    ).toBeVisible();
  });
});

test.describe('Form authentication', () => {
  test('rejects an invalid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('tomsmith', 'wrong-password');

    await expect(login.flash).toContainText('Your password is invalid!');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('logs in, reaches the secure area, and logs out', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('tomsmith', 'SuperSecretPassword!');

    await expect(page).toHaveURL(/\/secure$/);
    await expect(login.flash).toContainText('You logged into a secure area!');

    await login.logout();
    await expect(page).toHaveURL(/\/login$/);
    await expect(login.flash).toContainText('You logged out of the secure area!');
  });
});
