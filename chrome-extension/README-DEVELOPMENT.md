# WebPilot Chrome Extension - Modo Desarrollo & Debug

## Introducción

Este documento explica cómo iniciar y usar el modo de desarrollo y debug para la extensión de Chrome WebPilot. Aunque no hay un "Ralph mode" específico en el código, esta guía te ayudará a configurar y usar las capacidades de desarrollo y debug integradas en el proyecto.

## Modo Desarrollo

El proyecto está configurado para usar Node.js, Vite y TypeScript con soporte para desarrollo y producción.

### Configuración de Variables de Entorno

- `__DEV__`: Habilita el modo desarrollo cuando se establece a `true`
- `DEBUG`: Habilita logs detallados cuando se establece a `true`

### Scripts Disponibles

- `npm run dev`: Construye la extensión en modo desarrollo con recarga en caliente
- `npm run build`: Construye la extensión para producción
- `npm run test`: Ejecuta las pruebas unitarias
- `npm run lint`: Verifica el estilo de código
- `npm run type-check`: Verifica los tipos TypeScript

### Características del Modo Desarrollo

1. **Logs Detallados**: En modo desarrollo, todas las funciones de logging mostradas con `logger.debug()` estarán activas
2. **Recarga en Caliente**: La configuración de Vite incluye soporte para reconstrucción automática durante el desarrollo
3. **Información Adicional**: Se incluyen métricas de rendimiento y detalles adicionales
4. **Sourcemaps**: Se generan sourcemaps para facilitar la depuración

## Cómo Iniciar en Modo Desarrollo

1. Desde la raíz del proyecto, ejecuta:
   ```bash
   npm run dev
   ```

2. Esto creará una compilación de desarrollo con soporte para recarga en caliente

3. Para cargar la extensión en Chrome:
   - Abre `chrome://extensions/`
   - Activa "Modo de desarrollador"
   - Haz clic en "Cargar extensión sin empaquetar"
   - Selecciona la carpeta donde se generó la compilación (usualmente `dist`)

## Debugging

La extensión incluye un sistema de logging robusto:

- `logger.debug()`: Mensajes solo visibles en modo desarrollo
- `logger.info()`: Información general
- `logger.warning()`: Advertencias
- `logger.error()`: Errores

## Archivos Importantes

- `src/background/index.ts`: Punto de entrada principal del background script
- `src/background/log.ts`: Sistema de logging
- `vite.config.mts`: Configuración de construcción con soporte para desarrollo/producción
- `manifest.js`: Definición del manifiesto de la extensión

## Funcionalidades Disponibles

1. **Navegación Automática**: Utiliza IA para navegar páginas web
2. **Análisis de DOM**: Extrae elementos interactivos del DOM
3. **Acciones Basadas en IA**: Realiza acciones en la página según objetivos dados
4. **Soporte Multimodal**: Puede procesar imágenes y texto
5. **Historial de Tareas**: Mantiene un historial de acciones realizadas

## Proveedor de IA Predeterminado

El archivo `src/background/config/defaultProviders.ts` contiene la lógica para inicializar proveedores de IA predeterminados, incluyendo DeepSeek.

## Pruebas

El proyecto incluye pruebas unitarias que pueden ejecutarse con:
```
npm run test
```

## Notas sobre Desarrollo

- El modo desarrollo está activo cuando `import.meta.env.DEV` es `true`
- Las funciones de logging `debug` solo operan en modo desarrollo
- Se registran métricas detalladas en modo desarrollo para facilitar la depuración
- Se puede habilitar el modo debug en el DOM builder pasando `debugMode: true`