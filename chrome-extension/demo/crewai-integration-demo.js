const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script de ejemplo para integrar CrewAI con Freejack Chrome Extension
 * Este script demuestra cómo se podría configurar una integración para pruebas E2E
 */

class CrewAIFreejackDemo {
  constructor() {
    this.extensionPath = path.join(__dirname, '..');
    this.demoDir = path.join(__dirname, 'demo');
    this.setupDemoEnvironment();
  }

  setupDemoEnvironment() {
    // Crear directorio de demo si no existe
    if (!fs.existsSync(this.demoDir)) {
      fs.mkdirSync(this.demoDir, { recursive: true });
    }
  }

  /**
   * Instala dependencias necesarias para la integración con CrewAI
   */
  async installDependencies() {
    console.log('📦 Instalando dependencias para la integración con CrewAI...');

    // Verificar si Python está instalado
    try {
      const pythonCheck = await this.executeCommand('python3 --version');
      console.log('✅ Python encontrado:', pythonCheck.stdout.trim());
    } catch (error) {
      console.log('❌ Python3 no encontrado. Por favor instale Python 3.x');
      return false;
    }

    // Verificar si pip está disponible
    try {
      const pipCheck = await this.executeCommand('pip --version');
      console.log('✅ Pip encontrado:', pipCheck.stdout.trim());
    } catch (error) {
      try {
        const pip3Check = await this.executeCommand('pip3 --version');
        console.log('✅ Pip3 encontrado:', pip3Check.stdout.trim());
      } catch (pipError) {
        console.log('❌ Ni pip ni pip3 encontrados. Por favor instale pip.');
        return false;
      }
    }

    console.log('📝 Instalando CrewAI y dependencias...');
    const installCmd = 'pip3 install crewai langchain langchain-community selenium playwright';

    try {
      const result = await this.executeCommand(installCmd);
      console.log('✅ Dependencias instaladas correctamente');
      return true;
    } catch (error) {
      console.log('❌ Error instalando dependencias:', error.message);
      return false;
    }
  }

