# 📚 Freejack Developer Documentation

## 🏗️ Architecture Overview

### Multi-Agent System

Freejack employs a sophisticated three-agent architecture for reliable web automation:

```
User Request → Planner → Navigator → Validator → Results
                   ↓           ↓          ↓
               Strategy     Actions   Quality Check
```

#### Agent Responsibilities

**🧭 Navigator Agent**
- DOM manipulation and element interaction
- Page navigation and scrolling
- Form filling and data entry
- Browser automation primitives

**📋 Planner Agent**
- Task decomposition and strategy planning
- Website structure analysis
- Step-by-step execution planning
- Error handling and recovery strategies

**✅ Validator Agent**
- Result verification and quality assurance
- Data extraction validation
- Task completion confirmation
- Error detection and reporting

### Tech Stack

- **Extension Core**: Chrome Extension Manifest V3
- **UI Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build System**: Vite + Turbo (monorepo)
- **Testing**: Playwright (E2E) + Vitest (Unit)
- **AI Integration**: LangChain.js + Multiple Provider APIs

### Monorepo Structure

```
freejack/
├── chrome-extension/          # Main extension manifest
│   ├── src/background/        # Service worker & agents
│   ├── src/content/           # Content scripts
│   └── manifest.js            # Dynamic manifest generation
├── pages/                     # UI pages
│   ├── side-panel/           # Main chat interface
│   └── options/              # Settings page
├── packages/                  # Shared packages
│   ├── shared/               # Common utilities
│   ├── storage/              # Chrome storage abstraction
│   ├── ui/                   # React components
│   ├── i18n/                 # Internationalization
│   └── schema-utils/         # Validation schemas
└── scripts/                   # Build & utility scripts
```

---

## 🔧 Development Setup

### Prerequisites

- **Node.js**: Follow `.nvmrc` (usually v20+)
- **Package Manager**: `pnpm` (required)
- **Git**: For version control
- **Chrome**: For testing

### Quick Start

```bash
# Clone repository
git clone https://github.com/extension/freejack.git
cd freejack

# Install dependencies
pnpm install

# Start development
pnpm dev
```

### Development Commands

```bash
# Core development
pnpm dev                 # Start development mode with hot reload
pnpm build              # Build for production
pnpm test               # Run tests
pnpm lint               # Lint and auto-fix
pnpm type-check         # TypeScript type checking

# Extension-specific
pnpm -F chrome-extension build     # Build only extension
pnpm -F chrome-extension dev       # Development mode for extension
pnpm -F chrome-extension test      # Extension unit tests

# UI pages
pnpm -F side-panel dev              # Development for side panel
pnpm -F options dev                 # Development for options page
```

### Workspace Tips

```bash
# Scoped commands (faster and focused)
pnpm -F <workspace> <command>

# Examples
pnpm -F chrome-extension build
pnpm -F packages/ui lint
pnpm -F packages/storage type-check
pnpm -F pages/side-panel dev
```

---

## 🤖 AI Integration

### Provider Architecture

Freejack supports multiple AI providers through a unified router:

```typescript
// LLM Router Interface
interface LLMProvider {
  name: string;
  models: Model[];
  completion(prompt: string, options?: CompletionOptions): Promise<string>;
  stream?(prompt: string, options?: CompletionOptions): AsyncGenerator<string>;
}

// Usage
const router = new LLMRouter();
router.addProvider(new OpenAIProvider(apiKey));
router.addProvider(new AnthropicProvider(apiKey));
```

### Adding a New Provider

1. **Create Provider Class**
```typescript
// packages/llm-providers/new-provider.ts
export class NewProvider implements LLMProvider {
  name = 'new-provider';
  models = [/* model definitions */];

  async completion(prompt: string, options = {}) {
    // Implementation
  }
}
```

2. **Register Provider**
```typescript
// chrome-extension/src/background/agent/llmRouter.ts
import { NewProvider } from '@extension/llm-providers/new-provider';

router.register(new NewProvider());
```

3. **Add Configuration UI**
```typescript
// pages/options/src/components/provider-configs/NewProviderConfig.tsx
export const NewProviderConfig = () => {
  // Configuration UI component
};
```

### Agent Development

### Creating Custom Agents

1. **Define Agent Interface**
```typescript
interface Agent {
  name: string;
  description: string;
  execute(task: Task, context: Context): Promise<AgentResult>;
  validate?(result: AgentResult): Promise<boolean>;
}
```

2. **Implement Agent Logic**
```typescript
export class CustomAgent implements Agent {
  name = 'custom-agent';
  description = 'Custom automation logic';

  async execute(task: Task, context: Context) {
    // Agent implementation
    return { success: true, data: result };
  }
}
```

3. **Register Agent**
```typescript
// chrome-extension/src/background/agent/agentRegistry.ts
export const agentRegistry = new Map<string, Agent>();
agentRegistry.set('custom-agent', new CustomAgent());
```

---

## 🔌 Chrome APIs

### Key APIs Used

