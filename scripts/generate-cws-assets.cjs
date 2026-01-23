#!/usr/bin/env node

/**
 * Script para generar assets para Chrome Web Store
 * Crea iconos en todos los tamaños necesarios y prepara screenshots
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '../chrome-extension/public');
const ASSETS_DIR = path.join(__dirname, '../assets/chrome-store');

// Crear directorio de assets
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Icon sizes requeridos por Chrome Web Store
const ICON_SIZES = [16, 32, 48, 128, 256, 512];

console.log('🎨 Creating Chrome Web Store assets...');

// Generar iconos
console.log('📸 Generating icons...');
const icon128Path = path.join(PUBLIC_DIR, 'icon-128.png');

if (!fs.existsSync(icon128Path)) {
  console.error('❌ icon-128.png not found in chrome-extension/public/');
  process.exit(1);
}

ICON_SIZES.forEach(size => {
  const outputPath = path.join(ASSETS_DIR, `icon-${size}.png`);
  try {
    execSync(`sips -z ${size} ${size} "${icon128Path}" --out "${outputPath}"`);
    console.log(`✅ Created icon-${size}.png`);
  } catch (error) {
    console.error(`❌ Failed to create icon-${size}.png:`, error.message);
  }
});

// Copiar screenshots existentes si los hay
const screenshotsDir = path.join(__dirname, 'screenshots');
if (fs.existsSync(screenshotsDir)) {
  console.log('📋 Copying existing screenshots...');
  const screenshots = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
  screenshots.forEach(screenshot => {
    const src = path.join(screenshotsDir, screenshot);
    const dst = path.join(ASSETS_DIR, screenshot);
    fs.copyFileSync(src, dst);
    console.log(`📸 Copied ${screenshot}`);
  });
}

// Crear archivo de manifiesto para CWS
const cwsManifest = {
  name: "Freejack: AI Web Agent",
  version: "0.1.13",
  description: "Automate web tasks with AI! Freejack is an open-source browser extension that lets you extract data, fill forms, and navigate websites using natural language.",
  category: "Productivity",
  languages: ["en", "es", "zh_CN"],
  privacy_policy: "https://github.com/extension/freejack/blob/main/PRIVACY.md",
  website: "https://github.com/extension/freejack",
  support: "https://github.com/extension/freejack/issues"
};

fs.writeFileSync(
  path.join(ASSETS_DIR, 'cws-manifest.json'),
  JSON.stringify(cwsManifest, null, 2)
);

console.log('📋 Created CWS manifest file');

// Generar reporte
console.log('\n📦 Asset Summary:');
console.log('================');
console.log(`📁 Assets directory: ${ASSETS_DIR}`);
console.log('🎨 Icons created:');
ICON_SIZES.forEach(size => {
  const filePath = path.join(ASSETS_DIR, `icon-${size}.png`);
  const exists = fs.existsSync(filePath);
  console.log(`   - icon-${size}.px (${exists ? '✅' : '❌'})`);
});

console.log('\n📋 Next steps:');
console.log('1. Review generated icons');
console.log('2. Create screenshots (1280x800 or 640x400)');
console.log('3. Update store listing content');
console.log('4. Test build and package extension');
console.log('5. Submit to Chrome Web Store');