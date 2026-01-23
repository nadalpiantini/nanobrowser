/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔀 LLM ROUTER - Cloud ↔ Local Decision Engine
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * Purpose: Route LLM requests to Cloud or Local based on:
 * - Build environment (dev vs prod)
 * - Operation type (planning vs final scraping)
 * - Safety guardrails (never local for user-facing results)
 *
 * Security:
 * - DEV_LOCAL mode ONLY works in development builds
 * - Production builds ignore all local routing
 * - User has NO control over routing (build decides)
 *
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { type ProviderConfig, type ModelConfig, ProviderTypeEnum } from '@extension/storage';
import { createLogger } from '@src/background/log';

const logger = createLogger('llm-router');

// ═══════════════════════════════════════════════════════════════════
// 🎯 OPERATION TYPES
// ═══════════════════════════════════════════════════════════════════
export enum OperationType {
  // ✅ ALLOWED in DEV_LOCAL
  PLANNING = 'planning',
  PARSING = 'parsing',
  DRY_RUN = 'dry-run',
  DEBUGGING = 'debugging',
  PROMPT_SHAPING = 'prompt-shaping',

  // ❌ NEVER ALLOWED in DEV_LOCAL
  SCRAPING = 'scraping',
  FINAL_OUTPUT = 'final-output',
  USER_RESULTS = 'user-results',
}

