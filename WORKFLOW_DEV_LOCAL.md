# 🔄 WORKFLOW DEV_LOCAL — De Ahora en Adelante

**Sprint cerrado**: ✅ 2026-01-22
**Commit**: `26e3e33` - feat(agent): add flexible LLM routing infrastructure
**Push**: ✅ origin/master

---

## 📋 LO QUE SE COMMITEÓ (Público/Seguro)

✅ **Infraestructura** (Código):
- `llmRouter.ts` - Router Cloud ↔ Local
- `devGuards.ts` - Guardas de seguridad
- `helper.ts` (modificado) - Soporte routing
- `.gitignore` (actualizado) - Protección archivos privados

✅ **Scripts** (Herramientas):
- `setup-local-dev.sh` - Setup automático
- `test-dev-local.sh` - Diagnóstico
- `validate-prod-build.sh` - Validación prod

---

## 🚫 LO QUE NO SE COMMITEÓ (Privado/Git-Ignored)

❌ **Documentación Privada**:
- `DEV_CONTRACT.md` - Contrato completo
- `DEV_LOCAL_README.md` - Documentación técnica
- `FREEJACK_DEV_LOCAL_SUMMARY.md` - Resumen ejecutivo
- `INICIO_RAPIDO.md` - Quick start
- `WORKFLOW_DEV_LOCAL.md` - Este archivo

❌ **Ejemplos Explícitos**:
- `examples/devLocalUsage.ts` - Ejemplos de código
- `examples/plannerIntegration.example.ts` - Integración

❌ **Config**:
- `.env.local` - Tu configuración local

**Razón**: Estos archivos revelan explícitamente que existe "modo local" y su propósito. La infraestructura commiteada es técnicamente correcta pero NO expone el caso de uso.

---

## 🚀 WORKFLOW DIARIO (De Ahora en Adelante)

### 1️⃣ **CADA DÍA AL EMPEZAR**

```bash
cd ~/freejack

# Verificar Ollama corriendo
curl http://localhost:11434/api/tags

# Si no responde, arrancar:
ollama serve &

# Arrancar dev
pnpm dev
```

**Resultado**:
- 🏠 Planning/Parsing → Local Ollama (gratis)
- 🌩️ Scraping/Output → Cloud API (calidad)

---

### 2️⃣ **DURANTE DESARROLLO**

#### Logs que Verás:
```bash
# En consola extension:
🏠 [DEV_LOCAL] Planning via qwen2.5-coder:7b
  agent: planner
  baseUrl: http://localhost:11434

🌩️ [CLOUD] Scraping via claude-3-haiku
  agent: navigator
  model: claude-3-haiku
```

#### Integrar en Código Nuevo:
```typescript
// Cualquier agente que quieras con routing:
import { createChatModelWithRouting, OperationType } from './helper';

const llm = createChatModelWithRouting(cloudConfig, cloudModel, {
  operation: OperationType.PLANNING,  // 👈 Elige tipo
  agentName: 'mi-agente',
});
```

**Tipos Disponibles**:
- `PLANNING` - ✅ Puede usar local
- `PARSING` - ✅ Puede usar local
- `DRY_RUN` - ✅ Puede usar local
- `DEBUGGING` - ✅ Puede usar local
- `SCRAPING` - ❌ Siempre cloud
- `FINAL_OUTPUT` - ❌ Siempre cloud

---

### 3️⃣ **ANTES DE CADA COMMIT**

```bash
# Verificar qué vas a commitear
git status

# Asegurarte que NO aparezcan archivos privados:
# ❌ DEV_CONTRACT.md
# ❌ DEV_LOCAL_README.md
# ❌ INICIO_RAPIDO.md
# ❌ .env.local
# ❌ **/devLocalUsage.ts
# ❌ **/plannerIntegration.example.ts

# Si aparecen, están mal en .gitignore (avisar)
```

---

### 4️⃣ **ANTES DE CADA DEPLOY/RELEASE**

```bash
# 1. Build producción
NODE_ENV=production pnpm build

# 2. CRÍTICO: Validar build
./scripts/validate-prod-build.sh dist

# Debe mostrar:
# ✅ BUILD IS SAFE FOR PRODUCTION

# Si falla, NO deploys hasta arreglar
```

**Checks que Hace**:
- ❌ No .env.local en dist
- ❌ No `DEV_LOCAL=true` en bundles
- ❌ No URLs localhost hardcoded
- ❌ No adaptadores dev
- ✅ Manifest válido
- ✅ Guards presentes

---

### 5️⃣ **SI CAMBIAS MODELOS**

```bash
# Edita .env.local
nano .env.local

# Cambia:
VITE_OLLAMA_LOCAL_MODEL_PLANNER=llama3.3:70b
VITE_OLLAMA_LOCAL_MODEL_NAVIGATOR=qwen2.5:32b

# Pull nuevo modelo
ollama pull llama3.3:70b

# Restart dev
pnpm dev
```

