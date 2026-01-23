import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';

/**
 * Extension fixture for loading FreeJack Chrome extension
 * Provides persistent context with extension loaded
 */
export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // Override context to load extension
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../../dist');
    const context = await chromium.launchPersistentContext('', {
      headless: false, // Extensions require headed mode
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    await use(context);
    await context.close();
  },

  // Get extension ID for accessing extension pages
  extensionId: async ({ context }, use) => {
    // Service worker is registered by the extension
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent('serviceworker');
    }

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export { expect } from '@playwright/test';
