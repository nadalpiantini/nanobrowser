# Manual Testing Checklist for FreeJack Extension

Comprehensive manual testing scenarios for FreeJack Chrome extension. Use this checklist before releases and for regression testing.

## Pre-Testing Setup

### Environment Preparation

- [ ] Chrome/Edge browser updated to latest version
- [ ] Extension loaded in unpacked mode from `dist/` directory
- [ ] Developer tools console open for debugging
- [ ] Test API keys prepared for multiple providers:
  - [ ] OpenAI API key (valid)
  - [ ] Anthropic API key (valid)
  - [ ] Google/Gemini API key (valid)
  - [ ] Ollama running locally (for dev mode testing)

### Build Verification

- [ ] Run `pnpm build` successfully
- [ ] No TypeScript errors: `pnpm type-check`
- [ ] No linting errors: `pnpm lint`
- [ ] Extension loads without console errors
- [ ] Service worker registers successfully

---

## 1. Installation & Setup

### First-Time Installation

- [ ] **Install Extension**
  - Load unpacked extension from `dist/`
  - Verify extension icon appears in toolbar
  - No errors in extension management page

- [ ] **Initial State**
  - Side panel opens without errors
  - Options page accessible
  - No crash or blank screens

- [ ] **Permissions**
  - Check required permissions are requested
  - Verify no excessive permissions
  - Test with minimal permissions

### Configuration Wizard

- [ ] **Options Page Opens**
  - Click settings from side panel → Options opens
  - Direct navigation to `chrome-extension://[id]/options/index.html` works

- [ ] **Tab Navigation**
  - ✅ Models tab (default)
  - ✅ General settings tab
  - ✅ Firewall tab
  - ✅ Analytics tab
  - ✅ Help link opens documentation

---

## 2. Authentication & Provider Configuration

### Adding Providers

- [ ] **OpenAI Configuration**
  - Add OpenAI provider
  - Enter API key: `sk-...`
  - Save successfully
  - Key persists after page reload
  - Masked display of API key

- [ ] **Anthropic Configuration**
  - Add Anthropic provider
  - Enter API key: `sk-ant-...`
  - Save successfully
  - Key persists after page reload

- [ ] **Google/Gemini Configuration**
  - Add Google provider
  - Enter API key
  - Save successfully
  - Key persists after page reload

- [ ] **Ollama Configuration (Dev Mode)**
  - Add Ollama provider
  - Set base URL: `http://localhost:11434`
  - Verify connection (if Ollama running)
  - Save successfully

### Provider Management

- [ ] **Edit Provider**
  - Modify existing provider settings
  - Change API key
  - Save updates
  - Changes persist

- [ ] **Delete Provider**
  - Remove a provider
  - Confirm deletion
  - Storage cleared
  - No orphaned data

- [ ] **Multiple Providers**
  - Add 3+ different providers simultaneously
  - All display correctly
  - No conflicts or overwrites
  - Independent configuration

### Validation

- [ ] **Empty API Key**
  - Try saving without API key
  - See validation error
  - Cannot proceed until fixed

- [ ] **Invalid API Key Format**
  - Enter invalid key (too short, wrong prefix)
  - See appropriate error message
  - Validation prevents save

- [ ] **Duplicate Provider**
  - Try adding same provider twice
  - System handles gracefully
  - Clear feedback to user

---

## 3. Model Selection & Agent Configuration

### Navigator Agent

- [ ] **Select Model**
  - Choose model from dropdown
  - Options filtered by selected provider
  - Model saves correctly

- [ ] **Configure Parameters**
  - Set temperature: 0.0 - 1.0
  - Set Top P: 0.0 - 1.0
  - Parameters save
  - Parameters persist after reload

- [ ] **Provider-Specific Models**
  - OpenAI models list correctly
  - Anthropic Claude models available
  - Gemini models shown for Google provider

### Planner Agent

- [ ] **Select Model**
  - Choose different model than Navigator
  - Independent configuration works
  - Model saves correctly

