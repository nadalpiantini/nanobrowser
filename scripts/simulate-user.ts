#!/usr/bin/env npx tsx
/**
 * Freejack User Simulation Script
 * Uses Stagehand with headed mode for visual debugging
 *
 * Usage:
 *   npx tsx scripts/simulate-user.ts [url]
 *   npx tsx scripts/simulate-user.ts --help
 *
 * Environment:
 *   OPENAI_API_KEY or ANTHROPIC_API_KEY for cloud LLM
 *   Or uses Ollama locally if available
 */

import { Stagehand } from '@browserbasehq/stagehand';

// LLM Configuration - prioritize local Ollama, fallback to cloud
const getLLMConfig = () => {
  // Check for API keys
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (anthropicKey) {
    console.log('🔑 Using Anthropic Claude');
    return { model: 'anthropic/claude-sonnet-4-20250514' };
  }

  if (openaiKey) {
    console.log('🔑 Using OpenAI GPT-4o');
    return { model: 'openai/gpt-4o' };
  }

  // Default to Ollama local (free!)
  console.log('🦙 Using Ollama local (llama3.2-vision)');
  return {
    model: 'ollama/llama3.2-vision',
    modelConfig: {
      baseUrl: 'http://localhost:11434',
    },
  };
};

// Configuration
const CONFIG = {
  env: 'LOCAL' as const,
  headless: false, // HEADED MODE - browser visible for debugging
  viewport: { width: 1280, height: 800 },
  devtools: true, // Open DevTools automatically
  slowMo: 100, // Slow down actions for visibility (ms)
  verbose: 2, // Maximum logging
  ...getLLMConfig(),
};

// Default test URL (use example.com or localhost for testing)
const DEFAULT_URL = 'https://example.com';

// Simulation scenarios
const SCENARIOS = {
  basic: async (stagehand: Stagehand, page: any) => {
    console.log('🎭 Running: Basic Navigation Test');
    await page.goto(DEFAULT_URL);
    await page.waitForLoadState('networkidle');

    // Extract page info using Stagehand AI
    const pageInfo = await stagehand.extract({
      instruction: 'Extract the main heading and description from this page',
      schema: {
        heading: { type: 'string', description: 'Main heading text' },
        description: { type: 'string', description: 'Page description or tagline' },
      },
    });

    console.log('📄 Page Info:', pageInfo);
    return pageInfo;
  },

  interaction: async (stagehand: Stagehand, page: any) => {
    console.log('🎭 Running: User Interaction Test');
    await page.goto(DEFAULT_URL);
    await page.waitForLoadState('networkidle');

    // Use Stagehand AI to find and click elements
    await stagehand.act({
      action: "Look for a 'Get Started' or 'Try Now' button and click it",
    });

    // Wait and observe result
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    console.log('📍 Navigated to:', currentUrl);
    return { navigatedTo: currentUrl };
  },

  form: async (stagehand: Stagehand, page: any, targetUrl?: string) => {
    console.log('🎭 Running: Form Interaction Test');
    const url = targetUrl || DEFAULT_URL;
    await page.goto(url);
    await page.waitForLoadState('networkidle');

    // Use Stagehand AI to interact with forms
    const formResult = await stagehand.observe({
      instruction: 'Find all form elements on this page including inputs, buttons, and text areas',
    });

    console.log('📝 Form Elements Found:', formResult);
    return formResult;
  },

  extension: async (stagehand: Stagehand, page: any) => {
    console.log('🎭 Running: Extension Simulation');

    // Navigate to a test page
    await page.goto('https://example.com');
    await page.waitForLoadState('networkidle');

    // Simulate what Freejack extension would do
    const elements = await stagehand.observe({
      instruction: 'Identify all interactive elements on this page that could be automated',
    });

    console.log('🔍 Interactive Elements:', elements);

    // Demonstrate AI-powered action
    await stagehand.act({
      action: "Click on the 'More information...' link if it exists",
    });

    return elements;
  },
};

// Main execution
async function main() {
  const args = process.argv.slice(2);

  // Help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║        🎭 FREEJACK USER SIMULATION (Stagehand)           ║
╠══════════════════════════════════════════════════════════╣
║  HEADED MODE - You will see the browser!                 ║
╠══════════════════════════════════════════════════════════╣
║  Usage:                                                  ║
║    npx tsx scripts/simulate-user.ts [scenario] [url]     ║
║                                                          ║
║  Scenarios:                                              ║
║    basic       - Basic navigation test                   ║
║    interaction - Click/navigate test                     ║
║    form        - Form element detection                  ║
║    extension   - Extension behavior simulation           ║
║                                                          ║
║  Examples:                                               ║
║    npx tsx scripts/simulate-user.ts                      ║
║    npx tsx scripts/simulate-user.ts basic                ║
║    npx tsx scripts/simulate-user.ts form https://x.com   ║
╚══════════════════════════════════════════════════════════╝
`);
    process.exit(0);
  }

  const scenario = args[0] || 'basic';
  const customUrl = args[1];

  console.log(`
\x1b[36m╔══════════════════════════════════════╗
║   🎭 STAGEHAND SIMULATION STARTING   ║
╠══════════════════════════════════════╣\x1b[0m
║  Mode: \x1b[32mHEADED (visible browser)\x1b[0m     ║
║  Scenario: \x1b[33m${scenario.padEnd(24)}\x1b[0m ║
║  DevTools: \x1b[32mEnabled\x1b[0m                    ║
\x1b[36m╚══════════════════════════════════════╝\x1b[0m
`);

  // Initialize Stagehand with headed mode
  const llmConfig = getLLMConfig();
  const stagehand = new Stagehand({
    env: CONFIG.env,
    verbose: CONFIG.verbose,
    modelName: llmConfig.model,
    modelClientOptions: llmConfig.modelConfig,
    localBrowserLaunchOptions: {
      headless: CONFIG.headless,
      devtools: CONFIG.devtools,
      viewport: CONFIG.viewport,
      slowMo: CONFIG.slowMo,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
    },
  });

  try {
    console.log('🚀 Initializing Stagehand...');
    await stagehand.init();

    // Get the page from context
    const page = stagehand.context.pages()[0];
    if (!page) {
      throw new Error('No page available in browser context');
    }

    console.log('✅ Browser launched - YOU SHOULD SEE IT NOW!');
    console.log('📍 Running scenario:', scenario);

    // Run selected scenario
    const scenarioFn = SCENARIOS[scenario as keyof typeof SCENARIOS];
    if (!scenarioFn) {
      console.error(`❌ Unknown scenario: ${scenario}`);
      console.log('Available:', Object.keys(SCENARIOS).join(', '));
      process.exit(1);
    }

    const result = await scenarioFn(stagehand, page, customUrl);

    console.log('\n✅ Simulation Complete!');
    console.log('📊 Result:', JSON.stringify(result, null, 2));

    // Keep browser open for inspection
    console.log('\n⏳ Browser staying open for 30 seconds for inspection...');
    console.log('   Press Ctrl+C to close earlier.');

    await new Promise(resolve => setTimeout(resolve, 30000));
  } catch (error) {
    console.error('❌ Simulation Error:', error);
    throw error;
  } finally {
    console.log('\n🔒 Closing browser...');
    await stagehand.close();
  }
}

// Run
main().catch(console.error);
