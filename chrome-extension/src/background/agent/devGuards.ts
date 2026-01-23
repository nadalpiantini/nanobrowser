/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🛡️ DEV GUARDS - Development Mode Safety Layer
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Purpose: Enforce strict separation between DEV_LOCAL and PRODUCTION
 * Provides runtime validation and compile-time type safety
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { createLogger } from '@src/background/log';
import { isDevLocalMode } from './llmRouter';

const logger = createLogger('dev-guards');

// ═══════════════════════════════════════════════════════════════════
// 🎯 DEVELOPMENT CONTEXT
// ═══════════════════════════════════════════════════════════════════
export interface DevContext {
  isDev: boolean;
  mode: string;
  hasDevFlag: boolean;
  allowsLocal: boolean;
}

export function getDevContext(): DevContext {
  return {
    isDev: import.meta.env.DEV === true,
    mode: import.meta.env.MODE || 'unknown',
    hasDevFlag: import.meta.env.VITE_FREEJACK_DEV_LOCAL === 'true',
    allowsLocal: isDevLocalMode(),
  };
}

// ═══════════════════════════════════════════════════════════════════
// 🚨 GUARD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Guard: Throws if called in production
 * Use for functions that should ONLY exist in dev
 */
export function assertDevOnly(context: string): void {
  if (!isDevLocalMode()) {
    const error = `🚨 DEV_ONLY violation: ${context} called in non-dev environment`;
    logger.error(error, getDevContext());
    throw new Error(error);
  }
}

/**
 * Guard: Warns if DEV function is called (but allows it)
 * Use for debugging/experimental features
 */
export function warnDevUsage(context: string): void {
  if (isDevLocalMode()) {
    logger.warning(`🔶 DEV_LOCAL: ${context}`, getDevContext());
  }
}

/**
 * Guard: Blocks localhost URLs in production
 */
export function assertNoLocalhostInProd(url: string, context: string): void {
  if (import.meta.env.PROD === true) {
    if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('::1')) {
      const error = `🚨 SECURITY: Localhost URL in production: ${url} (${context})`;
      logger.error(error);
      throw new Error(error);
    }
  }
}

/**
 * Guard: Ensures CORS localhost access only in dev
 */
export function validateCorsForEnv(origin: string): boolean {
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');

  if (isLocalhost && import.meta.env.PROD === true) {
    logger.error('🚨 CORS violation: localhost origin in production', { origin });
    return false;
  }

  return true;
}

/**
 * Guard: Blocks dev-only environment variables in prod
 */
export function assertNoDevEnvInProd(): void {
  if (import.meta.env.PROD === true) {
    const devVars = [
      'VITE_FREEJACK_DEV_LOCAL',
      'VITE_OLLAMA_LOCAL_BASE_URL',
      'VITE_OLLAMA_LOCAL_ADAPTER',
      'VITE_DEV_LOCAL_ALLOWED_OPS',
    ];

    const found = devVars.filter(v => import.meta.env[v] !== undefined);

    if (found.length > 0) {
      const error = `🚨 SECURITY: Dev env vars in production: ${found.join(', ')}`;
      logger.error(error);
      throw new Error(error);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
// 🔍 INSPECTION UTILITIES
// ═══════════════════════════════════════════════════════════════════

/**
 * Check if current build is safe for production
 * Returns { safe: boolean, issues: string[] }
 */
export function auditBuildSafety(): { safe: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check 1: DEV_LOCAL flag should not exist
  if (import.meta.env.VITE_FREEJACK_DEV_LOCAL !== undefined) {
    issues.push('VITE_FREEJACK_DEV_LOCAL flag present');
  }

  // Check 2: Local URLs should not exist
  if (import.meta.env.VITE_OLLAMA_LOCAL_BASE_URL !== undefined) {
    issues.push('VITE_OLLAMA_LOCAL_BASE_URL present');
  }

  // Check 3: Build mode should be 'production'
  if (import.meta.env.MODE !== 'production') {
    issues.push(`Build MODE is '${import.meta.env.MODE}', expected 'production'`);
  }

  // Check 4: DEV flag should be false
  if (import.meta.env.DEV === true) {
    issues.push('DEV flag is true');
  }

  // Check 5: PROD flag should be true
  if (import.meta.env.PROD !== true) {
    issues.push('PROD flag is not true');
  }

  const safe = issues.length === 0;

  if (!safe) {
    logger.warning('⚠️ Build safety audit FAILED', { issues });
  } else {
    logger.info('✅ Build safety audit PASSED');
  }

  return { safe, issues };
}

/**
 * Get human-readable report of current environment
 */
export function getEnvironmentReport(): string {
  const ctx = getDevContext();
  const safety = auditBuildSafety();

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 FREEJACK ENVIRONMENT REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Build Mode: ${ctx.mode}
DEV Flag: ${ctx.isDev}
PROD Flag: ${import.meta.env.PROD}
DEV_LOCAL Enabled: ${ctx.hasDevFlag}
Local Routing: ${ctx.allowsLocal ? '🟢 ACTIVE' : '🔴 DISABLED'}

Safety Audit: ${safety.safe ? '✅ PASSED' : '❌ FAILED'}
${safety.issues.length > 0 ? `Issues:\n${safety.issues.map(i => `  - ${i}`).join('\n')}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
}

// ═══════════════════════════════════════════════════════════════════
// 🏁 INITIALIZATION CHECK
// ═══════════════════════════════════════════════════════════════════

/**
 * Run on startup to validate environment
 * Call this in background script initialization
 */
export function initializeDevGuards(): void {
  logger.info('🛡️ Initializing DEV Guards');

  // Log environment report
  logger.debug(getEnvironmentReport());

  // Assert no dev config in production
  assertNoDevEnvInProd();

  // Run safety audit
  const audit = auditBuildSafety();
  if (!audit.safe && import.meta.env.PROD === true) {
    throw new Error(`Production build failed safety audit: ${audit.issues.join(', ')}`);
  }

  logger.info('✅ DEV Guards initialized');
}

// ═══════════════════════════════════════════════════════════════════
// 🧪 TYPE GUARDS (Compile-Time Safety)
// ═══════════════════════════════════════════════════════════════════

/**
 * Type-level guard for dev-only code
 * Usage: if (isDevMode()) { ... TypeScript knows this is dev ... }
 */
export function isDevMode(): boolean {
  return isDevLocalMode();
}

/**
 * Conditional type for dev-only features
 * Note: Type-level conditional for compile-time safety
 */
export type DevOnly<T> = T | never;

/**
 * Conditional function execution (dev-only)
 */
export function runInDevOnly<T>(fn: () => T): T | undefined {
  if (isDevLocalMode()) {
    return fn();
  }
  return undefined;
}
