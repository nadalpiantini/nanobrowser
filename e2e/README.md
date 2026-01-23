# FreeJack E2E Testing Guide

End-to-end testing setup for FreeJack Chrome extension using Playwright.

## 📋 Overview

This E2E test suite covers:

- ✅ Extension setup and loading
- ✅ Authentication & API configuration
- ✅ Multi-agent operations (Navigator, Planner, Validator)
- ✅ User interactions (chat interface, task execution)
- ✅ Error handling and recovery
- ✅ Settings persistence
- ✅ Multi-turn conversations

## 🚀 Quick Start

### Prerequisites

```bash
# Ensure extension is built
pnpm build

# Install dependencies (Playwright already installed)
pnpm install
```

### Running Tests

```bash
# Run all E2E tests
pnpm e2e

# Run with UI mode (recommended for development)
pnpm e2e:ui

# Run with debugger
pnpm e2e:debug

# Run specific test file
pnpm playwright test e2e/tests/auth.spec.ts

# Run specific test by name
pnpm playwright test -g "should add OpenAI provider"
```

## 📁 Test Structure

```
e2e/
├── fixtures/
│   └── extension.ts          # Extension loading fixture
├── helpers/
│   └── extension-helpers.ts  # Helper utilities
├── tests/
│   ├── extension-setup.spec.ts    # Basic setup tests
│   ├── auth.spec.ts                # Authentication tests
│   ├── agents.spec.ts              # Agent operation tests
│   └── user-interactions.spec.ts   # UI interaction tests
├── MANUAL_TESTING_CHECKLIST.md     # Manual testing guide
└── README.md                       # This file
```

## 🧪 Test Categories

### 1. Extension Setup (`extension-setup.spec.ts`)

Basic extension loading and initialization:
- Extension loads successfully
- Options and side panel pages accessible
- Storage APIs working
- Service worker running

### 2. Authentication (`auth.spec.ts`)

API key configuration and provider management:
- Adding/editing/deleting providers (OpenAI, Anthropic, Gemini, Ollama)
- API key validation
- Settings persistence
- Model selection for agents
- Multi-provider support

### 3. Agent Operations (`agents.spec.ts`)

Multi-agent system functionality:
- Navigator agent (DOM interactions, navigation)
- Planner agent (task planning)
- Agent coordination and messaging
- LLM routing (cloud vs local)
- Error handling and recovery
- Model parameters configuration

### 4. User Interactions (`user-interactions.spec.ts`)

User-facing features:
- Side panel chat interface
- Message input and display
- Task status updates
- Task control (stop, pause)
- Error feedback
- Multi-turn conversations
- Session management

## 🔧 Helper Utilities

### ExtensionHelpers

Utility class for interacting with the extension:

```typescript
import { ExtensionHelpers } from '../helpers/extension-helpers';

const helpers = new ExtensionHelpers(context, extensionId);

// Open extension pages
const optionsPage = await helpers.openOptionsPage();
const sidePanelPage = await helpers.openSidePanel();

// Storage operations
await helpers.setStorage({ key: 'value' });
const data = await helpers.getStorage(['key']);
await helpers.clearStorage();

// Extension communication
const response = await helpers.sendMessageToBackground({ type: 'ping' });

// Wait for extension ready
await helpers.waitForExtensionReady();
```

## ⚙️ Configuration

### Environment Variables

For testing with real API keys (optional):

```bash
# .env.local
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
```

**Note:** Tests use mock/test keys by default. Real keys only needed for integration testing.

### Playwright Config

See `playwright.config.ts` for configuration:

- **Test directory:** `./e2e`
- **Workers:** 1 (sequential execution for extension tests)
- **Retries:** 2 in CI, 0 locally
- **Reporters:** HTML + List
- **Screenshots:** On failure
- **Videos:** On failure

## 📊 Test Reports

After running tests:

```bash
# Open HTML report
pnpm playwright show-report

# Reports are in: playwright-report/
```

## 🐛 Debugging Tests

### UI Mode (Recommended)

```bash
pnpm e2e:ui
```

- Step through tests
- Inspect DOM
- See browser in real-time
- Time travel debugging

### Debug Mode

```bash
pnpm e2e:debug
```

- Runs with debugger attached
- Pause execution
- Inspect variables

### Manual Debugging

```typescript
// Add to test
await page.pause(); // Opens Playwright Inspector
```

## ✅ Best Practices

### 1. Independent Tests

Each test should be self-contained:

```typescript
test.beforeEach(async ({ context, extensionId }) => {
  const helpers = new ExtensionHelpers(context, extensionId);
  await helpers.clearStorage(); // Clean slate
});
```

### 2. Explicit Waits

Use proper wait conditions:

```typescript
// ✅ Good
await page.locator('button').waitFor({ state: 'visible' });
await expect(page.locator('text=Success')).toBeVisible({ timeout: 5000 });

// ❌ Bad
await page.waitForTimeout(5000); // Arbitrary wait
```

### 3. Flexible Selectors

Use resilient selectors:

```typescript
// ✅ Good - multiple strategies
const button = page
  .locator('button:has-text("Submit")')
  .or(page.locator('[aria-label="Submit"]'))
  .first();

// ❌ Bad - brittle
const button = page.locator('.btn-submit-123');
```

### 4. Clean Up

Always close pages:

```typescript
test('my test', async ({ context, extensionId }) => {
  const page = await helpers.openOptionsPage();

  // ... test logic ...

  await page.close(); // Clean up
});
```

## 🚨 Troubleshooting

### Extension Not Loading

```bash
# Rebuild extension
pnpm build

# Check dist/ directory exists
ls -la dist/

# Verify manifest.json present
cat dist/manifest.json
```

### Tests Timing Out

- Increase timeout in test: `{ timeout: 30000 }`
- Check if extension is stuck in error state
- Verify API keys are configured (if needed)
- Check console for errors

### Flaky Tests

- Add proper waits instead of `waitForTimeout`
- Use `toBeVisible({ timeout: X })` for dynamic elements
- Ensure clean state in `beforeEach`
- Check for race conditions

### Service Worker Issues

Extension service workers can be tricky:

```typescript
// Wait for service worker
const helpers = new ExtensionHelpers(context, extensionId);
await helpers.waitForExtensionReady();

// Check service workers
const workers = context.serviceWorkers();
console.log('Active workers:', workers.length);
```

## 📝 Writing New Tests

### Template

```typescript
import { test, expect } from '../fixtures/extension';
import { ExtensionHelpers } from '../helpers/extension-helpers';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);
    // Setup
  });

  test('should do something', async ({ context, extensionId }) => {
    const helpers = new ExtensionHelpers(context, extensionId);
    const page = await helpers.openSidePanel();

    // Test logic
    await expect(page.locator('button')).toBeVisible();

    await page.close();
  });
});
```

## 🔄 Continuous Integration

### GitHub Actions (Example)

```yaml
- name: Install dependencies
  run: pnpm install

- name: Install Playwright browsers
  run: pnpm playwright install chromium

- name: Build extension
  run: pnpm build

- name: Run E2E tests
  run: pnpm e2e

- name: Upload test results
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Chrome Extension Testing](https://playwright.dev/docs/chrome-extensions)
- [Manual Testing Checklist](./MANUAL_TESTING_CHECKLIST.md)
- [FreeJack Documentation](../README.md)

## 🤝 Contributing

When adding new tests:

1. Follow existing test structure
2. Add descriptive test names
3. Include comments for complex logic
4. Ensure tests are independent
5. Clean up resources (close pages)
6. Update this README if needed

---

**Questions?** Check the [main project documentation](../README.md) or open an issue.
