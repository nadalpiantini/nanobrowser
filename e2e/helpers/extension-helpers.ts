import type { BrowserContext, Page } from '@playwright/test';

/**
 * Helper utilities for interacting with FreeJack extension
 */
export class ExtensionHelpers {
  constructor(
    private context: BrowserContext,
    private extensionId: string,
  ) {}

  /**
   * Open extension options page
   */
  async openOptionsPage(): Promise<Page> {
    const optionsUrl = `chrome-extension://${this.extensionId}/options/index.html`;
    const page = await this.context.newPage();
    await page.goto(optionsUrl);
    await page.waitForLoadState('domcontentloaded');
    return page;
  }

  /**
   * Open extension side panel
   */
  async openSidePanel(): Promise<Page> {
    const sidePanelUrl = `chrome-extension://${this.extensionId}/side-panel/index.html`;
    const page = await this.context.newPage();
    await page.goto(sidePanelUrl);
    await page.waitForLoadState('domcontentloaded');
    return page;
  }

  /**
   * Get background service worker page
   */
  async getBackgroundPage(): Promise<Page> {
    const [background] = this.context.serviceWorkers();
    if (!background) {
      throw new Error('Background service worker not found');
    }
    // Note: Service workers don't have a traditional page interface
    // Use chrome.runtime.sendMessage for communication instead
    throw new Error('Use chrome.runtime.sendMessage to communicate with background');
  }

  /**
   * Wait for extension to be ready
   */
  async waitForExtensionReady(timeout = 5000): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const workers = this.context.serviceWorkers();
      if (workers.length > 0) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    throw new Error(`Extension not ready after ${timeout}ms`);
  }

  /**
   * Evaluate script in extension context
   */
  async evaluateInExtension<T>(script: string | (() => T)): Promise<T> {
    const page = await this.openOptionsPage();
    const result = await page.evaluate(script);
    await page.close();
    return result;
  }

  /**
   * Send message to background service worker
   */
  async sendMessageToBackground(message: unknown): Promise<unknown> {
    return this.evaluateInExtension(() => {
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, response => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        });
      });
    });
  }

  /**
   * Get extension storage data
   */
  async getStorage<T = unknown>(keys?: string | string[]): Promise<T> {
    return this.evaluateInExtension(() => {
      return new Promise(resolve => {
        chrome.storage.local.get(keys as string | string[], result => {
          resolve(result);
        });
      });
    });
  }

  /**
   * Set extension storage data
   */
  async setStorage(items: Record<string, unknown>): Promise<void> {
    await this.evaluateInExtension(() => {
      return new Promise<void>(resolve => {
        chrome.storage.local.set(items, () => resolve());
      });
    });
  }

  /**
   * Clear extension storage
   */
  async clearStorage(): Promise<void> {
    await this.evaluateInExtension(() => {
      return new Promise<void>(resolve => {
        chrome.storage.local.clear(() => resolve());
      });
    });
  }
}
