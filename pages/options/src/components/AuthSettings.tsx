/**
 * 🔐 AUTH SETTINGS - User authentication component
 *
 * Handles login/logout with freejack-web
 * Shows user status, tier, and quota
 */
import { useState, useEffect, useCallback } from 'react';
import { authStore, type AuthState, UserTier } from '@extension/storage';

interface AuthSettingsProps {
  isDarkMode?: boolean;
  onAuthChange?: (isAuthenticated: boolean, isAdmin: boolean) => void;
}

// Backend URL
const FREEJACK_WEB_URL = import.meta.env.VITE_FREEJACK_WEB_URL || 'https://freejack.ai';

export const AuthSettings = ({ isDarkMode = false, onAuthChange }: AuthSettingsProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<Pick<AuthState, 'userId' | 'email' | 'name' | 'image' | 'tier'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginMode, setLoginMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Load auth state
  const loadAuthState = useCallback(async () => {
    const authenticated = await authStore.isAuthenticated();
    const admin = await authStore.isAdmin();
    const userData = await authStore.getUser();

    setIsAuthenticated(authenticated);
    setIsAdmin(admin);
    setUser(authenticated ? userData : null);
    setIsLoading(false);

    onAuthChange?.(authenticated, admin);
  }, [onAuthChange]);

  useEffect(() => {
    loadAuthState();
  }, [loadAuthState]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoginLoading(true);

    try {
      const response = await fetch(`${FREEJACK_WEB_URL}/api/extension/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Extension-Version': chrome.runtime.getManifest().version,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Login failed');
        return;
      }

      // Store tokens
      await authStore.setTokens(data.accessToken, data.refreshToken, data.expiresIn || 3600);

      // Store user
      await authStore.setUser({
        userId: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image,
        tier: data.user.tier as UserTier,
        isAuthenticated: true,
      });

      await authStore.setLastSyncAt(Date.now());

      // Reload state
      await loadAuthState();
      setLoginMode(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Network error - check your connection');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    const token = await authStore.getAccessToken();

    // Notify backend (best effort)
    if (token) {
      fetch(`${FREEJACK_WEB_URL}/api/extension/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Extension-Version': chrome.runtime.getManifest().version,
        },
      }).catch(() => {});
    }

    // Clear local state
    await authStore.logout();
    await loadAuthState();
  };

  // Tier badge colors
  const tierColors = {
    [UserTier.FREE]: 'bg-gray-500',
    [UserTier.PRO]: 'bg-blue-500',
    [UserTier.UNLIMITED]: 'bg-purple-500',
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <div
          className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-white'} p-6 shadow-sm`}>
          <div className="flex items-center justify-center">
            <span className="animate-pulse">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-white'} p-6 text-left shadow-sm`}>
        <h2 className={`mb-4 text-left text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          🔐 Account
        </h2>

        {isAuthenticated && user ? (
          // Logged in view
          <div className="space-y-4">
            {/* User info */}
            <div className="flex items-center gap-4">
              {user.image ? (
                <img src={user.image} alt={user.name || 'User'} className="size-12 rounded-full" />
              ) : (
                <div
                  className={`flex size-12 items-center justify-center rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
                  <span className="text-xl">{user.email?.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {user.name || user.email}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs text-white ${tierColors[user.tier]}`}>
                    {user.tier}
                  </span>
                  {isAdmin && <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">ADMIN</span>}
                </div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</span>
              </div>
            </div>

            {/* Admin badge */}
            {isAdmin && (
              <div className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-2 text-green-600">
                <span>✅</span>
                <span className="text-sm font-medium">Admin mode enabled - Dev Tools tab unlocked</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleLogout}
                className={`rounded-md px-4 py-2 text-sm ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}>
                Logout
              </button>
              <a
                href={`${FREEJACK_WEB_URL}/dashboard`}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-md px-4 py-2 text-sm ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Open Dashboard →
              </a>
            </div>
          </div>
        ) : loginMode ? (
          // Login form
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500">{error}</div>}

            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className={`mt-1 w-full rounded-md border px-3 py-2 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'}`}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className={`mt-1 w-full rounded-md border px-3 py-2 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'}`}
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loginLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
              <button
                type="button"
                onClick={() => setLoginMode(false)}
                className={`rounded-md px-4 py-2 text-sm ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Cancel
              </button>
            </div>

            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <a
                href={`${FREEJACK_WEB_URL}/auth/register`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline">
                Register here
              </a>
            </p>
          </form>
        ) : (
          // Not logged in
          <div className="space-y-4">
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Login to sync your subscription and unlock premium features.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setLoginMode(true)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                Login with Email
              </button>
              <a
                href={`${FREEJACK_WEB_URL}/auth/register`}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-md px-4 py-2 text-sm ${isDarkMode ? 'bg-slate-600 hover:bg-slate-500' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Create Account
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