#### Storage API
```typescript
// Persistent storage with our abstraction
import { storage } from '@extension/storage';

await storage.set('user_preferences', data);
const data = await storage.get('user_preferences');
```

#### Scripting API
```typescript
// Execute scripts on pages
await chrome.scripting.executeScript({
  target: { tabId: tabId },
  function: injectedFunction,
  args: [param1, param2]
});
```

#### Tabs API
```typescript
// Tab management
const tab = await chrome.tabs.create({ url: 'https://example.com' });
await chrome.tabs.update(tabId, { active: true });
```

#### Debugger API
```typescript
// Advanced DOM manipulation
const target = { tabId };
await chrome.debugger.attach(target, '1.3');
await chrome.debugger.sendCommand(target, 'Runtime.evaluate', {
  expression: 'document.querySelector(".button").click()'
});
```

### Permission Management

Chrome Web Store has strict permission requirements:

```json
// manifest.js (dynamic)
{
  "host_permissions": ["<all_urls>"],      // Required for any site
  "permissions": [
    "storage",            // Settings & preferences
    "scripting",          // Script injection
    "tabs",               // Tab management
    "activeTab",          // Current tab access
    "debugger",           // Advanced DOM access
    "unlimitedStorage",   // Large data storage
    "webNavigation"       // Navigation events
  ]
}
```

---

## 🧪 Testing

### Test Structure

```
chrome-extension/src/
├── __tests__/              # Unit tests
│   ├── background/
│   │   ├── agents/
│   │   └── storage/
│   └── utils/
├── e2e/                     # E2E tests
│   ├── basic-automation.spec.ts
│   ├── form-filling.spec.ts
│   └── data-extraction.spec.ts
└── fixtures/                # Test data
```

### Unit Testing (Vitest)

```typescript
// chrome-extension/src/background/__tests__/navigator.test.ts
import { describe, it, expect } from 'vitest';
import { NavigatorAgent } from '../agent/navigator';

describe('NavigatorAgent', () => {
  it('should click elements correctly', async () => {
    const navigator = new NavigatorAgent();
    const result = await navigator.execute({
      type: 'click',
      selector: '.submit-button'
    });

    expect(result.success).toBe(true);
  });
});
```

### E2E Testing (Playwright)

```typescript
// e2e/basic-automation.spec.ts
import { test, expect } from '@playwright/test';

test('basic data extraction', async ({ page, extensionId }) => {
  // Load extension
  await page.goto('chrome-extension://' + extensionId + '/side-panel/index.html');

  // Navigate to test site
  await page.goto('https://example-ecommerce.com');

  // Run automation
  await page.fill('[data-testid="chat-input"]', 'Extract product names and prices');
  await page.click('[data-testid="send-button"]');

  // Verify results
  await expect(page.locator('[data-testid="results-table"]')).toBeVisible();
});
```

### Running Tests

```bash
# Unit tests
pnpm -F chrome-extension test

# E2E tests (requires build)
pnpm e2e

# Specific test file
pnpm -F chrome-extension test -- -t "Navigator"

# Watch mode
pnpm -F chrome-extension test --watch
```

---

## 📦 Build & Release

### Build Process

1. **Package Dependencies**: Build shared packages first
2. **UI Compilation**: Build React pages
3. **Extension Build**: Compile extension with Vite
4. **Asset Optimization**: Minify and bundle
5. **Package Creation**: Generate ZIP for distribution

### Manual Build Commands

```bash
# Clean previous builds
pnpm clean:bundle

# Build all dependencies
pnpm -F @extension/hmr ready
pnpm -F @extension/dev-utils ready
pnpm -F @extension/storage ready
pnpm -F @extension/i18n ready
pnpm -F @extension/ui ready
pnpm -F @extension/shared ready

# Build extension
pnpm -F chrome-extension build

# Create distribution package
cd dist && zip -r ../freejack-chrome-extension-v$(node -p "require('../package.json').version").zip .
```

### Release Process

1. **Version Update**
```bash
./update_version.sh  # Bumps version across all packages
```

2. **Build Verification**
```bash
pnpm build           # Full build
pnpm e2e              # Run E2E tests
pnpm -F chrome-extension test  # Unit tests
```

3. **Package Creation**
```bash
pnpm zip              # Creates distribution package
```

4. **Chrome Web Store Submission**
- Upload generated ZIP
- Fill store listing details
- Submit for review

---

## 🔍 Debugging

### Extension Debugging

1. **Extension Console**
   - Navigate to `chrome://extensions/`
   - Enable Developer mode
   - Click "service worker" link for background script console
   - Click "view" for side panel console

2. **Content Script Debugging**
   - Open target website
   - Open DevTools (F12)
   - Check Console for content script logs
   - Use Elements tab to inspect injected DOM

3. **Network Debugging**
   - In extension console, check Network tab
   - Filter by "Fetch/XHR" for API calls
   - Verify request/response payloads

### Common Debug Scenarios

#### Element Not Found
```javascript
// Debug selector issues
console.log('Page structure:', document.body.innerHTML);
console.log('Selector result:', document.querySelector(selector));
```

