#!/usr/bin/env node

/**
 * Script de inicialización y debug para la extensión de Chrome
 * Este script ayuda a inicializar y probar el modo de desarrollo de la extensión
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Inicializando modo de desarrollo para WebPilot Chrome Extension...');

// Configurar variables de entorno para desarrollo
process.env.__DEV__ = 'true';
process.env.DEBUG = 'true';

console.log('✅ Variables de entorno configuradas:');
console.log('   __DEV__ =', process.env.__DEV__);
console.log('   DEBUG =', process.env.DEBUG);

// Verificar la existencia de archivos importantes
const importantFiles = [
  'package.json',
  'manifest.js',
  'vite.config.mts',
  'src/background/index.ts',
  'src/background/config/defaultProviders.ts',
];

console.log('\n📋 Verificando archivos importantes...');
importantFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Información del modo de desarrollo
console.log('\n⚙️  Información del modo de desarrollo:');
console.log('   • Los logs de debug están habilitados');
console.log('   • Se utilizará el entorno de desarrollo de Vite');
console.log('   • Las funciones de logging mostrarán información detallada');
console.log('   • Los errores y advertencias serán más detallados');

// Instrucciones de uso
console.log('\n📖 Instrucciones de uso:');
console.log('   1. Para construir en modo desarrollo: npm run dev');
console.log('   2. Para construir normalmente: npm run build');
console.log('   3. Para ejecutar pruebas: npm run test');
console.log('   4. Para verificar tipos: npm run type-check');

console.log('\n🚀 ¡Modo de desarrollo preparado!');
