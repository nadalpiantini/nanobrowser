#!/bin/bash
# Setup script for E2E testing with Playwright

set -e

echo "🎭 Setting up Playwright E2E Testing..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first."
    exit 1
fi

echo "✅ pnpm found"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
else
    echo "✅ Dependencies already installed"
fi

# Install Playwright browsers
echo ""
echo "🌐 Installing Playwright browsers..."
pnpm playwright install chromium

echo ""
echo "🏗️  Building extension..."
pnpm build

echo ""
echo "✅ E2E setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Run tests:     pnpm e2e"
echo "  2. UI mode:       pnpm e2e:ui"
echo "  3. Debug mode:    pnpm e2e:debug"
echo ""
echo "📖 See e2e/README.md for documentation"