#### API Call Failures
```javascript
// Debug API integration
console.log('Request config:', config);
console.log('API response:', response);
console.log('Error details:', error);
```

#### Build Issues
```bash
# Clear build cache
pnpm clean:turbo && pnpm clean:bundle

# Rebuild dependencies
pnpm -F @extension/hmr ready && pnpm -F @extension/dev-utils ready

# Verbose build
pnpm -F chrome-extension build --debug
```

---

## 🌍 Internationalization

### Adding New Language

1. **Create Locale File**
```json
// packages/i18n/locales/es/messages.json
{
  "app_metadata_name": {
    "message": "Freejack: Agente Web IA"
  },
  "welcome_title": {
    "message": "¡Bienvenido a Freejack!"
  }
}
```

2. **Add to i18n Config**
```typescript
// packages/i18n/src/locales.ts
export const supportedLocales = ['en', 'es', 'zh_CN', 'pt_BR', 'zh_TW'];
```

3. **Use in Components**
```typescript
import { t } from '@extension/i18n';

const message = t('welcome_title');
```

### Translation Guidelines

- **Consistent Terminology**: Use same terms across UI
- **Context Awareness**: Consider UI context for translations
- **Placeholder Handling**: Use `$1$`, `$2$` for dynamic values
- **Character Limits**: Chrome Web Store has strict limits

---

## 🔐 Security Best Practices

### Code Security

```typescript
// Input validation
import { z } from 'zod';
const userInputSchema = z.string().max(1000).regex(/^[a-zA-Z0-9\s]+$/);

// Sanitization
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(userHTML);

// CSP compliance
// Use 'unsafe-inline' only when necessary
// Prefer nonce-based CSP
```

### API Security

```typescript
// Secure key storage
import { storage } from '@extension/storage';
await storage.set('api_keys', {
  openai: await encrypt(apiKey)
});

// Request validation
const sanitizedPrompt = prompt.slice(0, 10000);
if (!isValidPrompt(sanitizedPrompt)) {
  throw new Error('Invalid prompt');
}
```

### Permissions Principle

- **Minimal Request**: Only request permissions absolutely necessary
- **Justify Each**: Document why each permission is needed
- **User Control**: Allow users to grant/deny specific permissions
- **Regular Review**: Periodically audit and remove unused permissions

---

## 📈 Performance Optimization

### Bundle Optimization

```typescript
// Dynamic imports for code splitting
const AgentModule = lazy(() => import('./agent/Agent'));

// Tree shaking for unused exports
export { usedFunction } from './utils';
// unusedFunction will be removed from bundle

// Bundle analysis
pnpm -F chrome-extension build --analyze
```

### Runtime Performance

```typescript
// Efficient DOM operations
// Bad: Multiple DOM queries
document.querySelector('.button').style.color = 'red';
document.querySelector('.button').style.background = 'blue';

// Good: Cache DOM references
const button = document.querySelector('.button');
button.style.color = 'red';
button.style.background = 'blue';

// Debounce frequent operations
const debouncedSearch = debounce(performSearch, 300);
```

### Memory Management

```typescript
// Clean up event listeners
useEffect(() => {
  const handleEvent = () => { /* ... */ };
  element.addEventListener('click', handleEvent);

  return () => element.removeEventListener('click', handleEvent);
}, []);

// Clear intervals/timeouts
const intervalId = setInterval(callback, 1000);
clearInterval(intervalId);

// Release object references
largeObject = null;
```

---

## 🤝 Contributing

### Development Workflow

1. **Fork Repository**
   ```bash
   git clone https://github.com/yourusername/freejack.git
   cd freejack
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow code style (ESLint + Prettier)
   - Add tests for new functionality
   - Update documentation

4. **Submit Pull Request**
   ```bash
   git push origin feature/your-feature-name
   # Create PR on GitHub
   ```

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Custom rules for Chrome extensions
- **Prettier**: 2-space indentation, single quotes
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, etc.

### Testing Requirements

- **Unit Tests**: Cover business logic and utilities
- **Integration Tests**: Test agent coordination
- **E2E Tests**: Cover user workflows
- **Accessibility**: WCAG 2.1 AA compliance

---

## 📞 Support & Community

### Getting Help

- **Documentation**: [GitHub Wiki](https://github.com/extension/freejack/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/extension/freejack/discussions)
- **Issues**: [GitHub Issues](https://github.com/extension/freejack/issues)
- **Discord**: [Community Server](https://discord.gg/freejack)

### Contributing Guidelines

- **Bug Reports**: Use issue templates with reproduction steps
- **Feature Requests**: Provide use cases and implementation suggestions
- **Pull Requests**: Follow code standards and include tests
- **Documentation**: Help improve docs and examples

### Developer Recognition

- **Contributors**: Listed in README and credits
- **Top Contributors**: Special recognition in releases
- **Community Heroes**: Featured in blog posts
- **Core Team**: Opportunity to join development team

---

*Thank you for contributing to Freejack! Together we're making web automation accessible to everyone.*