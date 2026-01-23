import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

// Admin email - ONLY this user sees dev tools
export const ADMIN_EMAIL = 'nadalpiantini@gmail.com';

// Interface for dev settings configuration
export interface DevSettingsConfig {
  adminEmail: string; // User's email to check admin access
  useLocalLLM: boolean; // Master switch for local Ollama
  localLLMBaseUrl: string; // Ollama URL (default: localhost:11434)
  localLLMModel: string; // Model to use (qwen2.5-coder, llama3.2-vision, etc)
  devModeEnabled: boolean; // Overall dev mode flag
}

export type DevSettingsStorage = BaseStorage<DevSettingsConfig> & {
  updateSettings: (settings: Partial<DevSettingsConfig>) => Promise<void>;
  getSettings: () => Promise<DevSettingsConfig>;
  isAdmin: () => Promise<boolean>;
  resetToDefaults: () => Promise<void>;
};

// Default settings
export const DEFAULT_DEV_SETTINGS: DevSettingsConfig = {
  adminEmail: '',
  useLocalLLM: false,
  localLLMBaseUrl: 'http://localhost:11434',
  localLLMModel: 'qwen2.5-coder:7b',
  devModeEnabled: false,
};

// Available local models for the dropdown
export const LOCAL_LLM_MODELS = [
  { id: 'qwen2.5-coder:7b', name: 'Qwen 2.5 Coder 7B', description: 'Fast, good for coding' },
  { id: 'qwen2.5-coder:14b', name: 'Qwen 2.5 Coder 14B', description: 'Better quality, slower' },
  { id: 'llama3.2-vision:11b', name: 'Llama 3.2 Vision 11B', description: 'Vision capable' },
  { id: 'deepseek-coder-v2:16b', name: 'DeepSeek Coder V2 16B', description: 'Strong coding' },
  { id: 'codestral:22b', name: 'Codestral 22B', description: 'Mistral coding model' },
  { id: 'gemma2:9b', name: 'Gemma 2 9B', description: 'Google model, balanced' },
];

const storage = createStorage<DevSettingsConfig>('dev-settings', DEFAULT_DEV_SETTINGS, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const devSettingsStore: DevSettingsStorage = {
  ...storage,
  async updateSettings(settings: Partial<DevSettingsConfig>) {
    const currentSettings = (await storage.get()) || DEFAULT_DEV_SETTINGS;
    const updatedSettings = {
      ...currentSettings,
      ...settings,
    };

    // If useLocalLLM is enabled, devModeEnabled must also be true
    if (updatedSettings.useLocalLLM) {
      updatedSettings.devModeEnabled = true;
    }

    await storage.set(updatedSettings);
  },
  async getSettings() {
    const settings = await storage.get();
    return {
      ...DEFAULT_DEV_SETTINGS,
      ...settings,
    };
  },
  async isAdmin() {
    const settings = await storage.get();
    return settings?.adminEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  },
  async resetToDefaults() {
    await storage.set(DEFAULT_DEV_SETTINGS);
  },
};
