# Pruebas E2E con CrewAI y Freejack Chrome Extension

## Descripción

Este conjunto de archivos demuestra cómo integrar CrewAI con la extensión Freejack Chrome Extension para realizar pruebas de extremo a extremo (E2E). La arquitectura de agentes de Freejack es compatible con el framework de CrewAI, permitiendo crear crews que coordinen tareas complejas de navegación web.

## Componentes

### 1. Integración con CrewAI
- **freejack_crew_example.py**: Ejemplo básico de cómo usar Freejack como herramienta en CrewAI
- **e2e_test_scenarios.py**: Escenarios de prueba E2E específicos para validar funcionalidades

### 2. Herramientas Simuladas
- **freejack_browser_tool**: Simula la interacción con la extensión Freejack
- **freejack_e2e_test_tool**: Herramienta específica para pruebas E2E

## Configuración

### Requisitos
- Python 3.8+
- pip
- Node.js (para scripts auxiliares)

### Instalación

1. Instala las dependencias necesarias:

```bash
pip install crewai langchain langchain-community
```

2. Opcionalmente, instala herramientas adicionales para pruebas reales:

```bash
pip install selenium playwright
```

## Ejemplo de Ejecución

### Ejemplo Simple

Ejecuta el ejemplo básico de CrewAI con Freejack:

```bash
cd demo
python freejack_crew_example.py
```

### Pruebas E2E

Ejecuta las pruebas de extremo a extremo:

```bash
cd demo  
python e2e_test_scenarios.py
```

## Arquitectura de Pruebas

El sistema de pruebas sigue esta estructura:

```
CrewAI (Coordinador)
├── Diseñador de Pruebas
│   └── Diseña escenarios de prueba
├── Ejecutor de Pruebas  
│   └── Ejecuta pruebas usando Freejack
└── Analista de Calidad
    └── Analiza resultados y proporciona insights
```

## Escenarios de Prueba

La suite de pruebas incluye:

1. **Navegación Básica**: Visita sitios web y realiza búsquedas
2. **Interacción con Formularios**: Completa y manipula formularios web
3. **Captura de Pantalla**: Toma capturas de estados específicos
4. **Flujos de Trabajo Complejos**: Ejecuta múltiples pasos en secuencia

## Personalización

Para adaptar las pruebas a tus necesidades específicas:

1. Modifica los objetos `Agent` en los archivos Python para ajustar roles y responsabilidades
2. Cambia las descripciones de `Task` para definir nuevas pruebas
3. Adapta los métodos en `MockFreejackEnvironment` para simular tu entorno real
4. Extiende `FreejackTestScenarios` para agregar nuevos tipos de pruebas

## Consideraciones para Producción

Cuando se integre con la extensión Freejack real:

1. **Conexión con la extensión**: Reemplaza la lógica simulada con conexiones reales a la API de la extensión
2. **Gestión de sesiones**: Implementa manejo adecuado de sesiones de navegador
3. **Manejo de errores**: Asegúrate de tener estrategias robustas para diferentes tipos de errores
4. **Seguridad**: Considera las implicaciones de seguridad al permitir que CrewAI controle la navegación

## Contribuciones

Las contribuciones para mejorar esta integración son bienvenidas. Puedes:

- Agregar nuevos escenarios de prueba
- Mejorar la simulación del entorno Freejack
- Crear conectores reales con la extensión
- Documentar mejores prácticas para pruebas con CrewAI