#!/usr/bin/env node
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stateFile = path.join(__dirname, 'dev-state.json');

// Ensure state file exists
if (!fs.existsSync(stateFile)) {
  fs.writeFileSync(stateFile, JSON.stringify({ activeMode: null }, null, 2));
}

const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));

// Detect machine
const cpu = os.cpus()[0]?.model || '';
const chip = cpu.includes('M1')
  ? 'M1'
  : cpu.includes('M2')
    ? 'M2'
    : cpu.includes('M3')
      ? 'M3'
      : cpu.includes('M4')
        ? 'M4'
        : 'Mac';

console.clear();
console.log(`
\x1b[36m╔══════════════════════════════════════╗
║         🚀 FREEJACK MODE             ║
╠══════════════════════════════════════╣\x1b[0m
║  \x1b[33m${chip}\x1b[0m | Activo: \x1b[32m${state.activeMode || 'ninguno'}\x1b[0m
\x1b[36m╠══════════════════════════════════════╣
║\x1b[0m  1) Landing (Marketing)              \x1b[36m║
║\x1b[0m  2) Chrome Extension                 \x1b[36m║
║\x1b[0m  3) Side Panel                       \x1b[36m║
║\x1b[0m  4) Options Page                     \x1b[36m║
║\x1b[0m                                      \x1b[36m║
║\x1b[0m  0) Reset / Piso limpio              \x1b[36m║
╚══════════════════════════════════════╝\x1b[0m
`);

const modes = {
  1: 'landing',
  2: 'extension',
  3: 'panel',
  4: 'options',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('\x1b[33m→ Selecciona: \x1b[0m', choice => {
  rl.close();

  // Reset
  if (choice === '0') {
    spawnSync('pnpm', ['dev:reset'], { stdio: 'inherit', shell: true });
    return;
  }

  const mode = modes[choice];
  if (!mode) {
    console.log('\n\x1b[31m❌ Opción inválida\x1b[0m\n');
    process.exit(1);
  }

  // Check blocking
  if (state.activeMode && state.activeMode !== mode) {
    console.log(`
\x1b[31m🚫 MODO BLOQUEADO\x1b[0m
   Activo: \x1b[33m${state.activeMode}\x1b[0m
   Intentaste: \x1b[90m${mode}\x1b[0m

   → Usa opción \x1b[36m0\x1b[0m para reset
`);
    process.exit(1);
  }

  // Activate and run
  fs.writeFileSync(stateFile, JSON.stringify({ activeMode: mode }, null, 2));
  console.log(`\n\x1b[32m✓ Modo: ${mode}\x1b[0m\n`);

  spawnSync('pnpm', [`dev:${mode}`], { stdio: 'inherit', shell: true });
});
