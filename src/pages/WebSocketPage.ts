import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * /websocket - a real echo server that closes after 30s idle, 100 messages,
 * or a message longer than 1000 characters.
 */
export class WebSocketPage extends BasePage {
  // Buttons are matched by id because "Connect" is a substring of "Disconnect".
  readonly connectButton: Locator = this.page.locator('#connect');
  readonly disconnectButton: Locator = this.page.locator('#disconnect');
  readonly sendButton: Locator = this.page.locator('#send');
  readonly messageInput: Locator = this.page.locator('#message');
  readonly status: Locator = this.page.locator('#connection');
  readonly messages: Locator = this.page.locator('#messages li');

  async open(): Promise<void> {
    await this.goto('/websocket');
  }

  async connect(): Promise<void> {
    await this.connectButton.click();
  }

  async send(text: string): Promise<void> {
    await this.messageInput.fill(text);
    await this.sendButton.click();
  }

  async disconnect(): Promise<void> {
    await this.disconnectButton.click();
  }
}