---

### 6️⃣ **SI HAY PROBLEMAS**

#### Diagnóstico Completo:
```bash
./scripts/test-dev-local.sh
# Te dice exactamente qué falla
```

#### Ollama No Conecta:
```bash
pkill ollama && ollama serve
curl http://localhost:11434/api/tags
```

#### Router No Usa Local:
```bash
# Verificar env
cat .env.local | grep DEV_LOCAL
# Debe: VITE_FREEJACK_DEV_LOCAL=true

# Verificar modo
echo $NODE_ENV
pnpm dev  # NO 'pnpm build'
```

#### Re-Setup Completo:
```bash
./scripts/setup-local-dev.sh
```

---

## 📦 ESTRUCTURA FINAL DEL PROYECTO

```
freejack/
├── 🔒 PRIVADOS (git-ignored, solo tu máquina)
│   ├── .env.local
│   ├── DEV_CONTRACT.md
│   ├── DEV_LOCAL_README.md
│   ├── FREEJACK_DEV_LOCAL_SUMMARY.md
│   ├── INICIO_RAPIDO.md
│   └── WORKFLOW_DEV_LOCAL.md (este archivo)
│
├── ✅ COMMITEADOS (infraestructura técnica)
│   ├── chrome-extension/src/background/agent/
│   │   ├── llmRouter.ts
│   │   ├── devGuards.ts
│   │   └── helper.ts (modificado)
│   │
│   └── scripts/
│       ├── setup-local-dev.sh
│       ├── test-dev-local.sh
│       └── validate-prod-build.sh
│
└── 🚫 NO COMMITEADOS (ejemplos explícitos)
    └── chrome-extension/src/background/agent/examples/
        ├── devLocalUsage.ts
        └── plannerIntegration.example.ts
```

---

## 🎯 REGLAS DE ORO

### ✅ SIEMPRE:
1. Correr `./scripts/validate-prod-build.sh` antes de deploy
2. Verificar logs 🏠 vs 🌩️ durante desarrollo
3. Usar `OperationType.SCRAPING` para outputs de usuario
4. Mantener `.env.local` git-ignored

### ❌ NUNCA:
1. Commitear archivos de `PRIVADOS`
2. Mencionar "DEV_LOCAL" en UI o docs públicas
3. Usar local para `SCRAPING`, `FINAL_OUTPUT`, `USER_RESULTS`
4. Skipear validación antes de production deploy
5. Hardcodear `localhost` URLs
6. Exponer toggle "local mode" a usuarios

---

## 🔄 CICLO DESARROLLO TÍPICO

```
Mañana:
  → ollama serve &
  → pnpm dev
  → Codear con 🏠 local (planning, parsing)

Tarde:
  → Test con 🌩️ cloud (scraping, output)
  → git add/commit (solo infra si cambias algo)
  → git push

Antes Deploy:
  → NODE_ENV=production pnpm build
  → ./scripts/validate-prod-build.sh dist
  → ✅ PASS → Deploy
  → ❌ FAIL → Fix → Re-validar
```

---

## 📊 MÉTRICAS A MONITOREAR

### Durante Desarrollo:
- **API Calls Ahorradas**: Cuenta cuántas operaciones de planning/parsing haces
- **Latencia Local vs Cloud**: Compara tiempos de respuesta
- **Memoria Ollama**: Monitor con `ollama ps`

### Cada Semana:
- **Costo Ahorrado**: Estima cuánto hubieras gastado en cloud
- **Velocidad Iteración**: ¿Más rápido probar prompts?
- **Calidad Final**: ¿Cloud output sigue siendo excelente?

---

## 🆘 CONTACTOS Y RECURSOS

### Si Todo Falla:
```bash
# 1. Re-setup desde cero
./scripts/setup-local-dev.sh

# 2. Si persiste, revisar docs
cat DEV_LOCAL_README.md

# 3. Diagnóstico detallado
./scripts/test-dev-local.sh

# 4. Verificar logs Ollama
tail -f /tmp/ollama.log
```

### Docs de Referencia:
- **Quick Start**: `INICIO_RAPIDO.md`
- **Docs Completas**: `DEV_LOCAL_README.md`
- **Contrato Técnico**: `DEV_CONTRACT.md`
- **Resumen Ejecutivo**: `FREEJACK_DEV_LOCAL_SUMMARY.md`
- **Este Workflow**: `WORKFLOW_DEV_LOCAL.md`

---

## 🎉 ¡LISTO PARA VIBECODING!

**Último commit**: `26e3e33`
**Estado**: ✅ Infraestructura en repo, docs privadas protegidas
**Próximo paso**: `ollama serve && pnpm dev`

---

**Recuerda**:

> FreeJack es **cloud-first** para usuarios.
> DEV_LOCAL es **tu herramienta** para construir más rápido.
> Nadie más lo ve. Nunca.

🚀 **Happy coding!**
