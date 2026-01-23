import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        '--disable-dev-shm-usage',
      ],
      timeout: 60000, // Increase timeout for extension load
    });

    // Wait a bit for extension to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));

    await use(context);
    await context.close();
  },

  // Get extension ID for accessing extension pages
  extensionId: async ({ context }, use) => {
    // Service worker is registered by the extension
    // Wait for service workers with timeout
    let background = context.serviceWorkers()[0];

    if (!background) {
      try {
        background = await context.waitForEvent('serviceworker', { timeout: 30000 });
      } catch {
        // If no service worker event, try to get it again
        const workers = context.serviceWorkers();
        if (workers.length > 0) {
          background = workers[0];
        } else {
          throw new Error(
            'Extension service worker failed to load. Check that dist/ directory exists and contains valid extension.',
          );
        }
      }
    }

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export { expect } from '@playwright/test';
