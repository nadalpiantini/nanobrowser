import { llmProviderStore, getDefaultProviderConfig, ProviderTypeEnum } from '@extension/storage';

// Función para inicializar DeepSeek como proveedor predeterminado
export async function initializeDefaultProviders() {
  try {
    // Verificar si ya existe un proveedor de DeepSeek
    const hasDeepSeek = await llmProviderStore.hasProvider(ProviderTypeEnum.DeepSeek);

    if (!hasDeepSeek) {
      // Crear la configuración predeterminada para DeepSeek
      const deepSeekConfig = {
        ...getDefaultProviderConfig(ProviderTypeEnum.DeepSeek),
        apiKey: process.env.DEEPSEEK_API_KEY || '', // User must configure their own API key
        modelNames: ['deepseek-chat', 'deepseek-reasoner'], // modelos recomendados para DeepSeek
      };

      // Guardar la configuración del proveedor DeepSeek
      await llmProviderStore.setProvider(ProviderTypeEnum.DeepSeek, deepSeekConfig);
      console.log('Proveedor DeepSeek configurado como predeterminado');
    } else {
      console.log('Proveedor DeepSeek ya estaba configurado');
    }
  } catch (error) {
    console.error('Error al inicializar los proveedores predeterminados:', error);
  }
}
