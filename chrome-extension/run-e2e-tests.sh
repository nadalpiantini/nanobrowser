#!/bin/bash

# Script para facilitar la ejecución de pruebas E2E con CrewAI y WebPilot

echo "🚀 Iniciando pruebas E2E con CrewAI y WebPilot..."

# Verificar que Python esté instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 no encontrado. Por favor instale Python3."
    exit 1
fi

# Verificar que pip esté instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 no encontrado. Por favor instale pip."
    exit 1
fi

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "📂 Directorio del proyecto: $PROJECT_DIR"

# Crear entorno virtual si no existe
if [ ! -d "$PROJECT_DIR/venv" ]; then
    echo "🔧 Creando entorno virtual..."
    python3 -m venv "$PROJECT_DIR/venv"
fi

# Activar entorno virtual
source "$PROJECT_DIR/venv/bin/activate"

# Instalar dependencias si no están instaladas
echo "📦 Instalando dependencias..."
pip3 install -r "$PROJECT_DIR/requirements.txt" 2>/dev/null || {
    echo "📝 Creando archivo de dependencias temporal..."
    cat > "$PROJECT_DIR/requirements.txt" << EOF
crewai>=0.28.0
langchain>=0.1.0
langchain-community>=0.0.1
selenium>=4.15.0
playwright>=1.40.0
EOF
    pip3 install -r "$PROJECT_DIR/requirements.txt"
}

echo "✅ Dependencias instaladas"

# Mostrar opciones al usuario
echo ""
echo "🎯 Seleccione una opción:"
echo "1) Ejecutar ejemplo básico de CrewAI con WebPilot"
echo "2) Ejecutar pruebas E2E completas"
echo "3) Ejecutar solo pruebas de navegación básicas"
echo "4) Ejecutar solo pruebas de interacción con formularios"
echo "5) Salir"
echo ""

read -p "Ingrese su elección (1-5): " choice

case $choice in
    1)
        echo "🏃‍♂️ Ejecutando ejemplo básico de CrewAI con WebPilot..."
        cd "$PROJECT_DIR/demo"
        python3 webpilot_crew_example.py
        ;;
    2)
        echo "🏃‍♂️ Ejecutando pruebas E2E completas..."
        cd "$PROJECT_DIR/demo"
        python3 e2e_test_scenarios.py
        ;;
    3)
        echo "🏃‍♂️ Ejecutando pruebas de navegación básicas..."
        cd "$PROJECT_DIR/demo"
        # Ejecutar solo la parte de navegación básica
        python3 -c "
import sys
sys.path.append('.')
from e2e_test_scenarios import WebPilotTestScenarios, MockWebPilotEnvironment
import asyncio

async def run_basic_nav_test():
    env = MockWebPilotEnvironment()
    test_data = WebPilotTestScenarios.basic_navigation_test()
    result = await env.execute_web_task(test_data['task'])
    print('🔍 Resultado de prueba de navegación:')
    print(f'Task: {test_data[\"task\"]}')
    print(f'Result: {result}')

asyncio.run(run_basic_nav_test())
"
        ;;
    4)
        echo "🏃‍♂️ Ejecutando pruebas de interacción con formularios..."
        cd "$PROJECT_DIR/demo"
        # Ejecutar solo la parte de interacción con formularios
        python3 -c "
import sys
sys.path.append('.')
from e2e_test_scenarios import WebPilotTestScenarios, MockWebPilotEnvironment
import asyncio

async def run_form_test():
    env = MockWebPilotEnvironment()
    test_data = WebPilotTestScenarios.form_interaction_test()
    result = await env.execute_web_task(test_data['task'])
    print('🔍 Resultado de prueba de formulario:')
    print(f'Task: {test_data[\"task\"]}')
    print(f'Result: {result}')

asyncio.run(run_form_test())
"
        ;;
    5)
        echo "👋 Saliendo..."
        exit 0
        ;;
    *)
        echo "❌ Opción inválida. Saliendo."
        exit 1
        ;;
esac

echo ""
echo "✅ Ejecución completada."