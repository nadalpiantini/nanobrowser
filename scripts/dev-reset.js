#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const statePath = path.join(__dirname, 'dev-state.json');

console.log('\n\x1b[33m🧹 Limpiando procesos Freejack...\x1b[0m\n');

// Kill freejack-related processes (surgical, not all node)
const killPatterns = ['freejack.*turbo', 'freejack.*vite', 'turbo.*watch.*dev', 'vite.*freejack'];

for (const pattern of killPatterns) {
  try {
    execSync(`pkill -f "${pattern}"`, { stdio: 'ignore' });
  } catch {
    // Process not found is OK
  }
}

// Reset state
fs.writeFileSync(statePath, JSON.stringify({ activeMode: null }, null, 2));

console.log('\x1b[32m✓ Procesos cerrados\x1b[0m');
console.log('\x1b[32m✓ Estado reiniciado\x1b[0m\n');
console.log('\x1b[36mYa puedes abrir otro modo:\x1b[0m');
console.log('  pnpm dev:landing');
console.log('  pnpm dev:extension');
console.log('  pnpm dev:panel');
console.log('  pnpm dev:options\n');
