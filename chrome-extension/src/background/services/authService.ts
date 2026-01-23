/**
 * 🔐 AUTH SERVICE - Extension authentication with freejack-web
 *
 * Handles:
 * - Login/logout with freejack-web backend
 * - Token refresh
 * - Admin validation
 * - Tier synchronization
 */

import { authStore, type AuthState, UserTier } from '@extension/storage';
import { createLogger } from '@src/background/log';

const logger = createLogger('auth-service');

// ═══════════════════════════════════════════════════════════════════
// 🔧 CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

// Backend URL - use env var or default to production
const FREEJACK_WEB_URL = import.meta.env.VITE_FREEJACK_WEB_URL || 'https://freejack.ai';

// API endpoints
const ENDPOINTS = {
  login: `${FREEJACK_WEB_URL}/api/extension/auth/login`,
  refresh: `${FREEJACK_WEB_URL}/api/extension/auth/refresh`,
  validate: `${FREEJACK_WEB_URL}/api/extension/auth/validate`,
  logout: `${FREEJACK_WEB_URL}/api/extension/auth/logout`,
  me: `${FREEJACK_WEB_URL}/api/extension/auth/me`,
};

// ═══════════════════════════════════════════════════════════════════
// 📦 TYPES
// ═══════════════════════════════════════════════════════════════════

interface LoginResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: string;
    email: string;
    name?: string;
    image?: string;
    tier: UserTier;
    isAdmin: boolean;
  };
  error?: string;
}

interface RefreshResponse {
  success: boolean;
  accessToken?: string;
  expiresIn?: number;
  error?: string;
}

interface ValidateResponse {
  success: boolean;
  valid: boolean;
  user?: {
    id: string;
    email: string;
    tier: UserTier;
    isAdmin: boolean;
    dailyRequestCount: number;
    dailyRequestLimit: number;
  };
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════
// 🔐 AUTH SERVICE
// ═══════════════════════════════════════════════════════════════════

class AuthService {
  private refreshPromise: Promise<boolean> | null = null;

  // ─────────────────────────────────────────────────────────────────
  // 🔑 LOGIN
  // ─────────────────────────────────────────────────────────────────

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info('🔐 Attempting login', { email });

      const response = await fetch(ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Extension-Version': chrome.runtime.getManifest().version,
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (!data.success || !data.accessToken || !data.refreshToken || !data.user) {
        logger.warning('🔐 Login failed', { error: data.error });
        return { success: false, error: data.error || 'Login failed' };
      }

      // Store tokens
      await authStore.setTokens(data.accessToken, data.refreshToken, data.expiresIn || 3600);

      // Store user info
      await authStore.setUser({
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name || null,
        image: data.user.image || null,
        tier: data.user.tier,
        isAuthenticated: true,
      });

      await authStore.setLastSyncAt(Date.now());

      logger.info('✅ Login successful', {
        email: data.user.email,
        tier: data.user.tier,
        isAdmin: data.user.isAdmin,
      });

      return { success: true };
    } catch (error) {
      logger.error('🔐 Login error', { error });
      return { success: false, error: 'Network error - check your connection' };
    }
  }

