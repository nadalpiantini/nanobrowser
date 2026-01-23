#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🧪 FREEJACK - Test DEV_LOCAL Setup
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# Purpose: Quick diagnostic test for DEV_LOCAL configuration
# Usage: ./scripts/test-dev-local.sh
#
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

OLLAMA_URL="http://localhost:11434"
PASS=0
FAIL=0
WARN=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🧪 FreeJack DEV_LOCAL Diagnostic${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════
# Test 1: Ollama Installation
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[1/8]${NC} Checking Ollama installation..."
if command -v ollama &> /dev/null; then
  VERSION=$(ollama --version 2>&1 || echo "unknown")
  echo -e "${GREEN}✅ PASS: Ollama installed ($VERSION)${NC}"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL: Ollama not installed${NC}"
  echo "  Fix: brew install ollama"
  ((FAIL++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# Test 2: Ollama Service
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[2/8]${NC} Checking Ollama service..."
if curl -s "$OLLAMA_URL/api/tags" > /dev/null 2>&1; then
  echo -e "${GREEN}✅ PASS: Ollama service running${NC}"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL: Ollama service not responding${NC}"
  echo "  Fix: ollama serve"
  ((FAIL++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# Test 3: Required Models
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[3/8]${NC} Checking required models..."
MODELS_FOUND=0
MODELS_MISSING=0

for model in "qwen2.5-coder:7b" "qwen2.5-coder:14b"; do
  if ollama list 2>/dev/null | grep -q "$model"; then
    echo -e "${GREEN}✅ $model${NC}"
    ((MODELS_FOUND++))
  else
    echo -e "${RED}❌ $model (missing)${NC}"
    ((MODELS_MISSING++))
  fi
done

if [ $MODELS_MISSING -eq 0 ]; then
  echo -e "${GREEN}✅ PASS: All models available${NC}"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL: $MODELS_MISSING model(s) missing${NC}"
  echo "  Fix: ollama pull qwen2.5-coder:7b && ollama pull qwen2.5-coder:14b"
  ((FAIL++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# Test 4: .env.local existence
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[4/8]${NC} Checking .env.local..."
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✅ PASS: .env.local exists${NC}"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL: .env.local not found${NC}"
  echo "  Fix: ./scripts/setup-local-dev.sh"
  ((FAIL++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# Test 5: .env.local configuration
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[5/8]${NC} Validating .env.local configuration..."
CONFIG_OK=true

if [ -f ".env.local" ]; then
  # Check DEV_LOCAL flag
  if grep -q "VITE_FREEJACK_DEV_LOCAL=true" .env.local; then
    echo -e "${GREEN}✅ DEV_LOCAL flag set${NC}"
  else
    echo -e "${RED}❌ DEV_LOCAL flag missing or false${NC}"
    CONFIG_OK=false
  fi

  # Check Ollama URL
  if grep -q "VITE_OLLAMA_LOCAL_BASE_URL" .env.local; then
    echo -e "${GREEN}✅ Ollama URL configured${NC}"
  else
    echo -e "${RED}❌ Ollama URL missing${NC}"
    CONFIG_OK=false
  fi

  # Check models
  if grep -q "VITE_OLLAMA_LOCAL_MODEL_PLANNER" .env.local; then
    echo -e "${GREEN}✅ Models configured${NC}"
  else
    echo -e "${YELLOW}⚠️  Model configs missing${NC}"
    CONFIG_OK=false
  fi

  if [ "$CONFIG_OK" = true ]; then
    echo -e "${GREEN}✅ PASS: Configuration valid${NC}"
    ((PASS++))
  else
    echo -e "${RED}❌ FAIL: Configuration incomplete${NC}"
    ((FAIL++))
  fi
else
  echo -e "${RED}❌ FAIL: .env.local not found${NC}"
  ((FAIL++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# Test 6: .gitignore protection
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[6/8]${NC} Checking .gitignore protection..."
if grep -q ".env.local" .gitignore 2>/dev/null; then
  echo -e "${GREEN}✅ PASS: .env.local in .gitignore${NC}"
  ((PASS++))
else
  echo -e "${YELLOW}⚠️  WARNING: .env.local not in .gitignore${NC}"
  echo "  Risk: Could accidentally commit secrets"
  ((WARN++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# Test 7: Router files exist
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[7/8]${NC} Checking router files..."
FILES_OK=true

check_file() {
  local file=$1
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ $file${NC}"
  else
    echo -e "${RED}❌ $file (missing)${NC}"
    FILES_OK=false
  fi
}

check_file "chrome-extension/src/background/agent/llmRouter.ts"
check_file "chrome-extension/src/background/agent/devGuards.ts"
check_file "chrome-extension/src/background/agent/examples/devLocalUsage.ts"

if [ "$FILES_OK" = true ]; then
  echo -e "${GREEN}✅ PASS: All router files present${NC}"
  ((PASS++))
else
  echo -e "${RED}❌ FAIL: Some router files missing${NC}"
  ((FAIL++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# Test 8: Test Ollama inference
# ═══════════════════════════════════════════════════════════════════
echo -e "${CYAN}[8/8]${NC} Testing Ollama inference..."
if command -v ollama &> /dev/null && curl -s "$OLLAMA_URL/api/tags" > /dev/null; then
  echo -n "Running quick inference test... "

  RESPONSE=$(curl -s -X POST "$OLLAMA_URL/api/generate" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "qwen2.5-coder:7b",
      "prompt": "Say hello",
      "stream": false
    }' 2>/dev/null || echo "")

  if echo "$RESPONSE" | grep -q "response"; then
    echo -e "${GREEN}✅ PASS: Inference working${NC}"
    ((PASS++))
  else
    echo -e "${YELLOW}⚠️  WARNING: Inference test failed${NC}"
    echo "  Model may need to load (try again)"
    ((WARN++))
  fi
else
  echo -e "${YELLOW}⚠️  WARNING: Skipping inference test${NC}"
  ((WARN++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# Summary
# ═══════════════════════════════════════════════════════════════════
TOTAL=$((PASS + FAIL + WARN))

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}✅ Passed: $PASS${NC}"
echo -e "${RED}❌ Failed: $FAIL${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARN${NC}"
echo ""

if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}🎉 DEV_LOCAL Setup is PERFECT!${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "✨ You're ready to develop with local models"
  echo ""
  echo "Next steps:"
  echo "  1. Start dev: pnpm dev"
  echo "  2. Look for: 🏠 [DEV_LOCAL] logs"
  echo "  3. Check routing: console logs in extension"
  echo ""
  exit 0
elif [ $FAIL -eq 0 ]; then
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}⚠️  Setup OK with warnings${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "You can proceed but consider fixing warnings"
  exit 0
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}❌ Setup has FAILURES${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "🔧 Quick fixes:"
  echo ""

  if [ $FAIL -gt 0 ]; then
    echo "Run automated setup:"
    echo "  ./scripts/setup-local-dev.sh"
    echo ""
    echo "Or manually:"
    echo "  1. Install Ollama: brew install ollama"
    echo "  2. Start service: ollama serve"
    echo "  3. Pull models: ollama pull qwen2.5-coder:7b"
    echo "  4. Configure: cp .env.example .env.local"
    echo ""
  fi

  exit 1
fi
