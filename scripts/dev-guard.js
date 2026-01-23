#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2];
const statePath = path.join(__dirname, 'dev-state.json');

// No mode = blocked
if (!mode) {
  console.log('\n\x1b[31m' + '='.repeat(50) + '\x1b[0m');
  console.log('\x1b[31m  BLOQUEADO: pnpm dev directo no permitido\x1b[0m');
  console.log('\x1b[31m' + '='.repeat(50) + '\x1b[0m\n');
  console.log('\x1b[33m  Usa uno de estos comandos:\x1b[0m\n');
  console.log('    \x1b[36mpnpm dev:landing\x1b[0m    → Landing page');
  console.log('    \x1b[36mpnpm dev:extension\x1b[0m  → Chrome extension');
  console.log('    \x1b[36mpnpm dev:panel\x1b[0m      → Side panel');
  console.log('    \x1b[36mpnpm dev:options\x1b[0m    → Options page');
  console.log('\n    \x1b[90mpnpm dev:reset\x1b[0m      → Limpiar estado\n');
  process.exit(1);
}

// Read current state
let state;
try {
  state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
} catch {
  state = { activeMode: null };
}

// Check if different mode is active
if (state.activeMode && state.activeMode !== mode) {
  console.log('\n\x1b[31m' + '='.repeat(50) + '\x1b[0m');
  console.log('\x1b[31m  MODO BLOQUEADO\x1b[0m');
  console.log('\x1b[31m' + '='.repeat(50) + '\x1b[0m\n');
  console.log(`  \x1b[33mModo activo:\x1b[0m    \x1b[36m${state.activeMode}\x1b[0m`);
  console.log(`  \x1b[33mIntentaste:\x1b[0m     \x1b[90m${mode}\x1b[0m\n`);
  console.log('  \x1b[90mPara cambiar de modo:\x1b[0m');
  console.log('    \x1b[36mpnpm dev:reset\x1b[0m\n');
  process.exit(1);
}

// Activate mode or allow additional window
if (!state.activeMode) {
  state.activeMode = mode;
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log(`\n\x1b[32m✓ Modo activado: ${mode}\x1b[0m\n`);
} else {
  console.log(`\n\x1b[36m♻ Modo ${mode} ya activo (ventana adicional OK)\x1b[0m\n`);
}
