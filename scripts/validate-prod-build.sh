#!/usr/bin/env bash
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔒 FREEJACK - Production Build Validator
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# Purpose: Validate that NO DEV_LOCAL config exists in production build
# Usage: ./scripts/validate-prod-build.sh [dist-dir]
#
# Exit codes:
#   0 = Safe (no dev config found)
#   1 = Unsafe (dev config detected)
#   2 = Script error
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -euo pipefail

# ═══════════════════════════════════════════════════════════════════
# 🎨 Colors
# ═══════════════════════════════════════════════════════════════════
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ═══════════════════════════════════════════════════════════════════
# 📁 Configuration
# ═══════════════════════════════════════════════════════════════════
DIST_DIR="${1:-dist}"
ISSUES_FOUND=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔒 FREEJACK Production Build Validator${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "📂 Analyzing directory: $DIST_DIR"
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ CHECK 1: .env.local should NOT exist in dist
# ═══════════════════════════════════════════════════════════════════
echo -e "${YELLOW}[1/7]${NC} Checking for .env.local in build..."
if [ -f "$DIST_DIR/.env.local" ]; then
  echo -e "${RED}❌ FAIL: .env.local found in dist${NC}"
  ((ISSUES_FOUND++))
else
  echo -e "${GREEN}✅ PASS: No .env.local in dist${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ CHECK 2: Search for DEV_LOCAL flag in bundled code
# ═══════════════════════════════════════════════════════════════════
echo -e "${YELLOW}[2/7]${NC} Scanning for VITE_FREEJACK_DEV_LOCAL in bundles..."
if grep -r "VITE_FREEJACK_DEV_LOCAL.*true" "$DIST_DIR" 2>/dev/null | grep -v ".map"; then
  echo -e "${RED}❌ FAIL: DEV_LOCAL flag set to 'true' in bundle${NC}"
  ((ISSUES_FOUND++))
else
  echo -e "${GREEN}✅ PASS: No active DEV_LOCAL flag${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ CHECK 3: Search for localhost URLs
# ═══════════════════════════════════════════════════════════════════
echo -e "${YELLOW}[3/7]${NC} Scanning for localhost URLs..."
LOCALHOST_MATCHES=$(grep -r "localhost:11434\|127.0.0.1:11434" "$DIST_DIR" 2>/dev/null | grep -v ".map" || true)
if [ -n "$LOCALHOST_MATCHES" ]; then
  echo -e "${RED}❌ FAIL: Localhost URLs found:${NC}"
  echo "$LOCALHOST_MATCHES"
  ((ISSUES_FOUND++))
else
  echo -e "${GREEN}✅ PASS: No localhost URLs${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ CHECK 4: Search for fj-dev-local adapter
# ═══════════════════════════════════════════════════════════════════
echo -e "${YELLOW}[4/7]${NC} Scanning for fj-dev-local adapter..."
if grep -r "fj-dev-local" "$DIST_DIR" 2>/dev/null | grep -v ".map"; then
  echo -e "${RED}❌ FAIL: Dev adapter identifier found${NC}"
  ((ISSUES_FOUND++))
else
  echo -e "${GREEN}✅ PASS: No dev adapter${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ CHECK 5: Check for DEV mode markers
# ═══════════════════════════════════════════════════════════════════
echo -e "${YELLOW}[5/7]${NC} Checking for DEV mode markers..."
DEV_MARKERS=$(grep -r "X-FreeJack-Mode.*DEV_LOCAL\|mode.*development" "$DIST_DIR" 2>/dev/null | grep -v ".map" || true)
if [ -n "$DEV_MARKERS" ]; then
  echo -e "${RED}❌ FAIL: DEV mode markers found:${NC}"
  echo "$DEV_MARKERS"
  ((ISSUES_FOUND++))
else
  echo -e "${GREEN}✅ PASS: No DEV markers${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ CHECK 6: Validate NODE_ENV in manifest
# ═══════════════════════════════════════════════════════════════════
echo -e "${YELLOW}[6/7]${NC} Checking manifest.json..."
if [ -f "$DIST_DIR/manifest.json" ]; then
  if grep -q '"version"' "$DIST_DIR/manifest.json"; then
    echo -e "${GREEN}✅ PASS: Manifest exists${NC}"
  else
    echo -e "${RED}❌ FAIL: Manifest corrupted${NC}"
    ((ISSUES_FOUND++))
  fi
else
  echo -e "${RED}❌ FAIL: Manifest not found${NC}"
  ((ISSUES_FOUND++))
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# ✅ CHECK 7: Verify routing guards exist
# ═══════════════════════════════════════════════════════════════════
echo -e "${YELLOW}[7/7]${NC} Verifying routing guards in bundle..."
GUARD_FOUND=$(grep -r "assertNoLocalConfigInProd\|SECURITY VIOLATION" "$DIST_DIR" 2>/dev/null | grep -v ".map" || true)
if [ -z "$GUARD_FOUND" ]; then
  echo -e "${RED}⚠️  WARNING: Security guards not found in bundle (may be optimized out)${NC}"
else
  echo -e "${GREEN}✅ PASS: Security guards present${NC}"
fi
echo ""

# ═══════════════════════════════════════════════════════════════════
# 📊 Final Report
# ═══════════════════════════════════════════════════════════════════
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 Validation Report${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $ISSUES_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ BUILD IS SAFE FOR PRODUCTION${NC}"
  echo -e "${GREEN}No DEV_LOCAL configuration detected${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}❌ BUILD IS NOT SAFE FOR PRODUCTION${NC}"
  echo -e "${RED}Found $ISSUES_FOUND issue(s)${NC}"
  echo ""
  echo "🔧 To fix:"
  echo "  1. Remove .env.local from repository"
  echo "  2. Rebuild with: NODE_ENV=production pnpm build"
  echo "  3. Verify VITE_FREEJACK_DEV_LOCAL is not set"
  echo ""
  exit 1
fi
