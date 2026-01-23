/**
 * 🔐 AUTH STORE - Extension authentication storage
 *
 * Stores JWT tokens and user info synced from freejack-web
 * Used for validating admin status and tier access
 */
import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
import { ADMIN_EMAIL } from '../settings/devSettings';

// User tier enum matching freejack-web
export enum UserTier {
  FREE = 'FREE',
  PRO = 'PRO',
  UNLIMITED = 'UNLIMITED',
}

// Auth state interface
export interface AuthState {
  // Tokens
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null; // Unix timestamp

  // User info
  userId: string | null;
  email: string | null;
  name: string | null;
  image: string | null;

  // Subscription
  tier: UserTier;
  dailyRequestCount: number;
  dailyRequestLimit: number;

  // Status
  isAuthenticated: boolean;
  isAdmin: boolean;
  lastSyncAt: number | null;
}

export type AuthStorage = BaseStorage<AuthState> & {
  // Token management
  setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getRefreshToken: () => Promise<string | null>;
  isTokenExpired: () => Promise<boolean>;
  clearTokens: () => Promise<void>;

  // User info
  setUser: (user: Partial<AuthState>) => Promise<void>;
  getUser: () => Promise<Pick<AuthState, 'userId' | 'email' | 'name' | 'image' | 'tier'>>;

  // Status checks
  isAuthenticated: () => Promise<boolean>;
  isAdmin: () => Promise<boolean>;
  getTier: () => Promise<UserTier>;

  // Quota
  incrementRequestCount: () => Promise<number>;
  canMakeRequest: () => Promise<boolean>;
  resetDailyCount: () => Promise<void>;

  // Sync
  getLastSyncAt: () => Promise<number | null>;
  setLastSyncAt: (timestamp: number) => Promise<void>;

  // Full logout
  logout: () => Promise<void>;
};

// Default state - not authenticated
export const DEFAULT_AUTH_STATE: AuthState = {
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  userId: null,
  email: null,
  name: null,
  image: null,
  tier: UserTier.FREE,
  dailyRequestCount: 0,
  dailyRequestLimit: 100, // FREE tier default
  isAuthenticated: false,
  isAdmin: false,
  lastSyncAt: null,
};

// Tier limits matching freejack-web
const TIER_LIMITS: Record<UserTier, number> = {
  [UserTier.FREE]: 100,
  [UserTier.PRO]: 1000,
  [UserTier.UNLIMITED]: Infinity,
};

const storage = createStorage<AuthState>('freejack-auth', DEFAULT_AUTH_STATE, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const authStore: AuthStorage = {
  ...storage,

  // ═══════════════════════════════════════════════════════════════════
  // 🔑 TOKEN MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════

  async setTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    const current = await storage.get();
    const tokenExpiresAt = Date.now() + expiresIn * 1000;

    await storage.set({
      ...current,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      isAuthenticated: true,
    });
  },

  async getAccessToken() {
    const state = await storage.get();
    return state?.accessToken || null;
  },

  async getRefreshToken() {
    const state = await storage.get();
    return state?.refreshToken || null;
  },

  async isTokenExpired() {
    const state = await storage.get();
    if (!state?.tokenExpiresAt) return true;

    // Add 60 second buffer for safety
    return Date.now() > state.tokenExpiresAt - 60000;
  },

  async clearTokens() {
    const current = await storage.get();
    await storage.set({
      ...current,
      accessToken: null,
      refreshToken: null,
      tokenExpiresAt: null,
      isAuthenticated: false,
    });
  },

  // ═══════════════════════════════════════════════════════════════════
  // 👤 USER INFO
  // ═══════════════════════════════════════════════════════════════════

  async setUser(user: Partial<AuthState>) {
    const current = await storage.get();
    const email = user.email || current?.email;
    const tier = user.tier || current?.tier || UserTier.FREE;

    // Auto-detect admin status from email
    const isAdmin = email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    await storage.set({
      ...current,
      ...user,
      isAdmin,
      dailyRequestLimit: TIER_LIMITS[tier],
    });
  },

  async getUser() {
    const state = await storage.get();
    return {
      userId: state?.userId || null,
      email: state?.email || null,
      name: state?.name || null,
      image: state?.image || null,
      tier: state?.tier || UserTier.FREE,
    };
  },

  // ═══════════════════════════════════════════════════════════════════
  // ✅ STATUS CHECKS
  // ═══════════════════════════════════════════════════════════════════

  async isAuthenticated() {
    const state = await storage.get();
    if (!state?.isAuthenticated || !state?.accessToken) return false;

    // Check if token is expired
    const expired = await this.isTokenExpired();
    return !expired;
  },

  async isAdmin() {
    const state = await storage.get();
    return state?.isAdmin || false;
  },

  async getTier() {
    const state = await storage.get();
    return state?.tier || UserTier.FREE;
  },

  // ═══════════════════════════════════════════════════════════════════
  // 📊 QUOTA MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════

  async incrementRequestCount() {
    const current = await storage.get();
    const newCount = (current?.dailyRequestCount || 0) + 1;

    await storage.set({
      ...current,
      dailyRequestCount: newCount,
    });

    return newCount;
  },

  async canMakeRequest() {
    const state = await storage.get();
    const count = state?.dailyRequestCount || 0;
    const limit = state?.dailyRequestLimit || TIER_LIMITS[UserTier.FREE];

    // Admin bypasses limits
    if (state?.isAdmin) return true;

    // UNLIMITED tier
    if (state?.tier === UserTier.UNLIMITED) return true;

    return count < limit;
  },

  async resetDailyCount() {
    const current = await storage.get();
    await storage.set({
      ...current,
      dailyRequestCount: 0,
    });
  },

  // ═══════════════════════════════════════════════════════════════════
  // 🔄 SYNC
  // ═══════════════════════════════════════════════════════════════════

  async getLastSyncAt() {
    const state = await storage.get();
    return state?.lastSyncAt || null;
  },

  async setLastSyncAt(timestamp: number) {
    const current = await storage.get();
    await storage.set({
      ...current,
      lastSyncAt: timestamp,
    });
  },

  // ═══════════════════════════════════════════════════════════════════
  // 🚪 LOGOUT
  // ═══════════════════════════════════════════════════════════════════

  async logout() {
    await storage.set(DEFAULT_AUTH_STATE);
  },
};
