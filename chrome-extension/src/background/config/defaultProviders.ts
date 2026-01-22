import { llmProviderStore, getDefaultProviderConfig, ProviderTypeEnum } from './llmProviders';

// Función para inicializar DeepSeek como proveedor predeterminado
export async function initializeDefaultProviders() {
  try {
    // Verificar si ya existe un proveedor de DeepSeek
    const hasDeepSeek = await llmProviderStore.hasProvider(ProviderTypeEnum.DeepSeek);

    if (!hasDeepSeek) {
      // Crear la configuración predeterminada para DeepSeek
      const deepSeekConfig = {
        ...getDefaultProviderConfig(ProviderTypeEnum.DeepSeek),
        apiKey: process.env.DEEPSEEK_API_KEY || 'sk-4cefb8d8d21c4670876787dc0f6e8dcb',
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
