# =============================================================================
# Pre-Push Security Check Script (PowerShell)
# =============================================================================
# This script checks for common security issues before pushing to GitHub
# Run this before every push: .\pre-push-check-simple.ps1
# =============================================================================

Write-Host "[*] Running Pre-Push Security Checks..." -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$WarningCount = 0

# =============================================================================
# Check 1: Verify .gitignore exists and is configured
# =============================================================================
Write-Host "[1/9] Checking .gitignore configuration..." -ForegroundColor Yellow
if (-Not (Test-Path ".gitignore")) {
    Write-Host "[X] .gitignore file missing!" -ForegroundColor Red
    $ErrorCount++
} elseif (-Not (Select-String -Path ".gitignore" -Pattern "node_modules|\.env" -Quiet)) {
    Write-Host "[!] .gitignore missing important patterns" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "[OK] .gitignore properly configured" -ForegroundColor Green
}
Write-Host ""

# =============================================================================
# Check 2: Check for .env files in staging
# =============================================================================
Write-Host "[2/9] Checking for .env files in staging..." -ForegroundColor Yellow
$stagedFiles = git ls-files --cached
if ($stagedFiles -match "\.env$|\.env\.local") {
    Write-Host "[X] .env file(s) found in staging area!" -ForegroundColor Red
    Write-Host "    Run: git rm --cached .env backend/.env" -ForegroundColor Yellow
    $ErrorCount++
} else {
    Write-Host "[OK] No .env files in staging" -ForegroundColor Green
}
Write-Host ""

# =============================================================================
# Check 3: Check for hardcoded secrets
# =============================================================================
Write-Host "[3/9] Scanning for potential secrets..." -ForegroundColor Yellow
$diff = git diff --cached
if (($diff -match "password|secret|api_key|apikey|token|private_key") -and ($diff -notmatch "\.md:")) {
    Write-Host "[!] Potential secrets found in staged changes" -ForegroundColor Yellow
    Write-Host "    Please review carefully!" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "[OK] No obvious secrets detected" -ForegroundColor Green
}
Write-Host ""

# =============================================================================
# Check 4: Check for personal paths
# =============================================================================
Write-Host "[4/9] Checking for personal file paths..." -ForegroundColor Yellow
if ($diff -match "C:\\Users|/Users/|/home/") {
    Write-Host "[X] Personal file paths found in staged changes" -ForegroundColor Red
    Write-Host "    Please use relative paths or generic examples" -ForegroundColor Yellow
    $ErrorCount++
} else {
    Write-Host "[OK] No personal paths detected" -ForegroundColor Green
}
Write-Host ""

# =============================================================================
# Check 5: Check for log files
# =============================================================================
Write-Host "[5/9] Checking for log files..." -ForegroundColor Yellow
if ($stagedFiles -match "\.log$|^logs/") {
    Write-Host "[!] Log files found in staging" -ForegroundColor Yellow
    Write-Host "    Consider adding to .gitignore" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "[OK] No log files in staging" -ForegroundColor Green
}
Write-Host ""

# =============================================================================
# Check 6: Verify node_modules is not staged
# =============================================================================
Write-Host "[6/9] Checking for node_modules..." -ForegroundColor Yellow
if ($stagedFiles -match "node_modules/") {
    Write-Host "[X] node_modules found in staging!" -ForegroundColor Red
    Write-Host "    Run: git rm -r --cached node_modules" -ForegroundColor Yellow
    $ErrorCount++
} else {
    Write-Host "[OK] node_modules not in staging" -ForegroundColor Green
}
Write-Host ""

# =============================================================================
# Check 7: Run npm audit (if package.json exists)
# =============================================================================
Write-Host "[7/9] Running npm audit..." -ForegroundColor Yellow
if (Test-Path "backend/package.json") {
    Push-Location backend
    $auditResult = npm audit --audit-level=moderate 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] npm audit found vulnerabilities" -ForegroundColor Yellow
        Write-Host "    Run npm audit fix from backend directory to resolve" -ForegroundColor Yellow
        $WarningCount++
    } else {
        Write-Host "[OK] No vulnerabilities found" -ForegroundColor Green
    }
    Pop-Location
} else {
    Write-Host "[!] package.json not found, skipping audit" -ForegroundColor Yellow
}
Write-Host ""

# =============================================================================
# Check 8: Verify README exists
# =============================================================================
Write-Host "[8/9] Checking for README..." -ForegroundColor Yellow
if (Test-Path "README.md") {
    Write-Host "[OK] README.md exists" -ForegroundColor Green
} else {
    Write-Host "[!] README.md not found" -ForegroundColor Yellow
    $WarningCount++
}
Write-Host ""

# =============================================================================
# Check 9: Check for debug code
# =============================================================================
Write-Host "[9/9] Checking for debug code..." -ForegroundColor Yellow
if (($diff -match "console\.log|debugger|TODO|FIXME") -and ($diff -notmatch "\.md:")) {
    Write-Host "[!] Debug code found in staged changes" -ForegroundColor Yellow
    Write-Host "    Consider removing before production" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "[OK] No debug code detected" -ForegroundColor Green
}
Write-Host ""

# =============================================================================
# Summary
# =============================================================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Errors:   $ErrorCount" -ForegroundColor $(if ($ErrorCount -gt 0) { "Red" } else { "Green" })
Write-Host "Warnings: $WarningCount" -ForegroundColor $(if ($WarningCount -gt 0) { "Yellow" } else { "Green" })
Write-Host ""

if ($ErrorCount -gt 0) {
    Write-Host "[FAILED] Pre-push checks FAILED!" -ForegroundColor Red
    Write-Host "Please fix the errors above before pushing." -ForegroundColor Red
    exit 1
} elseif ($WarningCount -gt 0) {
    Write-Host "[WARNING] Pre-push checks passed with warnings" -ForegroundColor Yellow
    Write-Host "Consider addressing the warnings above." -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "[SUCCESS] All pre-push checks passed!" -ForegroundColor Green
    Write-Host "You are ready to push to GitHub." -ForegroundColor Green
    exit 0
}