- [ ] **Reasoning Effort (O-series Models)**
  - Select OpenAI O1 model
  - Reasoning effort options appear
  - Select: minimal/low/medium/high
  - Setting saves correctly

### Model Parameter Validation

- [ ] **Temperature Bounds**
  - Cannot set temperature < 0
  - Cannot set temperature > 1
  - Invalid values rejected

- [ ] **Top P Bounds**
  - Cannot set top P < 0
  - Cannot set top P > 1
  - Invalid values rejected

---

## 4. Side Panel - Chat Interface

### UI Rendering

- [ ] **Initial Load**
  - Side panel opens quickly (< 2s)
  - Chat input visible and enabled
  - History button present
  - Settings button accessible
  - New chat button visible

- [ ] **Dark Mode**
  - Respects system dark mode preference
  - Toggle between light/dark
  - All elements properly styled in both modes

- [ ] **Layout**
  - Message area scrollable
  - Input stays at bottom
  - Buttons accessible
  - No layout breaking

### Message Input

- [ ] **Text Input**
  - Can type in textarea
  - Text displays correctly
  - Supports multiline input (Shift+Enter)
  - Enter key submits

- [ ] **Submit Message**
  - Click send button submits
  - Enter key submits
  - Input clears after submit
  - Message appears in chat

- [ ] **Character Limits**
  - Large messages (1000+ chars) work
  - Very large messages handled gracefully
  - No UI breaking with long text

### Message Display

- [ ] **User Messages**
  - Display in correct style/color
  - Timestamp visible
  - Proper alignment

- [ ] **Agent Messages**
  - Different styling than user
  - Timestamp visible
  - Proper alignment

- [ ] **System Messages**
  - Errors shown clearly
  - Status updates visible
  - Different styling from chat

- [ ] **Auto-Scroll**
  - New messages auto-scroll to bottom
  - Scroll works smoothly
  - Can scroll up to read history
  - New message doesn't force scroll if user is reading

---

## 5. Task Execution & Agent Operations

### Task Initiation

- [ ] **Simple Task**
  - Input: "Go to google.com"
  - Agent responds
  - Task executes
  - Completion reported

- [ ] **Multi-Step Task**
  - Input: "Search Google for 'AI automation' and summarize the first result"
  - Planner creates plan
  - Navigator executes steps
  - Results displayed

- [ ] **Navigation Task**
  - Input: "Navigate to example.com"
  - New tab/window opens
  - Navigation completes
  - Confirmation shown

### Real-Time Updates

- [ ] **Progress Indicators**
  - Loading spinner during execution
  - Status text updates (e.g., "Analyzing page...")
  - Step-by-step progress shown

- [ ] **Streaming Responses**
  - Agent responses appear incrementally
  - Smooth streaming (not jerky)
  - Final response complete

- [ ] **Status Messages**
  - "Planning task..."
  - "Executing step 1 of 3..."
  - "Task completed"
  - Clear and informative

### Task Control

- [ ] **Stop Button**
  - Appears during execution
  - Click stops task immediately
  - Task state cleaned up
  - Can start new task after stop

- [ ] **Pause/Resume** (if implemented)
  - Pause active task
  - Task state preserved
  - Resume continues correctly
  - State persists across panel close/open

---

## 6. Error Handling & Recovery

### API Errors

- [ ] **Invalid API Key**
  - Use invalid key
  - Clear error message shown
  - Prompts to check settings
  - No crash

- [ ] **Rate Limiting**
  - Trigger rate limit (many rapid requests)
  - Error message explains rate limit
  - Suggests retry timing
  - Recovers gracefully

- [ ] **Network Errors**
  - Disconnect network
  - Attempt task
  - Network error shown clearly
  - Reconnect and retry works

### Task Errors

- [ ] **Invalid URL**
  - Input: "Navigate to invalid-url"
  - Error reported clearly
  - Agent doesn't crash
  - Can try new task

- [ ] **Page Load Timeout**
  - Navigate to slow/unresponsive page
  - Timeout handled gracefully
  - Error message displayed
  - Recovery possible

