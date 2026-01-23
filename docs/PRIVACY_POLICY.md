# 🔒 Freejack Privacy Policy

**Last Updated**: January 23, 2026
**Effective Date**: January 23, 2026

## 📋 Overview

Freejack is committed to protecting your privacy and giving you control over your data. This policy explains what information we collect, how we use it, and your rights regarding your data.

### TL;DR
- **All processing happens locally** in your browser
- **No browsing history** is stored or transmitted
- **Form data is only sent** to AI services you explicitly authorize
- **No user tracking** or analytics
- **Open source code** you can verify
- **Minimal permissions** required for functionality

---

## 🎯 What We Do (and Don't) Collect

### ✅ What We Collect Locally

**Extension Settings**
- Your preferred AI provider and API keys (encrypted)
- UI preferences (theme, language, agent behavior)
- Saved automation templates
- Local cache for performance

**Session Data**
- Temporary task execution context
- Current page DOM structure for automation
- Real-time debugging logs (when debug mode enabled)

### ❌ What We Never Collect

- **Browsing history** or visited websites
- **Personal information** from forms (unless explicitly sent to AI)
- **User analytics** or tracking data
- **IP addresses** or location data
- **Contact information** or personal identifiers

---

## 🔐 How Your Data is Used

### Local Processing

All sensitive operations happen **entirely in your browser**:

```
Your Request → Local AI Analysis → Browser Automation → Results
     ↓              ↓                    ↓              ↓
   Private      Private           Private         Private
```

### AI Provider Communication

Only when you explicitly run automation:

1. **Page Context**: Relevant DOM elements for the task
2. **Your Instructions**: Exact text you type
3. **Task Results**: Extracted data you request

**We never send:**
- Full page content (only relevant elements)
- Browsing history or user behavior
- Personal data unless part of the task

### Data Storage

- **Encrypted API Keys**: Stored locally, encrypted
- **Settings**: Local browser storage only
- **Templates**: Saved workflows you create
- **No Cloud Storage**: No data sent to our servers

---

## 🌐 AI Provider Privacy

### Third-Party Services

When you use AI providers, their privacy policies apply:

#### OpenAI
- [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy)
- Data used for service improvement (opt-out available)
- 30-day data retention by default