  /**
   * Login using web session (opens popup to freejack-web)
   */
  async loginWithWeb(): Promise<{ success: boolean; error?: string }> {
    return new Promise(resolve => {
      // Open auth popup
      const authUrl = `${FREEJACK_WEB_URL}/auth/extension?callback=true`;

      chrome.windows.create(
        {
          url: authUrl,
          type: 'popup',
          width: 500,
          height: 700,
        },
        window => {
          if (!window?.id) {
            resolve({ success: false, error: 'Failed to open auth window' });
            return;
          }

          // Listen for callback message from web
          const messageListener = (
            message: {
              type: string;
              accessToken?: string;
              refreshToken?: string;
              expiresIn?: number;
              user?: LoginResponse['user'];
              error?: string;
            },
            sender: chrome.runtime.MessageSender,
          ) => {
            if (message.type === 'FREEJACK_AUTH_CALLBACK') {
              chrome.runtime.onMessageExternal.removeListener(messageListener);

              if (message.accessToken && message.refreshToken && message.user) {
                // Store tokens and user
                Promise.all([
                  authStore.setTokens(message.accessToken, message.refreshToken, message.expiresIn || 3600),
                  authStore.setUser({
                    userId: message.user.id,
                    email: message.user.email,
                    name: message.user.name || null,
                    image: message.user.image || null,
                    tier: message.user.tier,
                    isAuthenticated: true,
                  }),
                  authStore.setLastSyncAt(Date.now()),
                ]).then(() => {
                  // Close auth window
                  if (window.id) chrome.windows.remove(window.id);
                  resolve({ success: true });
                });
              } else {
                if (window.id) chrome.windows.remove(window.id);
                resolve({ success: false, error: message.error || 'Auth callback failed' });
              }
            }
          };

          chrome.runtime.onMessageExternal.addListener(messageListener);

          // Timeout after 5 minutes
          setTimeout(
            () => {
              chrome.runtime.onMessageExternal.removeListener(messageListener);
              resolve({ success: false, error: 'Auth timeout - window closed' });
            },
            5 * 60 * 1000,
          );
        },
      );
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // 🔄 TOKEN REFRESH
  // ─────────────────────────────────────────────────────────────────

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    // Prevent concurrent refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._doRefresh();

    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async _doRefresh(): Promise<boolean> {
    try {
      const refreshToken = await authStore.getRefreshToken();

      if (!refreshToken) {
        logger.warning('🔄 No refresh token available');
        return false;
      }

      logger.debug('🔄 Refreshing access token');

      const response = await fetch(ENDPOINTS.refresh, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Extension-Version': chrome.runtime.getManifest().version,
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data: RefreshResponse = await response.json();

      if (!data.success || !data.accessToken) {
        logger.warning('🔄 Token refresh failed', { error: data.error });
        // Clear auth state if refresh fails
        await authStore.logout();
        return false;
      }

      // Update access token (keep same refresh token)
      const currentRefresh = await authStore.getRefreshToken();
      await authStore.setTokens(data.accessToken, currentRefresh || '', data.expiresIn || 3600);

      logger.debug('✅ Token refreshed successfully');
      return true;
    } catch (error) {
      logger.error('🔄 Token refresh error', { error });
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // ✅ VALIDATION
  // ─────────────────────────────────────────────────────────────────

  /**
   * Validate current session and sync user data
   */
  async validateAndSync(): Promise<boolean> {
    try {
      // Check if token is expired
      if (await authStore.isTokenExpired()) {
        const refreshed = await this.refreshAccessToken();
        if (!refreshed) return false;
      }

      const accessToken = await authStore.getAccessToken();
      if (!accessToken) return false;

      logger.debug('✅ Validating session with backend');

      const response = await fetch(ENDPOINTS.validate, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Extension-Version': chrome.runtime.getManifest().version,
        },
      });

      const data: ValidateResponse = await response.json();

      if (!data.success || !data.valid || !data.user) {
        logger.warning('✅ Session invalid', { error: data.error });
        await authStore.logout();
        return false;
      }

      // Sync user data
      await authStore.setUser({
        userId: data.user.id,
        email: data.user.email,
        tier: data.user.tier,
        dailyRequestCount: data.user.dailyRequestCount,
        dailyRequestLimit: data.user.dailyRequestLimit,
      });

      await authStore.setLastSyncAt(Date.now());

      logger.debug('✅ Session validated and synced', {
        email: data.user.email,
        tier: data.user.tier,
        isAdmin: data.user.isAdmin,
      });

      return true;
    } catch (error) {
      logger.error('✅ Validation error', { error });
      return false;
    }
  }

  /**
   * Get valid access token (refreshes if needed)
   */
  async getValidAccessToken(): Promise<string | null> {
    // Check if token is expired
    if (await authStore.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) return null;
    }

    return authStore.getAccessToken();
  }

  // ─────────────────────────────────────────────────────────────────
  // 🚪 LOGOUT
  // ─────────────────────────────────────────────────────────────────

  /**
   * Logout and clear all auth state
   */
  async logout(): Promise<void> {
    try {
      const accessToken = await authStore.getAccessToken();

      // Notify backend (best effort)
      if (accessToken) {
        fetch(ENDPOINTS.logout, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-Extension-Version': chrome.runtime.getManifest().version,
          },
        }).catch(() => {
          // Ignore logout notification errors
        });
      }
    } finally {
      // Always clear local state
      await authStore.logout();
      logger.info('🚪 Logged out');
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // 📊 STATUS
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get current auth status
   */
  async getStatus(): Promise<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    user: Pick<AuthState, 'userId' | 'email' | 'name' | 'image' | 'tier'> | null;
    canMakeRequest: boolean;
  }> {
    const isAuthenticated = await authStore.isAuthenticated();

    if (!isAuthenticated) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        canMakeRequest: true, // Allow requests for unauthenticated users (limited)
      };
    }

    const [isAdmin, user, canMakeRequest] = await Promise.all([
      authStore.isAdmin(),
      authStore.getUser(),
      authStore.canMakeRequest(),
    ]);

    return {
      isAuthenticated,
      isAdmin,
      user,
      canMakeRequest,
    };
  }
}

// Singleton instance
export const authService = new AuthService();

// ═══════════════════════════════════════════════════════════════════
// 🔄 AUTO-SYNC
// ═══════════════════════════════════════════════════════════════════

// Sync every 15 minutes if authenticated
const SYNC_INTERVAL = 15 * 60 * 1000;

let syncInterval: ReturnType<typeof setInterval> | null = null;

export function startAuthSync(): void {
  if (syncInterval) return;

  syncInterval = setInterval(async () => {
    const isAuthenticated = await authStore.isAuthenticated();
    if (isAuthenticated) {
      await authService.validateAndSync();
    }
  }, SYNC_INTERVAL);

  logger.debug('🔄 Auth sync started');
}

export function stopAuthSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    logger.debug('🔄 Auth sync stopped');
  }
}

// Start sync on module load
startAuthSync();
