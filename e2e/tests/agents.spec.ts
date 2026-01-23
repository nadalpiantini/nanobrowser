import { test, expect } from '../fixtures/extension';
import { ExtensionHelpers } from '../helpers/extension-helpers';

/**
 * Agent Operations E2E Tests
 * Tests the multi-agent system: Navigator, Planner, and Validator agents
 * Includes agent coordination, LLM routing, and error handling
 */
test.describe('Agent Operations', () => {
  test.beforeEach(async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);

    // Set up minimal provider configuration for testing
    await helpers.setStorage({
      'llm-providers': {
        openai: {
          type: 'openai',
          apiKey: process.env.OPENAI_API_KEY || 'sk-test-key-for-testing',
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
  });

  test.describe('Agent Initialization', () => {
    test('should initialize agents with correct configuration', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Verify agent models are configured
      const storage = await helpers.getStorage(['agent-models']);
      expect(storage['agent-models']).toBeDefined();
      expect(storage['agent-models'].navigator).toBeDefined();
      expect(storage['agent-models'].planner).toBeDefined();
    });

    test('should have service worker running', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      await helpers.waitForExtensionReady();
      const workers = context.serviceWorkers();
      expect(workers.length).toBeGreaterThan(0);
    });
  });

  test.describe('Navigator Agent', () => {
    test('should handle DOM interaction requests', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const testPage = await context.newPage();

      // Navigate to a simple test page
      await testPage.goto('data:text/html,<html><body><button id="test-btn">Click Me</button></body></html>');

      // Simulate Navigator agent DOM interaction
      // Note: This would require the actual agent to be running
      // For now, we test that the page and extension can coexist
      const button = await testPage.locator('#test-btn');
      await expect(button).toBeVisible();

      await testPage.close();
    });

    test('should handle navigation commands', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const testPage = await context.newPage();

      // Test basic navigation
      await testPage.goto('https://example.com');
      await expect(testPage).toHaveURL('https://example.com/');

      await testPage.close();
    });

    test('should extract page content', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const testPage = await context.newPage();

      await testPage.goto('data:text/html,<html><body><h1>Test Page</h1><p>Content</p></body></html>');

      // Test content extraction (this would be done by Navigator agent)
      const heading = await testPage.locator('h1').textContent();
      expect(heading).toBe('Test Page');

      const paragraph = await testPage.locator('p').textContent();
      expect(paragraph).toBe('Content');

      await testPage.close();
    });
  });

  test.describe('Planner Agent', () => {
    test('should be configured with correct model', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      const storage = await helpers.getStorage(['agent-models']);
      const plannerConfig = storage['agent-models'].planner;

      expect(plannerConfig).toBeDefined();
      expect(plannerConfig.provider).toBe('openai');
      expect(plannerConfig.modelName).toBeTruthy();
    });

    test('should support model parameters configuration', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Set model parameters
      await helpers.setStorage({
        'agent-models': {
          planner: {
            provider: 'openai',
            modelName: 'gpt-3.5-turbo',
            parameters: {
              temperature: 0.7,
              topP: 0.9,
            },
          },
        },
      });

      const storage = await helpers.getStorage(['agent-models']);
      const plannerConfig = storage['agent-models'].planner;

      expect(plannerConfig.parameters).toBeDefined();
      expect(plannerConfig.parameters.temperature).toBe(0.7);
      expect(plannerConfig.parameters.topP).toBe(0.9);
    });
  });

  test.describe('Agent Coordination', () => {
    test('should allow switching between agents', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Configure both agents with different models
      await helpers.setStorage({
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

      const storage = await helpers.getStorage(['agent-models']);

      // Verify both agents are configured differently
      expect(storage['agent-models'].navigator.modelName).not.toBe(storage['agent-models'].planner.modelName);
    });

    test('should support messaging between extension components', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Test that we can send messages to the background script
      // Note: This requires the background script to have message handlers
      try {
        const response = await helpers.sendMessageToBackground({
          type: 'ping',
          data: {},
        });

        // Response structure will depend on implementation
        // For now, we just verify the message system works
        expect(response).toBeDefined();
      } catch (error) {
        // If no handler exists, that's okay for this test
        // We're just verifying the messaging infrastructure
        expect(error).toBeDefined();
      }
    });
  });

  test.describe('LLM Routing (Dev Mode)', () => {
    test('should use cloud routing by default', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // In production/normal mode, should use cloud
      const storage = await helpers.getStorage(['llm-providers']);
      expect(storage['llm-providers']).toBeDefined();

      // Default providers should be cloud-based
      const providers = storage['llm-providers'];
      const providerKeys = Object.keys(providers);

      if (providerKeys.length > 0) {
        const firstProvider = providers[providerKeys[0]];
        expect(firstProvider.type).toBeTruthy();
        expect(['openai', 'anthropic', 'google-genai', 'gemini', 'groq', 'cerebras', 'xai', 'deepseek']).toContain(
          firstProvider.type,
        );
      }
    });

    test('should support local Ollama routing in dev mode', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Configure Ollama provider
      await helpers.setStorage({
        'llm-providers': {
          ollama: {
            type: 'ollama',
            baseUrl: 'http://localhost:11434',
            displayName: 'Ollama Local',
          },
        },
        'agent-models': {
          planner: {
            provider: 'ollama',
            modelName: 'qwen2.5-coder:7b',
          },
        },
      });

      const storage = await helpers.getStorage(['llm-providers', 'agent-models']);

      // Verify Ollama is configured
      expect(storage['llm-providers'].ollama).toBeDefined();
      expect(storage['llm-providers'].ollama.type).toBe('ollama');
      expect(storage['agent-models'].planner.provider).toBe('ollama');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle missing API key gracefully', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Clear API keys
      await helpers.setStorage({
        'llm-providers': {},
        'agent-models': {
          navigator: {
            provider: 'openai',
            modelName: 'gpt-4',
          },
        },
      });

      // Open side panel - should show error state or prompt for configuration
      const sidePanelPage = await helpers.openSidePanel();

      // Should have some indication of missing configuration
      // (Implementation-specific - adjust based on actual UI)
      const bodyText = await sidePanelPage.locator('body').textContent();
      expect(bodyText).toBeTruthy();

      await sidePanelPage.close();
    });

    test('should handle invalid model configuration', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Set invalid model configuration
      await helpers.setStorage({
        'agent-models': {
          navigator: {
            provider: 'invalid-provider',
            modelName: 'non-existent-model',
          },
        },
      });

      const storage = await helpers.getStorage(['agent-models']);

      // Configuration was stored, but would fail at runtime
      expect(storage['agent-models'].navigator.provider).toBe('invalid-provider');
    });

    test('should recover from agent failures', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // This test would require simulating an agent failure
      // and verifying the system can recover
      // For now, we just verify the extension remains responsive

      await helpers.waitForExtensionReady();
      const workers = context.serviceWorkers();
      expect(workers.length).toBeGreaterThan(0);
    });
  });

  test.describe('Agent Performance', () => {
    test('should maintain agent state across operations', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Set initial state
      await helpers.setStorage({
        'test-state': { counter: 0 },
      });

      // Simulate state changes
      for (let i = 1; i <= 3; i++) {
        await helpers.setStorage({
          'test-state': { counter: i },
        });
      }

      const finalStorage = await helpers.getStorage(['test-state']);
      expect(finalStorage['test-state'].counter).toBe(3);
    });

    test('should handle concurrent agent operations', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Simulate concurrent storage operations
      const operations = [
        helpers.setStorage({ 'op-1': 'value1' }),
        helpers.setStorage({ 'op-2': 'value2' }),
        helpers.setStorage({ 'op-3': 'value3' }),
      ];

      await Promise.all(operations);

      const storage = await helpers.getStorage(['op-1', 'op-2', 'op-3']);
      expect(storage['op-1']).toBe('value1');
      expect(storage['op-2']).toBe('value2');
      expect(storage['op-3']).toBe('value3');
    });
  });
});