  /**
   * Crea un archivo de ejemplo de integración con CrewAI
   */
  createCrewAIExample() {
    const examplePath = path.join(this.demoDir, 'freejack_crew_example.py');

    const exampleCode = `"""
Ejemplo de integración entre CrewAI y Freejack Chrome Extension
Este script demuestra cómo usar Freejack como herramienta dentro de un crew de CrewAI
"""

from crewai import Agent, Task, Crew
from langchain.tools import tool
import asyncio
import json
import time
from typing import Dict, Any, Optional

# Simulación de la clase FreejackController
class FreejackController:
    """
    Controlador simulado para interactuar con Freejack Chrome Extension
    En una implementación real, esto se conectaría con la extensión
    """
    
    def __init__(self):
        self.current_tab_id = 1
        self.task_counter = 0
    
    async def execute_task(self, task_description: str, tab_id: Optional[int] = None) -> Dict[str, Any]:
        """
        Ejecuta una tarea usando Freejack
        """
        self.task_counter += 1
        task_id = f"wp-task-{self.task_counter}-{int(time.time())}"
        target_tab_id = tab_id or self.current_tab_id
        
        # Simular la interacción con Freejack
        print(f"[Freejack] Ejecutando tarea: {task_description}")
        print(f"[Freejack] Tab ID: {target_tab_id}, Task ID: {task_id}")
        
        # Simular la ejecución real con la extensión
        await asyncio.sleep(2)  # Simula tiempo de procesamiento
        
        # Resultado simulado
        mock_result = {
            "taskId": task_id,
            "tabId": target_tab_id,
            "task": task_description,
            "status": "completed",
            "results": [
                {
                    "action": "navigate_to_url",
                    "url": "https://example.com",
                    "status": "success",
                    "screenshot": "screenshot_123.png"
                },
                {
                    "action": "find_elements",
                    "selector": "[role='link'], button, input, textarea",
                    "count": 5,
                    "status": "success"
                }
            ],
            "summary": "Se completó la navegación y exploración de la página.",
            "timestamp": time.time()
        }
        
        return mock_result

# Crear instancia global del controlador
freejack_controller = FreejackController()

@tool("freejack_browser_tool")
def freejack_browser_tool(input_data: str) -> str:
    """
    Herramienta para interactuar con la extensión Freejack de Chrome.
    
    Args:
        input_data: JSON string con la siguiente estructura:
        {
            "task": "Descripción de la tarea para que el agente realice",
            "tabId": "ID de la pestaña donde realizar la acción (opcional)",
            "url": "URL objetivo (opcional)"
        }
    
    Returns:
        Resultado de la ejecución de la tarea en formato JSON
    """
    try:
        # Parsear la entrada
        data = json.loads(input_data)
        task_description = data.get("task", "")
        tab_id = data.get("tabId")
        url = data.get("url")
        
        # Actualizar la descripción de tarea si se incluye URL
        if url and task_description:
            task_description = f"Ir a {url} y luego {task_description}"
        elif url:
            task_description = f"Navegar a {url}"
        
        if not task_description:
            return json.dumps({
                "error": "Falta la descripción de la tarea en el input_data"
            })
        
        # Ejecutar tarea con el controlador de Freejack
        import asyncio
        
        async def run_task():
            return await freejack_controller.execute_task(task_description, tab_id)
        
        # Ejecutar en event loop
        result = asyncio.run(run_task())
        return json.dumps(result, indent=2, ensure_ascii=False)
        
    except json.JSONDecodeError:
        return json.dumps({
            "error": "input_data no es un JSON válido"
        })
    except Exception as e:
        return json.dumps({
            "error": f"Error al ejecutar la tarea: {str(e)}"
        })

# Definir agentes
web_researcher = Agent(
    role='Investigador Web',
    goal='Utilizar Freejack para navegar sitios web y extraer información específica',
    backstory='Eres un experto en investigación web con acceso a una poderosa herramienta '
              'que puede automatizar la navegación en sitios web. Sabes cómo formular tareas '
              'claras y específicas para que la herramienta pueda ejecutarlas de manera eficiente.',
    verbose=True,
    tools=[freejack_browser_tool]
)

data_analyst = Agent(
    role='Analista de Datos',
    goal='Analizar información extraída de sitios web y generar insights valiosos',
    backstory='Eres un analista experto capaz de procesar información compleja y '
              'extraer conclusiones significativas basadas en datos estructurados y no estructurados.',
    verbose=True
)

insights_generator = Agent(
    role='Generador de Insights',
    goal='Crear informes precisos y útiles basados en el análisis de datos',
    backstory='Eres un experto en síntesis de información que puede transformar '
              'datos técnicos en recomendaciones accionables y comprensibles.',
    verbose=True
)

# Definir tareas
research_task = Task(
    description='''
    Usar Freejack para visitar https://scrapethissite.com y extraer información 
    sobre las páginas de ejemplo disponibles. Buscar enlaces a páginas que contengan 
    información sobre animales, películas o páginas de ejemplo.
    ''',
    expected_output='Lista de URLs de páginas de ejemplo con descripciones breves.',
    agent=web_researcher
)

analysis_task = Task(
    description='''
    Analizar la información obtenida por el investigador web. Identificar patrones,
    categorizar la información encontrada y señalar posibles áreas de interés
    para investigaciones futuras.
    ''',
    expected_output='Informe de análisis con categorización de páginas, '
                   'patrones identificados y recomendaciones para búsquedas futuras.',
    agent=data_analyst
)

report_task = Task(
    description='''
    Generar un informe final sintetizado basado en el análisis del data analyst.
    El informe debe incluir las páginas más relevantes encontradas, un resumen de 
    los patrones identificados y recomendaciones accionables.
    ''',
    expected_output='Informe final estructurado con: 1) Resumen ejecutivo, '
                   '2) Páginas más relevantes encontradas, 3) Patrones identificados, '
                   '4) Recomendaciones accionables.',
    agent=insights_generator
)

# Crear y ejecutar el crew
def run_demo():
    print("🚀 Iniciando demo de CrewAI con Freejack...")
    
    web_research_crew = Crew(
        agents=[web_researcher, data_analyst, insights_generator],
        tasks=[research_task, analysis_task, report_task],
        verbose=2
    )
    
    result = web_research_crew.kickoff()
    return result

if __name__ == "__main__":
    final_result = run_demo()
    print("\\n" + "="*50)
    print("RESULTADO FINAL DEL CREW:")
    print("="*50)
    print(final_result)
`;

    fs.writeFileSync(examplePath, exampleCode);
    console.log('✅ Archivo de ejemplo de CrewAI creado:', examplePath);
    return examplePath;
  }

  /**
   * Ejecuta un comando en el sistema
   */
  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: this.extensionPath }, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  }

  /**
   * Ejecuta la demostración
   */
  async runDemo() {
    console.log('🧪 Iniciando demo de integración CrewAI - Freejack');

    // Intentar instalar dependencias
    const depsInstalled = await this.installDependencies();
    if (!depsInstalled) {
      console.log('⚠️  No se pudieron instalar todas las dependencias. Continuando con lo disponible...');
    }

    // Crear ejemplo de integración
    const examplePath = this.createCrewAIExample();

    console.log('\\n🎉 Demostración lista!');
    console.log('📁 Archivos creados:');
    console.log('   -', examplePath);
    console.log('');
    console.log('📖 Para probar la integración, revise el archivo generado y adapte');
    console.log('   según sus necesidades específicas de prueba E2E.');

    // Mostrar instrucciones
    console.log('\\n📋 Instrucciones:');
    console.log('   1. Revise el archivo de ejemplo generado');
    console.log('   2. Adapte las conexiones con Freejack según su implementación real');
    console.log('   3. Ejecute con: python3', examplePath);
    console.log('   4. Observe cómo CrewAI coordina tareas con Freejack como herramienta');

    return {
      success: true,
      exampleFile: examplePath,
    };
  }
}

// Si se ejecuta directamente este script
if (require.main === module) {
  const demo = new CrewAIFreejackDemo();
  demo.runDemo().catch(console.error);
}

module.exports = CrewAIFreejackDemo;
