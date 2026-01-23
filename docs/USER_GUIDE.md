# 🚀 Freejack: AI Web Agent - User Guide

## 📖 Installation Guide

### From Chrome Web Store (Recommended)

1. **Open Chrome Web Store**
   - Go to [Chrome Web Store](https://chrome.google.com/webstore)
   - Search for "Freejack: AI Web Agent"

2. **Install Extension**
   - Click "Add to Chrome"
   - Review permissions and click "Add extension"
   - Extension will be installed and ready to use

3. **Get Started**
   - Click the Freejack icon in your browser toolbar
   - Follow the quick setup guide
   - Configure your preferred AI provider

### Manual Installation (Advanced)

1. **Download Package**
   - Download the latest `freejack-chrome-extension-v*.zip` from GitHub Releases
   - Extract the ZIP file to a folder

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extracted folder

---

## 🎯 Quick Start

### 1. Configure AI Provider

Freejack supports multiple AI providers. Choose one:

#### OpenAI
- API Key: Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- Models: GPT-4, GPT-3.5 Turbo
- Best for: Complex tasks, natural language understanding

#### Anthropic Claude
- API Key: Get from [Anthropic Console](https://console.anthropic.com/)
- Models: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- Best for: Analytical tasks, detailed instructions

#### Google Gemini
- API Key: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Models: Gemini Pro, Gemini Ultra
- Best for: Visual tasks, cost-effective automation

#### Local Models (Ollama)
- No API key needed
- Models: Qwen, Llama, CodeLlama
- Best for: Privacy, development testing

### 2. Your First Automation

1. **Open Freejack**
   - Click the extension icon
   - Choose "Start new session"

2. **Tell Freejack What to Do**
   - Type in natural language: "Extract product names and prices from this page"
   - Press Enter or click Send

3. **Watch it Work**
   - Freejack analyzes the page
   - Plans the automation steps
   - Executes the task
   - Shows results in real-time

### 3. Common Examples

#### E-commerce Data Extraction
```
"Extract all product names, prices, and ratings from this search page into a table"
```

#### Form Filling
```
"Fill out this registration form with test data: name='John Doe', email='john@example.com', phone='555-0123'"
```

#### Navigation & Clicks
```
"Click the 'Add to Cart' button for the first product, then go to checkout"
```

#### Data Validation
```
"Check if all required fields in this form are filled correctly"
```

---

## 🔧 Advanced Features

### Multi-Agent System

Freejack uses three specialized AI agents:

- **🧭 Navigator**: Handles clicks, scrolling, and page navigation
- **📋 Planner**: Creates step-by-step automation strategies
- **✅ Validator**: Ensures task completion and data accuracy

### Custom Workflows

Create reusable automation workflows:

1. **Save Workflow**
   - After completing a task, click "Save as Template"
   - Give it a descriptive name
   - Choose parameters to customize

2. **Reuse Workflow**
   - Click "Templates" in the sidebar
   - Select your saved workflow
   - Customize parameters
   - Click "Run"

### Data Export

Export extracted data in multiple formats:

- **CSV**: For spreadsheets
- **JSON**: For web applications
- **Copy to Clipboard**: Quick paste
- **API Endpoint**: Send to your services

---

## 🔒 Privacy & Security

### Your Data Stays Private

- ✅ All processing happens in your browser
- ✅ No browsing history stored
- ✅ Form data never sent without permission
- ✅ Open source code for transparency

### Permissions Explained

Freejack requests minimal permissions:

- **`<all_urls>`**: Required for any website automation
- **`storage`**: Saves settings and preferences locally
- **`scripting`**: Injects automation scripts
- **`tabs`**: Controls browser tabs for navigation
- **`debugger`**: Advanced DOM manipulation
- **`unlimitedStorage`**: Stores automation templates

### Security Best Practices

- 🔒 Only grant permissions on trusted websites
- 🔒 Review AI provider privacy policies
- 🔒 Use test data when learning the tool
- 🔒 Keep extension updated for security patches

---

## 🎨 Customization

### Themes & Appearance

1. **Dark/Light Mode**
   - Settings → Appearance → Theme
   - Choose "Dark", "Light", or "System"

2. **UI Density**
   - Settings → Appearance → Density
   - Choose "Compact", "Comfortable", or "Spacious"

### Agent Behavior

1. **Speed vs Accuracy**
   - Settings → Agents → Performance
   - Adjust speed/accuracy balance

2. **Conservatism**
   - Settings → Agents → Risk
   - Choose "Cautious" (safer) or "Bold" (faster)

### API Configuration

1. **Custom Endpoints**
   - Settings → API Providers → Custom
   - Add your own API endpoint

2. **Rate Limiting**
   - Settings → API → Rate Limits
   - Configure per-provider limits

---

## 🚨 Troubleshooting

### Common Issues

#### "Task failed to complete"
- Check internet connection
- Verify API key and credits
- Try breaking task into smaller steps
- Check website for CAPTCHAs or blocks

#### "Element not found"
- Page structure may have changed
- Try refreshing and retrying
- Use more specific instructions
- Check if website uses dynamic content

#### "API rate limit exceeded"
- Check your API provider limits
- Wait and retry after rate limit resets
- Consider upgrading your plan
- Use local models as backup

#### "Extension not working"
- Disable conflicting extensions
- Clear extension cache
- Restart Chrome browser
- Reinstall extension if needed

### Getting Help

1. **Documentation**: [GitHub Wiki](https://github.com/extension/freejack/wiki)
2. **Community**: [GitHub Discussions](https://github.com/extension/freejack/discussions)
3. **Issues**: [GitHub Issues](https://github.com/extension/freejack/issues)
4. **Email**: support@freejack.ai

### Debug Mode

Enable debug logging for troubleshooting:

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.setItem('freejack_debug', 'true')`
4. Refresh extension
5. Look for detailed logs in Console

---

## 📚 Tips & Best Practices

### Writing Effective Instructions

✅ **Be Specific**: "Click the blue 'Buy Now' button next to price $29.99"
❌ **Vague**: "Click buy button"

✅ **Provide Context**: "Extract data from the first 5 products in the grid"
❌ **Missing Context**: "Extract product data"

✅ **Use Clear Structure**: "1. Go to checkout 2. Fill shipping form 3. Confirm order"
❌ **Run-on Sentences**: "Go to checkout and fill the shipping form and then confirm"

### Performance Tips

- Start with simple tasks, build complexity gradually
- Use templates for repetitive workflows
- Break complex tasks into smaller steps
- Monitor API usage to avoid rate limits
- Use local models for development/testing

### Cost Optimization

- Local models for testing/demos
- Choose right model for task complexity
- Monitor token usage in settings
- Reuse templates to save repeated requests
- Use batch operations when possible

---

## 🔮 What's Next?

### Upcoming Features

- 📱 Mobile browser support
- 🌐 More language support
- 🤖 Custom agent training
- 📊 Advanced analytics dashboard
- 🔄 Workflow marketplace

### Beta Program

Join our beta program for early access:

1. Sign up at [freejack.ai/beta](https://freejack.ai/beta)
2. Get access to experimental features
3. Provide feedback and shape development
4. Priority support and direct channel to team

---

## 🙏 Thank You!

Thank you for using Freejack! We're building the future of web automation together.

- 🌟 **Star us on GitHub**: [github.com/extension/freejack](https://github.com/extension/freejack)
- 🐦 **Follow us on X**: [@freejack_ai](https://x.com/freejack_ai)
- 💬 **Join our Discord**: [discord.gg/freejack](https://discord.gg/freejack)
- 📧 **Contact us**: [support@freejack.ai](mailto:support@freejack.ai)

---

*Freejack is open source software released under Apache 2.0 License. Contribute and help make web automation accessible to everyone!*