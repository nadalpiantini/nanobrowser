import { test, expect } from '../fixtures/extension';
import { ExtensionHelpers } from '../helpers/extension-helpers';

/**
 * Basic extension setup and loading tests
 * Verifies that the extension loads correctly and core functionality is accessible
 */
test.describe('Extension Setup', () => {
  test('should load extension successfully', async ({ context, extensionId }) => {
    expect(extensionId).toBeTruthy();
    expect(extensionId).toMatch(/^[a-z]{32}$/); // Chrome extension ID format

    const serviceWorkers = context.serviceWorkers();
    expect(serviceWorkers.length).toBeGreaterThan(0);
  });

  test('should open options page', async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);
    const optionsPage = await helpers.openOptionsPage();

    expect(optionsPage.url()).toContain('options/index.html');
    await expect(optionsPage.locator('body')).toBeVisible();

    await optionsPage.close();
  });

  test('should open side panel', async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);
    const sidePanelPage = await helpers.openSidePanel();

    expect(sidePanelPage.url()).toContain('side-panel/index.html');
    await expect(sidePanelPage.locator('body')).toBeVisible();

    await sidePanelPage.close();
  });

  test('should have extension storage available', async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);

    // Test setting storage
    await helpers.setStorage({ testKey: 'testValue' });

    // Test getting storage
    const storage = await helpers.getStorage<{ testKey: string }>('testKey');
    expect(storage.testKey).toBe('testValue');

    // Test clearing storage
    await helpers.clearStorage();
    const emptyStorage = await helpers.getStorage();
    expect(Object.keys(emptyStorage).length).toBe(0);
  });

  test('should wait for extension to be ready', async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);

    // Should not throw
    await expect(helpers.waitForExtensionReady()).resolves.not.toThrow();
  });
});
