# Instrucciones para Probar la Extensión WebPilot Chrome

## Prueba Manual en Chrome

### Paso 1: Abrir el Administrador de Extensiones
1. Abre Google Chrome
2. En la barra de direcciones, escribe `chrome://extensions/` y presiona Enter

### Paso 2: Activar el Modo de Desarrollador
1. En la esquina superior derecha de la página, haz clic en el interruptor "Modo de desarrollador"
2. Ahora deberías ver opciones adicionales como "Cargar extensión sin empaquetar", "Empaquetar extensión" y "Actualizar"

### Paso 3: Cargar la Extensión
1. Haz clic en el botón "Cargar extensión sin empaquetar"
2. Navega a la carpeta `/Users/nadalpiantini/Dev/webpilot/dist`
3. Selecciona la carpeta y haz clic en "Seleccionar carpeta"

### Paso 4: Verificar la Instalación
1. La extensión debería aparecer en la lista de extensiones
2. Asegúrate de que no haya errores visibles en la interfaz
3. La extensión debería tener un icono y nombre reconocible

### Paso 5: Probar Funcionalidades Básicas
1. Cierra la página de extensiones y visita cualquier sitio web
2. Haz clic en el ícono de la extensión en la barra de extensiones de Chrome
3. Prueba algunas funcionalidades básicas:
   - El panel lateral debería abrirse
   - Debería poder interactuar con la página objetivo
   - Las funcionalidades de navegación automática deberían estar disponibles

## Prueba de Desarrollo/Detección de Problemas

### Usando la Consola de Desarrollador
1. Con la extensión instalada, abre una nueva pestaña
2. Pulsa `Ctrl+Shift+J` (Windows/Linux) o `Cmd+Option+J` (Mac) para abrir la consola de desarrollador
3. Selecciona la pestaña "Consola"
4. Prueba la extensión y observa si hay mensajes de error

### Accediendo al Background Script
1. En la página `chrome://extensions/`, encuentra la extensión WebPilot
2. Asegúrate de que "Modo de desarrollador" esté activado
3. Haz clic en "Detalles" para la extensión
4. Desplázate hacia abajo hasta "Extension Views"
5. Si ves un enlace a "background page", haz clic para inspeccionarlo

## Prueba de la Integración con CrewAI

Para probar la integración que hemos desarrollado con CrewAI:

### Paso 1: Preparar el Entorno
1. Asegúrate de tener Python 3.8+ instalado
2. Instala las dependencias: `pip install crewai langchain langchain-community`
3. Ten Chrome con la extensión WebPilot instalada y activa

### Paso 2: Ejecutar Pruebas
1. Navega a la carpeta del proyecto: `cd /Users/nadalpiantini/Dev/webpilot/chrome-extension`
2. Ejecuta el script de pruebas: `./run-e2e-tests.sh`
3. Sigue las instrucciones del menú para ejecutar el tipo de prueba deseado

## Posibles Problemas y Soluciones

### Problema: "Failed to load extension"
- Verifica que la carpeta `/Users/nadalpiantini/Dev/webpilot/dist` contiene el archivo `manifest.json`
- Asegúrate de que no hay caracteres especiales en las rutas

### Problema: "Missing permissions"
- El manifest ha sido generado durante la construcción y debería contener los permisos necesarios
- Verifica el contenido del archivo `manifest.json` en la carpeta dist

### Problema: La extensión no responde
- Abre la consola de desarrollador y revisa los mensajes de error
- Asegúrate de que no hay otras extensiones que interfieran con WebPilot

## Verificación Final

Una vez instalada y activa la extensión:

1. ✅ Icono visible en la barra de extensiones
2. ✅ Panel lateral se abre correctamente
3. ✅ Puedes interactuar con páginas web
4. ✅ Funcionalidades de navegación automática disponibles
5. ✅ No hay errores visibles en la consola de desarrollador

¡Tu extensión está lista para usar y la integración con CrewAI ha sido implementada!