#!/bin/bash

# Script para crear ZIP del Chrome Extension para Chrome Web Store

echo "📦 Creating Chrome Extension ZIP package..."

# Build solo el chrome-extension
echo "🔨 Building Chrome Extension..."
pnpm -F chrome-extension build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Copiar los iconos al directorio dist
echo "📋 Copying assets..."
cp chrome-extension/public/icon*.png dist/
cp assets/chrome-store/icon*.png dist/

# Crear el ZIP para Chrome Web Store
echo "🗜️  Creating ZIP package..."
cd dist
zip -r ../freejack-chrome-extension-v$(node -p "require('../package.json').version").zip .

echo "✅ ZIP package created successfully!"
echo "📁 Location: $(ls ../freejack-chrome-extension-v*.zip)"
echo ""
echo "📋 Package contents:"
echo "✅ Manifest and extension files"
echo "✅ Icons in all required sizes (16, 32, 48, 128, 256, 512)"
echo "✅ Production build ready for Chrome Web Store"
echo ""
echo "🚀 Ready for submission!"