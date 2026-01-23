import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright configuration for FreeJack E2E tests
 * Tests Chrome extension functionality including auth, agents, and interactions
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Extension tests should run sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Chrome extension needs single worker to avoid conflicts
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Chrome extension testing requires persistent context
        channel: 'chrome',
      },
    },
  ],

  // Build extension before running tests
  webServer: undefined, // Extension doesn't need web server
});