- [ ] **Element Not Found**
  - Task to click non-existent element
  - Navigator reports clearly
  - Suggests alternatives or asks for clarification
  - No crash

### Agent Errors

- [ ] **Agent Initialization Failure**
  - No models configured
  - Clear prompt to configure
  - Settings link provided

- [ ] **LLM Provider Down**
  - Provider API unavailable
  - Error reported
  - Fallback behavior (if implemented)
  - Retry option

---

## 7. Multi-Turn Conversations

### Context Maintenance

- [ ] **Follow-up Questions**
  - Task: "Search for restaurants in NYC"
  - Follow-up: "Show me Italian ones"
  - Agent understands context
  - Response uses previous context

- [ ] **Conversation History**
  - Multiple back-and-forth messages
  - Agent maintains context through 5+ turns
  - Previous messages visible
  - History scrollable

### Session Management

- [ ] **New Chat**
  - Click "New Chat" button
  - Fresh conversation starts
  - Previous chat saved
  - No context leakage

- [ ] **Switch Sessions**
  - Open history
  - Select previous session
  - Loads correctly
  - All messages present

- [ ] **Delete Session**
  - Delete a chat session
  - Confirm deletion
  - Session removed
  - No orphaned data

---

## 8. Chat History

### History Panel

- [ ] **Open History**
  - Click history button
  - Panel/modal opens
  - List of sessions displayed
  - Sorted by date (newest first)

- [ ] **Session Metadata**
  - Session title shown
  - Timestamp visible
  - Preview of first message

- [ ] **Search History** (if implemented)
  - Search for keywords
  - Results filter correctly
  - Can find old conversations

### Loading Historical Sessions

- [ ] **Select Session**
  - Click on past session
  - Loads in main panel
  - All messages present
  - Scroll position correct

- [ ] **Replay Historical Task** (if enabled)
  - Select task with "Replay" option
  - Confirm replay
  - Task re-executes
  - New results shown

---

## 9. Settings & Preferences

### General Settings

- [ ] **Language Selection**
  - Change interface language
  - UI updates immediately
  - Preference persists

- [ ] **Replay Historical Tasks**
  - Enable/disable toggle
  - Setting saves
  - Affects history UI

- [ ] **Analytics/Telemetry**
  - Enable/disable PostHog
  - Setting saves
  - Privacy respected

### Firewall/Guardrails

- [ ] **Enable Guardrails**
  - Toggle on/off
  - Setting persists
  - Affects task execution

- [ ] **Blocked Patterns**
  - Add blocked URLs/patterns
  - Save successfully
  - Tasks respect blocks

- [ ] **Safety Checks**
  - Dangerous actions blocked
  - Warning shown to user
  - Can override if needed (with confirmation)

---

## 10. Performance & Resource Usage

### Load Times

- [ ] **Extension Startup**
  - Extension loads in < 2s
  - Service worker active quickly
  - No delays opening panel

- [ ] **Page Navigation**
  - Options page loads in < 1s
  - Side panel opens in < 1s
  - Tab switching instant

### Memory Usage

- [ ] **Check Memory**
  - Open Chrome Task Manager
  - Extension uses < 100MB idle
  - No memory leaks over 30min session
  - Memory released after tasks

- [ ] **Long-Running Sessions**
  - Use extension for 1+ hour
  - Multiple tasks (10+)
  - No slowdown
  - No crashes

### Responsiveness

- [ ] **UI Interactions**
  - Buttons click instantly
  - Input responsive
  - No lag typing
  - Smooth scrolling

---

## 11. Cross-Browser Compatibility

### Chrome

- [ ] **Latest Stable**
  - All features work
  - No console errors
  - UI renders correctly

- [ ] **Chrome Beta/Dev**
  - Extension loads
  - Core features work
  - Note any issues

### Edge

- [ ] **Latest Edge**
  - Extension loads successfully
  - All features functional
  - UI renders correctly
  - No Edge-specific bugs

---

## 12. Security & Privacy

### Data Storage

- [ ] **API Keys Encrypted** (if implemented)
  - Keys stored securely
  - Not visible in plain text storage

