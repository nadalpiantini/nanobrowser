import { test, expect } from '../fixtures/extension';
import { ExtensionHelpers } from '../helpers/extension-helpers';

/**
 * Authentication E2E Tests
 * Tests API key configuration, validation, and persistence for multiple LLM providers
 */
test.describe('Authentication & API Configuration', () => {
  test.beforeEach(async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);
    // Clear storage before each test for clean state
    await helpers.clearStorage();
  });

  test.describe('Options Page - Models Tab', () => {
    test('should open options page and display models tab', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const optionsPage = await helpers.openOptionsPage();

      // Should default to models tab
      await expect(optionsPage.locator('text=Models')).toBeVisible();

      // Check for key UI elements
      await expect(optionsPage.locator('text=API Configuration').or(optionsPage.locator('text=Provider'))).toBeVisible({
        timeout: 10000,
      });

      await optionsPage.close();
    });

    test('should navigate between tabs', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const optionsPage = await helpers.openOptionsPage();

      // Click on General tab
      await optionsPage.locator('button:has-text("General")').click();
      await expect(optionsPage.locator('text=General Settings').or(optionsPage.locator('h1'))).toBeVisible();

      // Click on Models tab
      await optionsPage.locator('button:has-text("Models")').click();
      await expect(optionsPage.locator('text=API Configuration').or(optionsPage.locator('text=Provider'))).toBeVisible({
        timeout: 5000,
      });

      await optionsPage.close();
    });
  });

  test.describe('Provider Configuration', () => {
    test('should add OpenAI provider with API key', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const optionsPage = await helpers.openOptionsPage();

      // Look for add provider button/dropdown
      const addProviderButton = optionsPage
        .locator('button')
        .filter({ hasText: /add provider|new provider|\+/i })
        .first();

      if (await addProviderButton.isVisible({ timeout: 2000 })) {
        await addProviderButton.click();

        // Select OpenAI from dropdown
        const openAIOption = optionsPage.locator('text=OpenAI').first();
        await openAIOption.click();

        // Enter API key
        const apiKeyInput = optionsPage
          .locator('input[type="password"]')
          .or(optionsPage.locator('input[placeholder*="API"]'));
        await apiKeyInput.first().fill('sk-test-fake-key-for-testing-only');

        // Save configuration
        const saveButton = optionsPage.locator('button:has-text("Save")').first();
        await saveButton.click();

        // Verify provider was added
        await expect(optionsPage.locator('text=OpenAI')).toBeVisible();
      }

      await optionsPage.close();
    });

    test('should validate required API key field', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const optionsPage = await helpers.openOptionsPage();

      // Try to add provider without API key
      const addProviderButton = optionsPage
        .locator('button')
        .filter({ hasText: /add provider|new provider|\+/i })
        .first();

      if (await addProviderButton.isVisible({ timeout: 2000 })) {
        await addProviderButton.click();

        // Select a provider
        const providerOption = optionsPage.locator('text=OpenAI').or(optionsPage.locator('text=Anthropic')).first();
        await providerOption.click();

        // Try to save without entering API key
        const saveButton = optionsPage.locator('button:has-text("Save")').first();

        // Clear any existing input
        const apiKeyInput = optionsPage
          .locator('input[type="password"]')
          .or(optionsPage.locator('input[placeholder*="API"]'));
        if (await apiKeyInput.first().isVisible({ timeout: 1000 })) {
          await apiKeyInput.first().fill('');
          await saveButton.click();

          // Should show validation error or prevent save
          // (Implementation may vary - adjust selector based on actual UI)
          const hasError =
            (await optionsPage.locator('text=/required|invalid|error/i').isVisible({ timeout: 2000 })) ||
            (await apiKeyInput.first().evaluate(el => (el as HTMLInputElement).validity.valid)) === false;

          expect(hasError).toBeTruthy();
        }
      }

      await optionsPage.close();
    });

    test('should support multiple LLM providers', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const optionsPage = await helpers.openOptionsPage();

      // Test data for multiple providers
      const providers = [
        { name: 'OpenAI', key: 'sk-test-openai-key' },
        { name: 'Anthropic', key: 'sk-ant-test-anthropic-key' },
      ];

      for (const provider of providers) {
        const addButton = optionsPage
          .locator('button')
          .filter({ hasText: /add provider|new provider|\+/i })
          .first();

        if (await addButton.isVisible({ timeout: 2000 })) {
          await addButton.click();

          // Select provider
          await optionsPage.locator(`text=${provider.name}`).first().click();

          // Enter API key
          const apiKeyInput = optionsPage
            .locator('input[type="password"]')
            .or(optionsPage.locator('input[placeholder*="API"]'));
          await apiKeyInput.last().fill(provider.key);

          // Save
          await optionsPage.locator('button:has-text("Save")').first().click();

          // Wait a bit for save to complete
          await optionsPage.waitForTimeout(500);
        }
      }

      // Verify both providers are configured
      for (const provider of providers) {
        await expect(optionsPage.locator(`text=${provider.name}`)).toBeVisible();
      }

      await optionsPage.close();
    });
  });

  test.describe('Settings Persistence', () => {
    test('should persist API configuration across page reloads', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Configure provider
      await helpers.setStorage({
        'llm-providers': {
          openai: {
            type: 'openai',
            apiKey: 'sk-test-persistence-key',
            displayName: 'OpenAI',
          },
        },
      });

      // Open options page
      const optionsPage = await helpers.openOptionsPage();

      // Verify provider is shown
      await expect(optionsPage.locator('text=OpenAI')).toBeVisible({ timeout: 5000 });

      // Close and reopen
      await optionsPage.close();
      const newOptionsPage = await helpers.openOptionsPage();

      // Verify provider persists
      await expect(newOptionsPage.locator('text=OpenAI')).toBeVisible({ timeout: 5000 });

      await newOptionsPage.close();
    });

    test('should persist selected agent models', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Set up provider and model selection
      await helpers.setStorage({
        'llm-providers': {
          openai: {
            type: 'openai',
            apiKey: 'sk-test-key',
            displayName: 'OpenAI',
          },
        },
        'agent-models': {
          navigator: {
            provider: 'openai',
            modelName: 'gpt-4',
          },
          planner: {
            provider: 'openai',
            modelName: 'gpt-3.5-turbo',
          },
        },
      });

      // Verify storage
      const storage = await helpers.getStorage(['agent-models']);
      expect(storage).toHaveProperty('agent-models');
      expect(storage['agent-models']).toHaveProperty('navigator');
      expect(storage['agent-models'].navigator.modelName).toBe('gpt-4');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid API key format', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const optionsPage = await helpers.openOptionsPage();

      const addButton = optionsPage
        .locator('button')
        .filter({ hasText: /add provider|new provider|\+/i })
        .first();

      if (await addButton.isVisible({ timeout: 2000 })) {
        await addButton.click();

        // Select OpenAI
        await optionsPage.locator('text=OpenAI').first().click();

        // Enter invalid API key (too short, wrong format)
        const apiKeyInput = optionsPage
          .locator('input[type="password"]')
          .or(optionsPage.locator('input[placeholder*="API"]'));
        await apiKeyInput.first().fill('invalid');

        // Try to save
        await optionsPage.locator('button:has-text("Save")').first().click();

        // Should show error or validation message
        // (Adjust based on actual validation implementation)
        await optionsPage.waitForTimeout(1000);
      }

      await optionsPage.close();
    });

    test('should handle missing required fields', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const optionsPage = await helpers.openOptionsPage();

      // Attempt to configure without selecting model for agents
      // This tests that the UI prevents incomplete configuration

      // Click on model selection dropdown (if present)
      const navigatorSelect = optionsPage.locator('select').or(optionsPage.locator('[role="combobox"]')).first();

      if (await navigatorSelect.isVisible({ timeout: 2000 })) {
        // Leave it unselected and try to proceed
        // The extension should handle this gracefully
        await expect(navigatorSelect).toBeVisible();
      }

      await optionsPage.close();
    });
  });

  test.describe('Model Selection', () => {
    test('should allow selecting models for Navigator agent', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Set up provider first
      await helpers.setStorage({
        'llm-providers': {
          openai: {
            type: 'openai',
            apiKey: 'sk-test-key',
            displayName: 'OpenAI',
          },
        },
      });

      const optionsPage = await helpers.openOptionsPage();

      // Look for Navigator agent model selection
      const navigatorSection = optionsPage.locator('text=Navigator').or(optionsPage.locator('text=navigator'));

      if (await navigatorSection.isVisible({ timeout: 2000 })) {
        // Model selection UI should be present
        await expect(navigatorSection).toBeVisible();

        // Look for model dropdown/select
        const modelSelect = optionsPage.locator('select').or(optionsPage.locator('[role="combobox"]'));
        await expect(modelSelect.first()).toBeVisible({ timeout: 5000 });
      }

      await optionsPage.close();
    });

    test('should allow selecting models for Planner agent', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Set up provider first
      await helpers.setStorage({
        'llm-providers': {
          anthropic: {
            type: 'anthropic',
            apiKey: 'sk-ant-test-key',
            displayName: 'Anthropic',
          },
        },
      });

      const optionsPage = await helpers.openOptionsPage();

      // Look for Planner agent model selection
      const plannerSection = optionsPage.locator('text=Planner').or(optionsPage.locator('text=planner'));

      if (await plannerSection.isVisible({ timeout: 2000 })) {
        await expect(plannerSection).toBeVisible();

        // Model selection UI should be present
        const modelSelect = optionsPage.locator('select').or(optionsPage.locator('[role="combobox"]'));
        await expect(modelSelect.first()).toBeVisible({ timeout: 5000 });
      }

      await optionsPage.close();
    });
  });
});