// ═══════════════════════════════════════════════════════════════════
// 🔒 DEV MODE DETECTION (Build-Time)
// ═══════════════════════════════════════════════════════════════════
export function isDevLocalMode(): boolean {
  // Triple guard: env var, NODE_ENV, and build flag
  const envFlag = import.meta.env.VITE_FREEJACK_DEV_LOCAL === 'true';
  const isDev = import.meta.env.DEV === true;
  const isNotProd = import.meta.env.PROD !== true;

  const result = envFlag && isDev && isNotProd;

  if (result) {
    logger.debug('🔓 DEV_LOCAL mode ACTIVE', {
      env: import.meta.env.MODE,
      flag: envFlag,
      dev: isDev,
    });
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════
// ✅ OPERATION VALIDATION
// ═══════════════════════════════════════════════════════════════════
const ALLOWED_LOCAL_OPS = new Set<OperationType>([
  OperationType.PLANNING,
  OperationType.PARSING,
  OperationType.DRY_RUN,
  OperationType.DEBUGGING,
  OperationType.PROMPT_SHAPING,
]);

export function canUseLocalForOperation(operation: OperationType): boolean {
  return ALLOWED_LOCAL_OPS.has(operation);
}

// ═══════════════════════════════════════════════════════════════════
// 🧠 MODEL SELECTION (Local)
// ═══════════════════════════════════════════════════════════════════
export function getLocalModelForAgent(agentName: string): string {
  const models = {
    planner: import.meta.env.VITE_OLLAMA_LOCAL_MODEL_PLANNER || 'qwen2.5-coder:7b',
    navigator: import.meta.env.VITE_OLLAMA_LOCAL_MODEL_NAVIGATOR || 'qwen2.5-coder:14b',
    validator: import.meta.env.VITE_OLLAMA_LOCAL_MODEL_VALIDATOR || 'qwen2.5-coder:7b',
  };

  const agentKey = agentName.toLowerCase();
  return models[agentKey as keyof typeof models] || models.planner;
}

// ═══════════════════════════════════════════════════════════════════
// 🔀 ROUTING DECISION ENGINE
// ═══════════════════════════════════════════════════════════════════
export interface RoutingContext {
  operation: OperationType;
  agentName: string;
  allowLocal?: boolean; // Optional override (for testing)
}

export interface RoutedConfig {
  useLocal: boolean;
  providerConfig: Partial<ProviderConfig>;
  modelConfig: Partial<ModelConfig>;
  rationale: string;
}

/**
 * Main routing function - decides Cloud vs Local
 */
export function routeLLMRequest(context: RoutingContext): RoutedConfig {
  // 🚨 GUARD 1: Production always uses Cloud
  if (!isDevLocalMode()) {
    logger.debug('🌩️ Routing to CLOUD (prod mode)', { operation: context.operation });
    return {
      useLocal: false,
      providerConfig: {},
      modelConfig: {},
      rationale: 'Production environment - cloud only',
    };
  }

  // 🚨 GUARD 2: Operation validation
  if (!canUseLocalForOperation(context.operation)) {
    logger.warn('⚠️ Operation NOT ALLOWED for local', {
      operation: context.operation,
      allowed: Array.from(ALLOWED_LOCAL_OPS),
    });
    return {
      useLocal: false,
      providerConfig: {},
      modelConfig: {},
      rationale: `Operation '${context.operation}' requires cloud LLM`,
    };
  }

  // 🚨 GUARD 3: Optional override (testing only)
  if (context.allowLocal === false) {
    logger.debug('🌩️ Routing to CLOUD (explicit override)', { operation: context.operation });
    return {
      useLocal: false,
      providerConfig: {},
      modelConfig: {},
      rationale: 'Explicit cloud override',
    };
  }

  // ✅ ALL GUARDS PASSED - Route to Local
  const localModel = getLocalModelForAgent(context.agentName);
  const baseUrl = import.meta.env.VITE_OLLAMA_LOCAL_BASE_URL || 'http://localhost:11434';
  const adapter = import.meta.env.VITE_OLLAMA_LOCAL_ADAPTER || 'fj-dev-local';

  logger.info('🏠 Routing to LOCAL Ollama', {
    operation: context.operation,
    agent: context.agentName,
    model: localModel,
    baseUrl,
  });

  return {
    useLocal: true,
    providerConfig: {
      provider: ProviderTypeEnum.Ollama,
      baseUrl,
      apiKey: adapter, // Loopback adapter (Ollama ignores this)
    },
    modelConfig: {
      provider: ProviderTypeEnum.Ollama,
      modelName: localModel,
    },
    rationale: `DEV_LOCAL: ${context.operation} via ${localModel}`,
  };
}

// ═══════════════════════════════════════════════════════════════════
// 🔍 TELEMETRY MARKER
// ═══════════════════════════════════════════════════════════════════
export function getLLMMode(): 'CLOUD' | 'DEV_LOCAL' {
  return isDevLocalMode() ? 'DEV_LOCAL' : 'CLOUD';
}

export function getRoutingHeaders(): Record<string, string> {
  return {
    'X-FreeJack-Mode': getLLMMode(),
    'X-FreeJack-Build': import.meta.env.MODE || 'unknown',
  };
}

// ═══════════════════════════════════════════════════════════════════
// 🚨 VALIDATION UTILITIES
// ═══════════════════════════════════════════════════════════════════

/**
 * Throws error if DEV_LOCAL config exists in production build
 */
export function assertNoLocalConfigInProd(): void {
  if (import.meta.env.PROD === true) {
    const hasDevFlag = import.meta.env.VITE_FREEJACK_DEV_LOCAL !== undefined;
    const hasLocalUrl = import.meta.env.VITE_OLLAMA_LOCAL_BASE_URL !== undefined;

    if (hasDevFlag || hasLocalUrl) {
      const error = '🚨 SECURITY VIOLATION: DEV_LOCAL config detected in production build';
      logger.error(error, {
        hasDevFlag,
        hasLocalUrl,
        env: import.meta.env.MODE,
      });
      throw new Error(error);
    }
  }
}

/**
 * Validates routing decision before LLM invocation
 */
export function validateRoutingDecision(routed: RoutedConfig, finalUserOutput: boolean): void {
  // If this is final user output, it MUST use cloud
  if (finalUserOutput && routed.useLocal) {
    const error = '🚨 ROUTING VIOLATION: Attempting to use local LLM for final user output';
    logger.error(error, { routed });
    throw new Error(error);
  }

  // If in prod and somehow useLocal=true, block it
  if (import.meta.env.PROD === true && routed.useLocal) {
    const error = '🚨 SECURITY VIOLATION: Local LLM routing in production build';
    logger.error(error, { routed });
    throw new Error(error);
  }
}