- [ ] **Local Storage Only**
  - No data sent to external servers (except LLM APIs)
  - Storage inspection shows expected data
  - No leakage

- [ ] **Clear Data**
  - Clear all extension data
  - All storage wiped
  - No residue

### Network Requests

- [ ] **Only Expected Calls**
  - Monitor Network tab
  - Only calls to configured LLM providers
  - No unexpected external requests
  - No telemetry if disabled

### Permissions

- [ ] **Minimal Permissions**
  - Only necessary permissions requested
  - No over-reaching access
  - User consent for sensitive operations

---

## 13. Accessibility

### Keyboard Navigation

- [ ] **Tab Navigation**
  - Can navigate options page with Tab
  - Focus visible
  - Logical tab order

- [ ] **Enter to Submit**
  - Enter submits messages
  - Shift+Enter for newline

- [ ] **Escape Key**
  - Closes modals/dropdowns
  - Cancels operations

### Screen Reader Support

- [ ] **ARIA Labels**
  - Buttons have labels
  - Form inputs labeled
  - Roles defined

- [ ] **Alt Text**
  - Icons have alt text
  - Images described

---

## 14. Edge Cases

### Unusual Inputs

- [ ] **Empty Message**
  - Submit empty message
  - Handled gracefully
  - No error or clear feedback

- [ ] **Very Long Message**
  - Input 10,000+ characters
  - Handled or rejected with clear message
  - No crash

- [ ] **Special Characters**
  - Input emojis, unicode, symbols
  - Displays correctly
  - No encoding issues

### Rapid Actions

- [ ] **Spam Submit**
  - Click submit 10 times rapidly
  - Debounced or queued
  - No crashes
  - No duplicate tasks

- [ ] **Rapid Tab Switching**
  - Switch tabs quickly
  - No state loss
  - No crashes

### Storage Limits

- [ ] **Many Chat Sessions**
  - Create 50+ sessions
  - All load correctly
  - No slowdown
  - Can delete old ones

- [ ] **Long Conversations**
  - 100+ messages in one session
  - Loads and displays
  - Scroll works
  - Performance acceptable

---

## 15. Pre-Release Validation

### Final Checklist

- [ ] **All Critical Features Work**
  - Auth, agents, chat, history
  - No blockers

- [ ] **No Console Errors**
  - Clean console on all pages
  - No unhandled exceptions

- [ ] **Production Build**
  - `NODE_ENV=production pnpm build`
  - Extension loads from production build
  - No debug code exposed

- [ ] **Validate Build Script**
  - Run `./scripts/validate-prod-build.sh dist`
  - All checks pass
  - No secrets in bundle

- [ ] **Version Number**
  - `manifest.json` version updated
  - `package.json` versions updated
  - Changelog updated

- [ ] **Documentation**
  - README accurate
  - Setup instructions work
  - Known issues documented

### Smoke Test (Quick Validation)

- [ ] **Install → Configure → Use**
  - Install extension (< 2min)
  - Add API key (< 1min)
  - Select model (< 1min)
  - Execute test task: "Navigate to example.com" (< 30s)
  - ✅ Success = Ready to release

---

## Test Environment Details

**Date Tested:** _______________

**Tester Name:** _______________

**Extension Version:** _______________

**Browser:** Chrome / Edge (circle one)

**Browser Version:** _______________

**OS:** macOS / Windows / Linux (circle one)

**OS Version:** _______________

---

## Issues Found

| # | Severity | Component | Description | Status |
|---|----------|-----------|-------------|--------|
| 1 |          |           |             |        |
| 2 |          |           |             |        |
| 3 |          |           |             |        |

**Severity Levels:**
- **Critical:** Blocks release, core functionality broken
- **High:** Major feature broken, workaround exists
- **Medium:** Feature degraded, not blocking
- **Low:** Minor issue, cosmetic

---

## Sign-Off

- [ ] **All Critical Tests Passed**
- [ ] **No Critical/High Severity Issues**
- [ ] **Ready for Release**

**Tester Signature:** _______________
**Date:** _______________
