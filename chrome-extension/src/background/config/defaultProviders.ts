import { llmProviderStore, getDefaultProviderConfig, ProviderTypeEnum } from '@extension/storage';

// Initialize DeepSeek as default provider (if not already configured)
export async function initializeDefaultProviders() {
  try {
    const hasDeepSeek = await llmProviderStore.hasProvider(ProviderTypeEnum.DeepSeek);

    if (!hasDeepSeek) {
      const deepSeekConfig = {
        ...getDefaultProviderConfig(ProviderTypeEnum.DeepSeek),
        apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '', // User must configure their own API key
        modelNames: ['deepseek-chat', 'deepseek-reasoner'],
      };

      await llmProviderStore.setProvider(ProviderTypeEnum.DeepSeek, deepSeekConfig);
    }
  } catch (error) {
    // Silent fail - user will configure provider manually if needed
  }
}
