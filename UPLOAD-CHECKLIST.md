# 🚀 GitHub Upload Checklist

Quick reference guide for safely uploading your project to GitHub.

---

## ✅ Pre-Upload Checklist

### 1. **Run Security Check**
```powershell
# Windows
.\pre-push-check-simple.ps1

# Linux/Mac
./pre-push-check.sh
```

### 2. **Verify .gitignore is Working**
```bash
git status
```
Ensure you DON'T see:
- ❌ `.env` files
- ❌ `node_modules/` folder
- ❌ `logs/` folder
- ❌ Personal configuration files

### 3. **Check for Personal Information**
```bash
# Search for personal paths
git grep -i "c:\\users\|/users/" -- ':!*.md' ':!SECURITY.md'

# Should return: no matches
```

### 4. **Run Tests Locally**
```bash
# Start backend
cd backend
npm start

# Test in browser
# Open: http://localhost:3000

# Verify images load correctly
```

### 5. **Review Staged Changes**
```bash
git diff --cached
```
Look for:
- ❌ API keys or tokens
- ❌ Passwords or secrets
- ❌ Personal file paths
- ❌ Sensitive configuration

---

## 🔒 Files That Should NOT Be Committed

- ✅ `.env` - Already in .gitignore
- ✅ `.env.local` - Already in .gitignore
- ✅ `backend/.env` - Already in .gitignore
- ✅ `node_modules/` - Already in .gitignore
- ✅ `logs/` - Already in .gitignore
- ✅ `*.log` - Already in .gitignore
- ✅ `.vscode/` - Already in .gitignore
- ✅ `.idea/` - Already in .gitignore

---

## 📦 Files That SHOULD Be Committed

- ✅ `README.md` - Project documentation
- ✅ `CHANGELOG.md` - Change history
- ✅ `SECURITY.md` - Security guidelines
- ✅ `TROUBLESHOOTING.md` - Troubleshooting guide
- ✅ `.gitignore` - Git ignore rules
- ✅ `.env.example` - Environment template (NO SECRETS!)
- ✅ `backend/.env.example` - Backend env template
- ✅ `package.json` - Dependencies
- ✅ All `.js`, `.html`, `.css` files - Source code
- ✅ `pre-push-check.sh` - Security script (Mac/Linux)
- ✅ `pre-push-check-simple.ps1` - Security script (Windows)

---

## 🚀 Step-by-Step Upload Process

### First Time Setup:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add remote repository
git remote add origin https://github.com/Rubelefsky/CyberSecNewsAggregrator.git

# 3. Stage all files
git add .

# 4. Run security check
.\pre-push-check-simple.ps1  # Windows
./pre-push-check.sh          # Linux/Mac

# 5. Review what will be committed
git status

# 6. Commit changes
git commit -m "Initial commit: CyberSec News Aggregator with static Unsplash images"

# 7. Push to GitHub
git push -u origin main
```

### Subsequent Updates:

```bash
# 1. Stage changes
git add .

# 2. Run security check
.\pre-push-check-simple.ps1

# 3. Commit
git commit -m "Description of changes"

# 4. Push
git push origin main
```

---

## 🛡️ Security Verification Commands

### Check for .env files:
```bash
git ls-files | grep .env
# Should show: .env.example (template only)
# Should NOT show: .env, backend/.env
```

### Check for secrets:
```bash
git grep -i "password\|secret\|key\|token" -- ':!*.md' ':!SECURITY.md'
# Review carefully - should only show documentation
```

### Check for personal paths:
```bash
git grep -i "c:\\users\|/users/\|/home/" -- ':!*.md'
# Should return: no matches
```

### Verify node_modules is ignored:
```bash
git ls-files | grep node_modules
# Should return: no matches
```

---

## 📝 Good Commit Message Examples

```bash
# Feature additions
git commit -m "feat: Add static Unsplash images for all news sources"

# Bug fixes
git commit -m "fix: Resolve image loading issue with Content Security Policy"

# Documentation
git commit -m "docs: Add comprehensive security guidelines"

# Configuration
git commit -m "config: Update CORS settings for production"

# Refactoring
git commit -m "refactor: Simplify RSS feed image extraction logic"
```

---

## 🔄 If You Need to Undo

### Unstage files:
```bash
git reset HEAD <file>
```

### Undo last commit (keep changes):
```bash
git reset --soft HEAD~1
```

### Undo last commit (discard changes):
```bash
git reset --hard HEAD~1
```

### Remove file from git but keep locally:
```bash
git rm --cached <file>
```

---

## 🆘 Emergency: Accidentally Committed Secrets

If you accidentally commit sensitive information:

```bash
# 1. IMMEDIATELY change all exposed credentials
# 2. Remove from git history
git rm --cached .env
git commit -m "Remove sensitive file"
git push --force origin main

# 3. For complete removal from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 4. Force push (WARNING: Destructive!)
git push --force --all
```

**Note:** Consider all exposed secrets as compromised and rotate them immediately!

---

## ✅ Final Verification

Before pushing, confirm:

- [ ] Security check script passes
- [ ] `.gitignore` is working correctly
- [ ] No `.env` files in staging
- [ ] No `node_modules/` in staging
- [ ] No personal paths in code
- [ ] No hardcoded secrets
- [ ] README.md is up to date
- [ ] Application runs locally
- [ ] All tests pass
- [ ] Commit message is descriptive

---

## 🎯 Quick Commands Reference

```bash
# Check git status
git status

# View staged changes
git diff --cached

# View unstaged changes
git diff

# List all tracked files
git ls-files

# Run security audit
npm audit

# Check for outdated packages
npm outdated

# Update dependencies
npm update
```

---

## 📞 Need Help?

1. Review `SECURITY.md` for detailed security guidelines
2. Check `TROUBLESHOOTING.md` for common issues
3. Read `CHANGELOG.md` for recent changes
4. Run pre-push check scripts for automated verification

---

**Last Updated:** November 5, 2025  
**Status:** Ready for GitHub Upload ✅

---

**Remember:** When in doubt, run the security check script! It's better to be safe than sorry. 🔒
