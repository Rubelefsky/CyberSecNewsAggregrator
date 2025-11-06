#!/bin/bash

# =============================================================================
# Pre-Push Security Check Script
# =============================================================================
# This script checks for common security issues before pushing to GitHub
# Run this before every push: ./pre-push-check.sh
# =============================================================================

echo "🔒 Running Pre-Push Security Checks..."
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# =============================================================================
# Check 1: Verify .gitignore exists and is configured
# =============================================================================
echo "📋 Check 1: Verifying .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q "\.env" .gitignore && grep -q "node_modules" .gitignore; then
        echo -e "${GREEN}✓ .gitignore properly configured${NC}"
    else
        echo -e "${RED}✗ .gitignore missing critical entries${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗ .gitignore file not found${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# =============================================================================
# Check 2: Ensure .env files are NOT staged
# =============================================================================
echo "🔑 Check 2: Checking for .env files in staging..."
if git ls-files --cached | grep -q "\.env"; then
    echo -e "${RED}✗ .env file(s) found in staging area!${NC}"
    echo "   Run: git rm --cached .env backend/.env"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ No .env files in staging${NC}"
fi
echo ""

# =============================================================================
# Check 3: Check for hardcoded secrets
# =============================================================================
echo "🔍 Check 3: Scanning for potential secrets..."
SECRETS_FOUND=false

if git diff --cached | grep -i -E "(password|secret|api_key|apikey|token|private_key)" | grep -v "\.md:" | grep -v "#" > /dev/null; then
    echo -e "${YELLOW}⚠ Potential secrets found in staged changes${NC}"
    echo "   Please review carefully!"
    WARNINGS=$((WARNINGS + 1))
    SECRETS_FOUND=true
else
    echo -e "${GREEN}✓ No obvious secrets detected${NC}"
fi
echo ""

# =============================================================================
# Check 4: Check for personal paths
# =============================================================================
echo "📂 Check 4: Checking for personal file paths..."
if git diff --cached | grep -i -E "(C:\\\\Users|/Users/[^/]+/|/home/[^/]+/)" > /dev/null; then
    echo -e "${RED}✗ Personal file paths found in staged changes${NC}"
    echo "   Please use relative paths or generic examples"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ No personal paths detected${NC}"
fi
echo ""

# =============================================================================
# Check 5: Verify logs directory is ignored
# =============================================================================
echo "📝 Check 5: Checking for log files..."
if git ls-files --cached | grep -q "\.log$\|^logs/"; then
    echo -e "${YELLOW}⚠ Log files found in staging${NC}"
    echo "   Consider adding to .gitignore"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ No log files in staging${NC}"
fi
echo ""

# =============================================================================
# Check 6: Verify node_modules is not staged
# =============================================================================
echo "📦 Check 6: Checking for node_modules..."
if git ls-files --cached | grep -q "node_modules/"; then
    echo -e "${RED}✗ node_modules found in staging!${NC}"
    echo "   Run: git rm -r --cached node_modules"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✓ node_modules not in staging${NC}"
fi
echo ""

# =============================================================================
# Check 7: Run npm audit (if package.json exists)
# =============================================================================
echo "🛡️ Check 7: Running npm audit..."
if [ -f "backend/package.json" ]; then
    cd backend
    AUDIT_OUTPUT=$(npm audit --audit-level=moderate 2>&1)
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠ npm audit found vulnerabilities${NC}"
        echo "   Run 'cd backend && npm audit fix' to resolve"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${GREEN}✓ No vulnerabilities found${NC}"
    fi
    cd ..
else
    echo -e "${YELLOW}⚠ package.json not found, skipping audit${NC}"
fi
echo ""

# =============================================================================
# Check 8: Verify README exists
# =============================================================================
echo "📖 Check 8: Checking for README..."
if [ -f "README.md" ]; then
    echo -e "${GREEN}✓ README.md exists${NC}"
else
    echo -e "${YELLOW}⚠ README.md not found${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# =============================================================================
# Check 9: Check for debug code
# =============================================================================
echo "🐛 Check 9: Checking for debug code..."
if git diff --cached | grep -i -E "(console\.log|debugger|TODO|FIXME)" | grep -v "\.md:" > /dev/null; then
    echo -e "${YELLOW}⚠ Debug code found in staged changes${NC}"
    echo "   Consider removing before production"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓ No debug code detected${NC}"
fi
echo ""

# =============================================================================
# Summary
# =============================================================================
echo "========================================"
echo "Summary:"
echo "========================================"
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Pre-push checks FAILED!${NC}"
    echo "Please fix all errors before pushing to GitHub."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Pre-push checks passed with warnings${NC}"
    echo "Review warnings and proceed with caution."
    echo ""
    read -p "Continue with push? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Push cancelled."
        exit 1
    fi
else
    echo -e "${GREEN}✅ All pre-push checks passed!${NC}"
    echo "You're good to push to GitHub!"
fi

exit 0
