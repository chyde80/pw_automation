import { expect, test } from '@playwright/test';
import { WebSocketPage } from '../src/pages/WebSocketPage';

test.describe('WebSocket', () => {
  test('connects to the real echo server, sends, receives and disconnects', async ({ page }) => {
    const ws = new WebSocketPage(page);
    await ws.open();

    await expect(ws.status).toHaveText('Disconnected');
    await expect(ws.messageInput).toBeDisabled();

    await ws.connect();
    await expect(ws.status).toHaveText('Connected');
    await expect(ws.messageInput).toBeEnabled();

    await ws.send('hello playwright');
    await expect(ws.messages).toHaveText([
      'Connected. Send a message and the server sends it back.',
      'hello playwright',
      'Echo: hello playwright',
    ]);

    await ws.disconnect();
    await expect(ws.status).toHaveText(/Disconnected \(code 1000: Closed by the page\)/);
    await expect(ws.messageInput).toBeDisabled();
  });

  test('the server closes the connection for an oversized message', async ({ page }) => {
    const ws = new WebSocketPage(page);
    await ws.open();
    await ws.connect();
    await expect(ws.status).toHaveText('Connected');

    await ws.send('x'.repeat(1001));

    // The exact close code is a server detail; what matters is that it closes.
    await expect(ws.status).toHaveText(/^Disconnected \(code \d+/);
    await expect(ws.connectButton).toBeEnabled();
  });

  test('can be fully mocked with page.routeWebSocket', async ({ page }) => {
    // No server involved: Playwright answers the handshake and the messages.
    await page.routeWebSocket('**/websocket/echo', (ws) => {
      ws.onMessage((message) => {
        ws.send(`Echo: ${message.toString()}`);
      });
    });

    const ws = new WebSocketPage(page);
    await ws.open();
    await ws.connect();
    await expect(ws.status).toHaveText('Connected');

    await ws.send('mocked message');
    await expect(ws.messages.last()).toHaveText('Echo: mocked message');
  });
});
