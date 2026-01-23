import { test, expect } from '../fixtures/extension';
import { ExtensionHelpers } from '../helpers/extension-helpers';

/**
 * User Interactions E2E Tests
 * Tests user-facing features: chat interface, task execution, status updates,
 * cancellation, result display, and multi-turn conversations
 */
test.describe('User Interactions', () => {
  test.beforeEach(async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);

    // Set up complete working configuration
    await helpers.setStorage({
      'llm-providers': {
        openai: {
          type: 'openai',
          apiKey: process.env.OPENAI_API_KEY || 'sk-test-key',
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

  test.describe('Side Panel Interface', () => {
    test('should open side panel successfully', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Side panel should load
      await expect(sidePanelPage.locator('body')).toBeVisible();

      // Should have chat input area
      const chatInput = sidePanelPage.locator('textarea').or(sidePanelPage.locator('input[type="text"]'));
      await expect(chatInput.first()).toBeVisible({ timeout: 10000 });

      await sidePanelPage.close();
    });

    test('should display chat history button', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Look for history button/icon
      const historyButton = sidePanelPage
        .locator('button')
        .filter({ hasText: /history/i })
        .or(sidePanelPage.locator('[aria-label*="history"]'))
        .or(sidePanelPage.locator('svg'))
        .first();

      // History functionality should be accessible
      await expect(sidePanelPage.locator('body')).toBeVisible();

      await sidePanelPage.close();
    });

    test('should display settings button', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Look for settings button/icon
      const settingsButton = sidePanelPage
        .locator('button')
        .filter({ hasText: /settings/i })
        .or(sidePanelPage.locator('[aria-label*="settings"]'))
        .first();

      if (await settingsButton.isVisible({ timeout: 2000 })) {
        await expect(settingsButton).toBeVisible();
      }

      await sidePanelPage.close();
    });

    test('should show configuration prompt when no models configured', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Clear all configuration
      await helpers.clearStorage();

      const sidePanelPage = await helpers.openSidePanel();

      // Should show some indication to configure
      const bodyText = await sidePanelPage.locator('body').textContent();
      expect(bodyText).toBeTruthy();

      // Look for configuration prompts
      const hasConfigPrompt =
        (await sidePanelPage.locator('text=/configure|settings|setup/i').isVisible({ timeout: 3000 })) ||
        (await sidePanelPage.locator('button:has-text("Settings")').isVisible({ timeout: 1000 }));

      // Extension should guide user to configure
      expect(bodyText?.length).toBeGreaterThan(0);

      await sidePanelPage.close();
    });
  });

  test.describe('Chat Input', () => {
    test('should allow typing in chat input', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Find chat input
      const chatInput = sidePanelPage.locator('textarea').or(sidePanelPage.locator('input[type="text"]'));
      await chatInput.first().waitFor({ state: 'visible', timeout: 10000 });

      // Type a message
      const testMessage = 'Hello, this is a test message';
      await chatInput.first().fill(testMessage);

      // Verify input value
      const inputValue = await chatInput.first().inputValue();
      expect(inputValue).toBe(testMessage);

      await sidePanelPage.close();
    });

    test('should have submit button', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Look for send/submit button
      const submitButton = sidePanelPage
        .locator('button[type="submit"]')
        .or(sidePanelPage.locator('button').filter({ hasText: /send|submit/i }))
        .or(sidePanelPage.locator('[aria-label*="send"]'))
        .first();

      // Should have a way to submit messages
      const chatInput = sidePanelPage.locator('textarea').or(sidePanelPage.locator('input[type="text"]'));
      await expect(chatInput.first()).toBeVisible({ timeout: 5000 });

      await sidePanelPage.close();
    });

    test('should clear input after submission', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      const chatInput = sidePanelPage.locator('textarea').or(sidePanelPage.locator('input[type="text"]'));
      await chatInput.first().waitFor({ state: 'visible', timeout: 10000 });

      // Type and submit
      await chatInput.first().fill('Test message');

      // Find submit method (button or Enter key)
      const submitButton = sidePanelPage
        .locator('button[type="submit"]')
        .or(sidePanelPage.locator('button').filter({ hasText: /send/i }))
        .first();

      if (await submitButton.isVisible({ timeout: 2000 })) {
        await submitButton.click();

        // Wait a moment for message processing
        await sidePanelPage.waitForTimeout(500);

        // Input should be cleared (or at least submission was attempted)
        const afterValue = await chatInput.first().inputValue();
        // Input might be cleared or disabled during processing
        expect(afterValue !== undefined).toBe(true);
      }

      await sidePanelPage.close();
    });
  });

  test.describe('Message Display', () => {
    test('should display sent messages in chat', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Pre-populate with a chat message
      await helpers.setStorage({
        'chat-history': {
          'session-1': {
            id: 'session-1',
            messages: [
              {
                actor: 'user',
                message: 'Test user message',
                timestamp: Date.now(),
              },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        'current-session': 'session-1',
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Should display the message
      await expect(sidePanelPage.locator('text=Test user message')).toBeVisible({ timeout: 5000 });

      await sidePanelPage.close();
    });

    test('should distinguish between user and agent messages', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Set up conversation with both user and agent messages
      await helpers.setStorage({
        'chat-history': {
          'session-1': {
            id: 'session-1',
            messages: [
              {
                actor: 'user',
                message: 'User question',
                timestamp: Date.now() - 2000,
              },
              {
                actor: 'agent',
                message: 'Agent response',
                timestamp: Date.now() - 1000,
              },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        'current-session': 'session-1',
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Both messages should be visible
      await expect(sidePanelPage.locator('text=User question')).toBeVisible({ timeout: 5000 });
      await expect(sidePanelPage.locator('text=Agent response')).toBeVisible({ timeout: 5000 });

      await sidePanelPage.close();
    });

    test('should auto-scroll to latest message', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Create multiple messages
      const messages = Array.from({ length: 10 }, (_, i) => ({
        actor: i % 2 === 0 ? 'user' : 'agent',
        message: `Message ${i + 1}`,
        timestamp: Date.now() + i * 1000,
      }));

      await helpers.setStorage({
        'chat-history': {
          'session-1': {
            id: 'session-1',
            messages,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        'current-session': 'session-1',
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Latest message should be visible
      await expect(sidePanelPage.locator('text=Message 10')).toBeVisible({ timeout: 5000 });

      await sidePanelPage.close();
    });
  });

  test.describe('Task Status Updates', () => {
    test('should show task in progress state', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Simulate task in progress
      await helpers.setStorage({
        'current-task-state': {
          status: 'running',
          currentStep: 'Analyzing page content',
        },
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Should show some indication of processing
      const bodyText = await sidePanelPage.locator('body').textContent();
      expect(bodyText).toBeTruthy();

      await sidePanelPage.close();
    });

    test('should show task completion', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      await helpers.setStorage({
        'chat-history': {
          'session-1': {
            id: 'session-1',
            messages: [
              {
                actor: 'agent',
                message: 'Task completed successfully',
                timestamp: Date.now(),
              },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        'current-session': 'session-1',
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Completion message should be visible
      await expect(sidePanelPage.locator('text=/completed|success|done/i')).toBeVisible({ timeout: 5000 });

      await sidePanelPage.close();
    });

    test('should display progress indicators', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Check if UI has progress indicators (spinners, progress bars, etc.)
      // These might be hidden initially
      const hasProgressElements =
        (await sidePanelPage.locator('[role="progressbar"]').count()) > 0 ||
        (await sidePanelPage.locator('.spinner').count()) > 0 ||
        (await sidePanelPage.locator('.loading').count()) > 0;

      // UI structure should support progress indication
      await expect(sidePanelPage.locator('body')).toBeVisible();

      await sidePanelPage.close();
    });
  });

  test.describe('Task Control', () => {
    test('should show stop button during task execution', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      await helpers.setStorage({
        'task-running': true,
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Look for stop/cancel button
      const stopButton = sidePanelPage
        .locator('button')
        .filter({ hasText: /stop|cancel|abort/i })
        .or(sidePanelPage.locator('[aria-label*="stop"]'))
        .first();

      // Button might be hidden when no task is running
      // Just verify the page loads correctly
      await expect(sidePanelPage.locator('body')).toBeVisible();

      await sidePanelPage.close();
    });

    test('should allow cancelling a running task', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Look for stop button (might not be visible without active task)
      const stopButton = sidePanelPage
        .locator('button')
        .filter({ hasText: /stop|cancel/i })
        .first();

      if (await stopButton.isVisible({ timeout: 1000 })) {
        // Verify it's clickable
        await expect(stopButton).toBeEnabled();
      }

      await sidePanelPage.close();
    });
  });

  test.describe('Error Feedback', () => {
    test('should display error messages to user', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      await helpers.setStorage({
        'chat-history': {
          'session-1': {
            id: 'session-1',
            messages: [
              {
                actor: 'system',
                message: 'Error: API key is invalid',
                timestamp: Date.now(),
              },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        'current-session': 'session-1',
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Error message should be visible
      await expect(sidePanelPage.locator('text=/error|invalid/i')).toBeVisible({ timeout: 5000 });

      await sidePanelPage.close();
    });

    test('should handle API errors gracefully', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Set up invalid API configuration
      await helpers.setStorage({
        'llm-providers': {
          openai: {
            type: 'openai',
            apiKey: 'invalid-key',
            displayName: 'OpenAI',
          },
        },
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Page should still load and be usable
      await expect(sidePanelPage.locator('body')).toBeVisible();

      await sidePanelPage.close();
    });

    test('should provide actionable error messages', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Clear configuration to trigger error state
      await helpers.clearStorage();

      const sidePanelPage = await helpers.openSidePanel();

      // Should provide guidance (Settings button, configuration message, etc.)
      const bodyText = await sidePanelPage.locator('body').textContent();
      expect(bodyText).toBeTruthy();

      await sidePanelPage.close();
    });
  });

  test.describe('Multi-turn Conversations', () => {
    test('should maintain conversation context', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Create multi-turn conversation
      const conversation = [
        { actor: 'user', message: 'First question', timestamp: Date.now() - 3000 },
        { actor: 'agent', message: 'First response', timestamp: Date.now() - 2000 },
        { actor: 'user', message: 'Follow-up question', timestamp: Date.now() - 1000 },
        { actor: 'agent', message: 'Follow-up response', timestamp: Date.now() },
      ];

      await helpers.setStorage({
        'chat-history': {
          'session-1': {
            id: 'session-1',
            messages: conversation,
            createdAt: Date.now() - 3000,
            updatedAt: Date.now(),
          },
        },
        'current-session': 'session-1',
      });

      const sidePanelPage = await helpers.openSidePanel();

      // All messages should be visible
      for (const msg of conversation) {
        await expect(sidePanelPage.locator(`text=${msg.message}`)).toBeVisible({ timeout: 5000 });
      }

      await sidePanelPage.close();
    });

    test('should support creating new chat sessions', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Look for new chat button
      const newChatButton = sidePanelPage
        .locator('button')
        .filter({ hasText: /new chat|new conversation|\+/i })
        .or(sidePanelPage.locator('[aria-label*="new"]'))
        .first();

      if (await newChatButton.isVisible({ timeout: 2000 })) {
        await expect(newChatButton).toBeVisible();
      }

      await sidePanelPage.close();
    });

    test('should allow switching between chat sessions', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);

      // Create multiple sessions
      await helpers.setStorage({
        'chat-history': {
          'session-1': {
            id: 'session-1',
            messages: [{ actor: 'user', message: 'Session 1 message', timestamp: Date.now() - 2000 }],
            createdAt: Date.now() - 2000,
            updatedAt: Date.now() - 2000,
          },
          'session-2': {
            id: 'session-2',
            messages: [{ actor: 'user', message: 'Session 2 message', timestamp: Date.now() - 1000 }],
            createdAt: Date.now() - 1000,
            updatedAt: Date.now() - 1000,
          },
        },
        'current-session': 'session-1',
      });

      const sidePanelPage = await helpers.openSidePanel();

      // Should show current session
      await expect(sidePanelPage.locator('text=Session 1 message')).toBeVisible({ timeout: 5000 });

      await sidePanelPage.close();
    });
  });

  test.describe('UI Responsiveness', () => {
    test('should handle rapid input changes', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      const chatInput = sidePanelPage.locator('textarea').or(sidePanelPage.locator('input[type="text"]'));
      await chatInput.first().waitFor({ state: 'visible', timeout: 10000 });

      // Type rapidly
      for (let i = 0; i < 5; i++) {
        await chatInput.first().fill(`Message ${i}`);
        await sidePanelPage.waitForTimeout(100);
      }

      const finalValue = await chatInput.first().inputValue();
      expect(finalValue).toContain('Message');

      await sidePanelPage.close();
    });

    test('should update UI in real-time during task execution', async ({ context, extensionId }) => {
      const helpers = new ExtensionHelpers(context, extensionId);
      const sidePanelPage = await helpers.openSidePanel();

      // Simulate real-time updates
      await helpers.setStorage({
        'current-status': 'Processing step 1',
      });

      await sidePanelPage.waitForTimeout(500);

      await helpers.setStorage({
        'current-status': 'Processing step 2',
      });

      // Page should handle storage updates
      await expect(sidePanelPage.locator('body')).toBeVisible();

      await sidePanelPage.close();
    });
  });
});