#### Anthropic Claude
- [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
- Data used for safety and quality
- 90-day data retention by default

#### Google Gemini
- [Google AI Privacy](https://ai.google/discover/privacy/)
- Data used for service improvement
- Variable retention based on service

#### Local Models (Ollama)
- **Zero data transmission** - everything stays local
- **No privacy concerns** - complete privacy

### Your Control

- **Choose Your Provider**: Select based on privacy preferences
- **Local Option**: Use Ollama for complete privacy
- **Provider Switching**: Change providers anytime
- **Data Control**: Only send data you're comfortable sharing

---

## 🛡️ Security Measures

### Technical Protections

**Encryption**
- API keys encrypted with AES-256
- Local storage encryption where available
- Secure communication with AI providers

**Sandboxing**
- Extension runs in Chrome's security sandbox
- Isolated from other extensions and system
- No access to sensitive system resources

**Code Transparency**
- 100% open source code
- Public security audits welcome
- Community review and contribution

**Minimal Permissions**
- Only request permissions absolutely necessary
- Each permission documented and justified
- Regular permission audits

### Data Protection

**No Collection**
- No user analytics or tracking
- No telemetry or usage data
- No personal information collection

**Limited Retention**
- Temporary data cleared on browser close
- Settings persist only for functionality
- No historical data retention

**User Control**
- Export/delete your data anytime
- Clear all extension data
- Revoke permissions at will

---

## 🌍 International Data Transfers

### Local Processing

Since all processing happens locally in your browser:

- **No international data transfers** from our side
- **Your data stays** in your browser and country
- **Only transfers** are to AI providers you choose

### AI Provider Responsibility

Any international data transfers occur only:

1. **When you use AI providers** with servers in other countries
2. **With your explicit consent** for each automation task
3. **Only the minimum data** necessary for the task

### Your Choices

- **Local Models**: Use Ollama to avoid any transfers
- **Provider Selection**: Choose providers in your preferred region
- **Data Minimization**: Send only necessary data for tasks

---

## 👤 Your Rights & Choices

### Data Control Rights

**Access**
- View all data stored by extension
- Export settings and templates
- Review AI request history (local only)

**Modification**
- Change any settings or preferences
- Edit or delete saved templates
- Update API keys or providers

**Deletion**
- Clear all extension data instantly
- Delete specific templates or history
- Uninstall extension to remove everything

**Portability**
- Export all your data and settings
- Import data to new installations
- Use data across different browsers

### Exercise Your Rights

**In-Extension Controls**
- Settings → Data & Privacy → Manage Data
- Settings → Advanced → Clear All Data
- Extension icon → Settings → Privacy

**Browser Controls**
- `chrome://extensions/` → Freejack → Remove
- Clear browser data (includes extension data)
- Incognito mode (no extension data saved)

---

## 🔄 Data Retention

### Local Data

**Temporary Data**
- Cleared when: Browser close, extension unload
- Types: Task context, DOM analysis, debug logs
- Location: Browser memory, cleared automatically

**Persistent Data**
- Kept until: User deletion or uninstall
- Types: Settings, API keys, templates
- Location: Browser storage, encrypted

### AI Provider Data

**Retention Periods**
- OpenAI: 30 days (default)
- Claude: 90 days (default)
- Gemini: Varies by service
- Ollama: Never (local only)

**Your Control**
- Opt-out of data usage where available
- Use provider dashboards to manage data
- Choose local models to avoid retention

---

## 🚸 Children's Privacy

Freejack is not directed to children under 13. We do not:

- Collect information from children
- Target children in marketing
- Use features that appeal to children

If you learn a child has provided information, please contact us immediately for removal.

---

## 🔄 Policy Changes

### Update Process

**Notification**
- In-extension notification of significant changes
- GitHub announcement for all changes
- Email notification for registered users (optional)

**Implementation**
- Changes effective immediately for new users
- 30-day notice for significant changes
- Opt-out option for major changes

**History**
- All policy versions archived on GitHub
- Change log with reasoning for updates
- Community discussion period for major changes

---

## 🌐 Jurisdiction Specific

### United States (California)

- Compliant with California Consumer Privacy Act (CCPA)
- California residents can request data deletion
- No sale of personal information
- "Do Not Sell or Share" link available

### European Union (GDPR)

- GDPR compliant processing and transfers
- Data controller is the user (local processing)
- Right to access, rectification, erasure
- Data protection impact assessment completed

### Other Regions

- Follow local privacy laws and regulations
- Provide equivalent protections globally
- Offer stronger protections where required

---

## 📞 Contact & Questions

### Getting Help

**Privacy Questions**
- Email: privacy@freejack.ai
- GitHub Issue: [Privacy Questions](https://github.com/extension/freejack/issues/new?template=privacy_question)
- Response within 7 business days

**Data Requests**
- Access: access@freejack.ai
- Deletion: delete@freejack.ai
- Export: export@freejack.ai
- General: support@freejack.ai

**Security Issues**
- Security: security@freejack.ai
- Responsible disclosure policy applies
- Rapid response guaranteed

### Legal Information

**Company Information**
- Open source project, not commercial entity
- No corporate privacy policy needed
- Community-governed development

**Regulatory Compliance**
- Self-regulated under open source principles
- Voluntary compliance with privacy frameworks
- Regular privacy impact assessments

---

## 🔬 Transparency Report

### Data Handling Summary

**2026 Q1 Statistics (Projected)**
- Users: 0 (pre-launch)
- Data collected: 0 bytes
- Data breaches: 0
- Government requests: 0
- Third-party sharing: 0 bytes

**Transparency Commitment**
- Publish quarterly transparency reports
- Public security audit results
- Community oversight board
- Open privacy policy development

---

## 📜 Acknowledgment

By using Freejack, you acknowledge that you have read, understood, and agree to this privacy policy. You understand that:

1. All data processing happens locally in your browser
2. Only data explicitly sent to AI providers leaves your browser
3. We do not collect, store, or analyze your browsing behavior
4. You have full control over your data and can delete it anytime
5. The extension is open source for your verification

---

## 🔄 Last Updated

- **Initial Version**: January 23, 2026
- **Review Schedule**: Quarterly
- **Next Review**: April 23, 2026
- **Version**: 1.0

---

*This privacy policy is a living document. As our extension evolves, so will this policy. We're committed to transparency and will always prioritize your privacy and control over your data.*

Questions? Concerns? Suggestions? We're listening:
- **GitHub**: [Create Issue](https://github.com/extension/freejack/issues/new)
- **Email**: privacy@freejack.ai
- **Discord**: [Community Discussion](https://discord.gg/freejack)

Your privacy matters. Thank you for trusting us with your automation needs.