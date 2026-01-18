# CrewAI Integration para WebPilot Chrome Extension

## Introducción

Este documento explica cómo integrar la extensión de Chrome WebPilot con CrewAI para pruebas de extremo a extremo. La extensión WebPilot ya tiene una arquitectura de agente muy completa que puede ser utilizada como parte de un crew de CrewAI.

## Arquitectura Actual

La extensión WebPilot ya implementa una arquitectura de agentes con:

1. **Executor**: Coordinador principal que maneja la ejecución de tareas
2. **Navigator Agent**: Agente que realiza acciones específicas en la página web
3. **Planner Agent**: Agente que planifica tareas y metas generales
4. **Browser Context**: Gestiona la interacción con el navegador
5. **Message Manager**: Gestiona la memoria y comunicación entre agentes
6. **Event Manager**: Sistema de eventos para seguimiento y notificaciones

## Integración con CrewAI

Para usar CrewAI con WebPilot, puedes crear agentes que utilicen la extensión como herramienta. A continuación se muestra un ejemplo de cómo podrías hacerlo:

```python
from crewai import Agent, Task, Crew
from langchain.tools import tool
import asyncio
import json

# Definir herramienta para interactuar con la extensión WebPilot
@tool("webpilot_browser_tool")
def webpilot_browser_tool(input_data: str) -> str:
    """
    Herramienta para interactuar con la extensión WebPilot de Chrome.
    
    Args:
        input_data: JSON string con la siguiente estructura:
        {
            "task": "Descripción de la tarea para que el agente realice",
            "tabId": "ID de la pestaña donde realizar la acción (opcional)",
            "taskId": "ID único para la tarea (opcional)"
        }
    
    Returns:
        Resultado de la ejecución de la tarea
    """
    # Aquí iría la lógica para comunicarse con la extensión WebPilot
    # Esto podría implicar usar Puppeteer, Selenium, o una API dedicada
    
    try:
        data = json.loads(input_data)
        task_description = data["task"]
        
        # Simular interacción con la extensión WebPilot
        # En un caso real, aquí se comunicaría con la extensión
        
        return f"Tarea '{task_description}' enviada a WebPilot para ejecución"
    except Exception as e:
        return f"Error al procesar la solicitud: {str(e)}"

# Crear agentes que usan WebPilot como herramienta
researcher_agent = Agent(
    role='Investigador Web',
    goal='Buscar información precisa y relevante en la web usando la extensión WebPilot',
    backstory='Eres un experto en investigación web que sabe cómo usar herramientas avanzadas '
             'de automatización de navegación para encontrar información difícil de obtener.',
    verbose=True,
    tools=[webpilot_browser_tool]
)

analyst_agent = Agent(
    role='Analista de Datos',
    goal='Analizar y resumir la información obtenida por el investigador',
    backstory='Eres un analista de datos experimentado que puede procesar grandes cantidades '
             'de información y extraer conclusiones significativas.',
    verbose=True
)

# Definir tareas
research_task = Task(
    description='Usa WebPilot para navegar a https://example.com y extraer información '
                'sobre productos o servicios destacados. La tarea debe incluir explorar '
                'la página y tomar capturas de pantalla de elementos relevantes.',
    expected_output='Lista de productos o servicios destacados en example.com con capturas de pantalla.',
    agent=researcher_agent
)

analysis_task = Task(
    description='Analiza la información obtenida por el investigador y crea un resumen '
                'estructurado de los principales hallazgos.',
    expected_output='Resumen estructurado con puntos clave de los productos o servicios encontrados.',
    agent=analyst_agent
)

# Crear el crew
web_research_crew = Crew(
    agents=[researcher_agent, analyst_agent],
    tasks=[research_task, analysis_task],
    verbose=2
)

# Ejecutar el crew
if __name__ == "__main__":
    result = web_research_crew.kickoff()
    print(result)
```

## Alternativa: Control Directo de la Extensión

Para una integración más directa, podrías controlar la extensión a través de la API de Chrome Extensions:

```python
import asyncio
import websockets
import json

class WebPilotController:
    def __init__(self):
        self.websocket = None
    
    async def connect_to_extension(self):
        """Conectarse al puerto nativo o WebSocket de la extensión"""
        # Esto dependería de cómo la extensión expone su interfaz
        # Podría ser a través de un contenido de script, extensión de puente, o API dedicada
        pass
    
    async def execute_task(self, task_description, tab_id=None):
        """Ejecutar una tarea específica usando la extensión"""
        message = {
            "type": "new_task",
            "task": task_description,
            "tabId": tab_id or 1,  # ID de pestaña por defecto
            "taskId": f"crewai-{int(time.time())}"
        }
        
        await self.websocket.send(json.dumps(message))
        response = await self.websocket.recv()
        return json.loads(response)

# Uso dentro de una herramienta de CrewAI
@tool("webpilot_direct_control")
def webpilot_direct_control(input_data: str) -> str:
    """
    Control directo de la extensión WebPilot para pruebas E2E.
    """
    controller = WebPilotController()
    # Lógica para controlar directamente la extensión
    # Esta implementación dependerá de cómo exponga la extensión su API
    pass
```

## Beneficios de la Integración

1. **Automatización Completa**: Combina la potencia de CrewAI con las habilidades de navegación de WebPilot
2. **Testing E2E**: Permite pruebas de extremo a extremo complejas simulando usuarios reales
3. **Flujos de Trabajo**: Crea flujos de trabajo que requieren tanto análisis como navegación web
4. **Validación de Agente**: Usa CrewAI para validar que el agente de WebPilot funcione correctamente

## Consideraciones Técnicas

- La extensión WebPilot ya tiene un sistema de mensajes y estado que puede requerir adaptación
- Es importante manejar el ciclo de vida de las tareas y la sincronización entre CrewAI y WebPilot
- Se deben gestionar adecuadamente los tiempos de espera y errores de red
- La seguridad y permisos de la extensión deben considerarse al integrar con sistemas externos

## Próximos Pasos

1. Crear un conector oficial entre CrewAI y WebPilot
2. Implementar pruebas E2E específicas para validar funcionalidades clave
3. Documentar patrones comunes de uso para flujos de trabajo complejos
4. Crear ejemplos específicos de crews que utilicen WebPilot para diferentes propósitos