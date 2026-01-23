/**
 * 🔧 DEV SETTINGS - Admin-only development tools
 *
 * This component is ONLY visible to nadalpiantini@gmail.com
 * Provides switches for local LLM routing (Ollama)
 */
import { useState, useEffect, useCallback } from 'react';
import {
  devSettingsStore,
  type DevSettingsConfig,
  DEFAULT_DEV_SETTINGS,
  LOCAL_LLM_MODELS,
  ADMIN_EMAIL,
} from '@extension/storage';

interface DevSettingsProps {
  isDarkMode?: boolean;
}

export const DevSettings = ({ isDarkMode = false }: DevSettingsProps) => {
  const [settings, setSettings] = useState<DevSettingsConfig>(DEFAULT_DEV_SETTINGS);
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    devSettingsStore.getSettings().then(setSettings);
  }, []);

  // Check Ollama connection status
  const checkOllamaStatus = useCallback(async () => {
    setOllamaStatus('checking');
    try {
      const response = await fetch(`${settings.localLLMBaseUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        const data = await response.json();
        const models = data.models?.map((m: { name: string }) => m.name) || [];
        setAvailableModels(models);
        setOllamaStatus('online');
      } else {
        setOllamaStatus('offline');
      }
    } catch {
      setOllamaStatus('offline');
      setAvailableModels([]);
    }
  }, [settings.localLLMBaseUrl]);

  useEffect(() => {
    if (settings.localLLMBaseUrl) {
      checkOllamaStatus();
    }
  }, [settings.localLLMBaseUrl, checkOllamaStatus]);

  const updateSetting = async <K extends keyof DevSettingsConfig>(key: K, value: DevSettingsConfig[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    await devSettingsStore.updateSettings({ [key]: value } as Partial<DevSettingsConfig>);
    const latestSettings = await devSettingsStore.getSettings();
    setSettings(latestSettings);
  };

  const statusColor = {
    checking: 'text-yellow-500',
    online: 'text-green-500',
    offline: 'text-red-500',
  };

  const statusIcon = {
    checking: '🔄',
    online: '🟢',
    offline: '🔴',
  };

  return (
    <section className="space-y-6">
      {/* Warning Banner */}
      <div className={`rounded-lg border-2 border-orange-500 bg-orange-500/10 p-4`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-bold text-orange-500">ADMIN ONLY - Dev Tools</h3>
            <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
              These settings are only for <strong>{ADMIN_EMAIL}</strong>. Changes here affect LLM routing for
              development/testing.
            </p>
          </div>
        </div>
      </div>

      {/* Main Dev Settings Card */}
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-white'} p-6 text-left shadow-sm`}>
        <h2 className={`mb-4 text-left text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          🔧 Local LLM Settings (Ollama)
        </h2>

        <div className="space-y-6">
          {/* Master Switch */}
          <div
            className={`rounded-lg border-2 ${settings.useLocalLLM ? 'border-green-500 bg-green-500/10' : 'border-gray-500/30'} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  🚀 Use Local Ollama
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Route LLM requests to your local Ollama instance instead of cloud APIs
                </p>
              </div>
              <div className="relative inline-flex cursor-pointer items-center">
                <input
                  id="useLocalLLM"
                  type="checkbox"
                  checked={settings.useLocalLLM}
                  onChange={e => updateSetting('useLocalLLM', e.target.checked)}
                  className="peer sr-only"
                />
                <label
                  htmlFor="useLocalLLM"
                  className={`peer h-8 w-16 rounded-full ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} after:absolute after:left-[4px] after:top-[4px] after:size-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-8 peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300`}>
                  <span className="sr-only">Use Local Ollama</span>
                </label>
              </div>
            </div>
          </div>

          {/* Ollama Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ollama Status
              </h3>
              <p className={`text-sm ${statusColor[ollamaStatus]}`}>
                {statusIcon[ollamaStatus]}{' '}
                {ollamaStatus === 'checking'
                  ? 'Checking...'
                  : ollamaStatus === 'online'
                    ? `Online (${availableModels.length} models)`
                    : 'Offline - Start Ollama'}
              </p>
            </div>
            <button
              onClick={checkOllamaStatus}
              className={`rounded-md px-3 py-1.5 text-sm ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              Refresh
            </button>
          </div>

          {/* Base URL */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ollama URL</h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Default: http://localhost:11434
              </p>
            </div>
            <input
              type="text"
              value={settings.localLLMBaseUrl}
              onChange={e => updateSetting('localLLMBaseUrl', e.target.value)}
              placeholder="http://localhost:11434"
              className={`w-64 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2 text-sm`}
            />
          </div>

          {/* Model Selection */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Local Model</h3>
              <p className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Select or type a model name
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <select
                value={settings.localLLMModel}
                onChange={e => updateSetting('localLLMModel', e.target.value)}
                className={`w-64 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2 text-sm`}>
                <optgroup label="Recommended Models">
                  {LOCAL_LLM_MODELS.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </optgroup>
                {availableModels.length > 0 && (
                  <optgroup label="Installed on Ollama">
                    {availableModels
                      .filter(m => !LOCAL_LLM_MODELS.some(lm => lm.id === m))
                      .map(model => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
              <input
                type="text"
                value={settings.localLLMModel}
                onChange={e => updateSetting('localLLMModel', e.target.value)}
                placeholder="Or type custom model name"
                className={`w-64 rounded-md border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-gray-300 bg-white text-gray-700'} px-3 py-2 text-sm`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-blue-100 bg-white'} p-6 text-left shadow-sm`}>
        <h2 className={`mb-4 text-left text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          ⚡ Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={async () => {
              await updateSetting('localLLMModel', 'qwen2.5-coder:7b');
              await updateSetting('useLocalLLM', true);
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            🚀 Qwen Coder (Fast)
          </button>
          <button
            onClick={async () => {
              await updateSetting('localLLMModel', 'llama3.2-vision:11b');
              await updateSetting('useLocalLLM', true);
            }}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700">
            👁️ Vision Model
          </button>
          <button
            onClick={async () => {
              await updateSetting('useLocalLLM', false);
            }}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700">
            ☁️ Use Cloud APIs
          </button>
        </div>
      </div>

      {/* Current Config Summary */}
      <div
        className={`rounded-lg border ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-gray-200 bg-gray-50'} p-4 font-mono text-xs`}>
        <pre className={isDarkMode ? 'text-green-400' : 'text-green-700'}>
          {`// Current Dev Config
{
  useLocalLLM: ${settings.useLocalLLM},
  localLLMBaseUrl: "${settings.localLLMBaseUrl}",
  localLLMModel: "${settings.localLLMModel}",
  ollamaStatus: "${ollamaStatus}"
}`}
        </pre>
      </div>
    </section>
  );
};
