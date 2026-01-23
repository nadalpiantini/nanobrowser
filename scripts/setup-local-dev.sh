#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🚀 FREEJACK - Local Development Setup (One-Liner)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# Purpose: Setup complete local Ollama stack for FreeJack development
# Usage: ./scripts/setup-local-dev.sh
#
# What it does:
# 1. Installs Ollama (if needed)
# 2. Starts Ollama service
# 3. Pulls required models (qwen2.5-coder 7b & 14b)
# 4. Creates .env.local with correct config
# 5. Validates setup
# 6. Starts FreeJack in dev mode
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

# ═══════════════════════════════════════════════════════════════════
# 🎨 Colors
# ═══════════════════════════════════════════════════════════════════
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════════════
# 📊 Configuration
# ═══════════════════════════════════════════════════════════════════
OLLAMA_URL="http://localhost:11434"
MODEL_7B="qwen2.5-coder:7b"
MODEL_14B="qwen2.5-coder:14b"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}🚀 FREEJACK Local Dev Setup${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ STEP 1: Check/Install Ollama
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[1/6]${NC} Checking Ollama installation..."

if command -v ollama &> /dev/null; then
  echo -e "${GREEN}✅ Ollama already installed: $(ollama --version)${NC}"
else
  echo -e "${YELLOW}⚠️  Ollama not found. Installing...${NC}"

  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    if command -v brew &> /dev/null; then
      brew install ollama
    else
      echo -e "${RED}❌ Homebrew not found. Install from: https://ollama.ai${NC}"
      exit 1
    fi
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    curl -fsSL https://ollama.ai/install.sh | sh
  else
    echo -e "${RED}❌ Unsupported OS: $OSTYPE${NC}"
    echo "Install manually from: https://ollama.ai"
    exit 1
  fi

  echo -e "${GREEN}✅ Ollama installed successfully${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ STEP 2: Start Ollama Service
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[2/6]${NC} Starting Ollama service..."

# Check if already running
if curl -s "$OLLAMA_URL/api/tags" &> /dev/null; then
  echo -e "${GREEN}✅ Ollama service already running${NC}"
else
  echo -e "${YELLOW}Starting Ollama in background...${NC}"

  # Start in background
  nohup ollama serve > /tmp/ollama.log 2>&1 &

  # Wait for service to be ready
  echo -n "Waiting for Ollama to start"
  for i in {1..30}; do
    if curl -s "$OLLAMA_URL/api/tags" &> /dev/null; then
      echo ""
      echo -e "${GREEN}✅ Ollama service started${NC}"
      break
    fi
    echo -n "."
    sleep 1
  done

  if ! curl -s "$OLLAMA_URL/api/tags" &> /dev/null; then
    echo ""
    echo -e "${RED}❌ Failed to start Ollama service${NC}"
    echo "Check logs: tail -f /tmp/ollama.log"
    exit 1
  fi
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ STEP 3: Pull Required Models
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[3/6]${NC} Checking/Pulling required models..."

pull_model() {
  local model=$1
  echo -n "Checking $model... "

  if ollama list | grep -q "$model"; then
    echo -e "${GREEN}✅ Already available${NC}"
  else
    echo -e "${YELLOW}Pulling (this may take a few minutes)...${NC}"
    ollama pull "$model"
    echo -e "${GREEN}✅ $model pulled successfully${NC}"
  fi
}

pull_model "$MODEL_7B"
pull_model "$MODEL_14B"
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ STEP 4: Create .env.local
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[4/6]${NC} Configuring .env.local..."

ENV_LOCAL="$PROJECT_ROOT/.env.local"

if [ -f "$ENV_LOCAL" ]; then
  echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
  read -p "Overwrite? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Skipping .env.local creation${NC}"
  else
    cat > "$ENV_LOCAL" <<EOF
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔒 FREEJACK DEV LOCAL MODE (AUTO-GENERATED)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Generated: $(date)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VITE_FREEJACK_DEV_LOCAL=true
VITE_OLLAMA_LOCAL_BASE_URL=$OLLAMA_URL
VITE_OLLAMA_LOCAL_ADAPTER=fj-dev-local
VITE_OLLAMA_LOCAL_MODEL_PLANNER=$MODEL_7B
VITE_OLLAMA_LOCAL_MODEL_NAVIGATOR=$MODEL_14B
VITE_OLLAMA_LOCAL_MODEL_VALIDATOR=$MODEL_7B
VITE_DEV_LOCAL_ALLOWED_OPS=planning,parsing,dry-run,debugging,prompt-shaping

# Optional: PostHog Analytics (leave empty for dev)
# VITE_POSTHOG_API_KEY=
EOF
    echo -e "${GREEN}✅ .env.local created${NC}"
  fi
else
  cat > "$ENV_LOCAL" <<EOF
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔒 FREEJACK DEV LOCAL MODE (AUTO-GENERATED)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Generated: $(date)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VITE_FREEJACK_DEV_LOCAL=true
VITE_OLLAMA_LOCAL_BASE_URL=$OLLAMA_URL
VITE_OLLAMA_LOCAL_ADAPTER=fj-dev-local
VITE_OLLAMA_LOCAL_MODEL_PLANNER=$MODEL_7B
VITE_OLLAMA_LOCAL_MODEL_NAVIGATOR=$MODEL_14B
VITE_OLLAMA_LOCAL_MODEL_VALIDATOR=$MODEL_7B
VITE_DEV_LOCAL_ALLOWED_OPS=planning,parsing,dry-run,debugging,prompt-shaping

# Optional: PostHog Analytics (leave empty for dev)
# VITE_POSTHOG_API_KEY=
EOF
  echo -e "${GREEN}✅ .env.local created${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ STEP 5: Validate Setup
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[5/6]${NC} Validating setup..."

# Check Ollama connection
if curl -s "$OLLAMA_URL/api/tags" > /dev/null; then
  echo -e "${GREEN}✅ Ollama API responsive${NC}"
else
  echo -e "${RED}❌ Ollama API not responding${NC}"
  exit 1
fi

# Check models
MODELS_OK=true
for model in "$MODEL_7B" "$MODEL_14B"; do
  if ollama list | grep -q "$model"; then
    echo -e "${GREEN}✅ Model $model available${NC}"
  else
    echo -e "${RED}❌ Model $model missing${NC}"
    MODELS_OK=false
  fi
done

if [ "$MODELS_OK" = false ]; then
  echo -e "${RED}Some models are missing. Re-run this script.${NC}"
  exit 1
fi

# Check .env.local
if [ -f "$ENV_LOCAL" ] && grep -q "VITE_FREEJACK_DEV_LOCAL=true" "$ENV_LOCAL"; then
  echo -e "${GREEN}✅ .env.local configured correctly${NC}"
else
  echo -e "${RED}❌ .env.local missing or incorrect${NC}"
  exit 1
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ STEP 6: Final Instructions
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[6/6]${NC} Setup Complete!"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Local Development Environment Ready${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📊 Configuration:${NC}"
echo "  • Ollama URL: $OLLAMA_URL"
echo "  • Planner Model: $MODEL_7B"
echo "  • Navigator Model: $MODEL_14B"
echo "  • Config File: .env.local"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "  1. Start development:"
echo -e "     ${CYAN}pnpm dev${NC}"
echo ""
echo "  2. Watch logs for routing decisions:"
echo -e "     ${CYAN}# Look for: 🏠 [DEV_LOCAL] or 🌩️ [CLOUD]${NC}"
echo ""
echo "  3. Test Ollama connection:"
echo -e "     ${CYAN}curl $OLLAMA_URL/api/tags${NC}"
echo ""
echo -e "${YELLOW}⚠️  Remember:${NC}"
echo "  • DEV_LOCAL only for: planning, parsing, dry-runs, debugging"
echo "  • Final scraping & user output: ALWAYS cloud"
echo "  • Never commit .env.local"
echo "  • Validate before prod: ./scripts/validate-prod-build.sh"
echo ""
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${MAGENTA}Happy coding! 🚀${NC}"
echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
