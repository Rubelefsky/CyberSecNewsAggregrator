# Pre-Push Security Check Scripts

This folder contains automated security verification scripts to run before pushing code to GitHub.

## Which Script to Use?

### Windows Users:
```powershell
.\pre-push-check-simple.ps1
```
✅ **Recommended** - Uses ASCII characters, no encoding issues

**Note:** The original `pre-push-check.ps1` had Unicode emoji characters that can cause PowerShell parsing errors. Use `pre-push-check-simple.ps1` instead.

### Mac/Linux Users:
```bash
./pre-push-check.sh
```
✅ Works perfectly with Unicode emojis

---

## What the Script Checks:

1. **✓ .gitignore Configuration** - Ensures important patterns are excluded
2. **✓ .env Files** - Verifies no environment files are staged
3. **✓ Hardcoded Secrets** - Scans for passwords, API keys, tokens
4. **✓ Personal Paths** - Checks for C:\Users, /Users/, /home/ paths
5. **✓ Log Files** - Warns if log files are being committed
6. **✓ node_modules** - Ensures dependencies aren't staged
7. **✓ npm Audit** - Runs security vulnerability scan
8. **✓ README** - Verifies documentation exists
9. **✓ Debug Code** - Detects console.log, debugger statements

---

## Exit Codes:

- **0** - All checks passed ✅
- **1** - Errors found, do NOT push ❌

---

## Example Output (Success):

```
[*] Running Pre-Push Security Checks...

[1/9] Checking .gitignore configuration...
[OK] .gitignore properly configured

[2/9] Checking for .env files in staging...
[OK] No .env files in staging

...

========================================
Summary:
========================================
Errors:   0
Warnings: 0

[SUCCESS] All pre-push checks passed!
You are ready to push to GitHub.
```

---

## Troubleshooting:

### Script Won't Run (PowerShell)

If you get "execution policy" error:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\pre-push-check-simple.ps1
```

### Script Won't Run (Bash)

If you get "permission denied":
```bash
chmod +x pre-push-check.sh
./pre-push-check.sh
```

### Parser Errors

If `pre-push-check.ps1` gives parser errors:
- Use `pre-push-check-simple.ps1` instead
- The original script has emoji encoding issues in PowerShell

---

**Last Updated:** November 14, 2024
