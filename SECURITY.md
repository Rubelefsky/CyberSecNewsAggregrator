# 🔒 Security & Privacy Guidelines

This document outlines the security measures implemented in this project to ensure safe deployment and usage.

---

## ✅ Pre-Upload Checklist

Before pushing to GitHub, ensure:

- [ ] `.gitignore` is configured to exclude sensitive files
- [ ] `.env` files are NOT committed (included in `.gitignore`)
- [ ] No personal file paths in documentation
- [ ] No API keys, tokens, or credentials in code
- [ ] No personal information in logs
- [ ] Dependencies are up to date
- [ ] Security headers are properly configured

---

## 🛡️ Security Features Implemented

### 1. Environment Variables
- All configuration stored in `.env` files
- `.env` files are excluded from Git via `.gitignore`
- `.env.example` provided as template (no sensitive data)

### 2. Security Headers (Helmet.js)
**File:** `backend/src/server.js`

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'"],
    },
  },
}));
```

**Protects Against:**
- Cross-Site Scripting (XSS)
- Clickjacking
- Content injection
- MIME type sniffing

### 3. CORS Configuration
**File:** `backend/src/server.js`

```javascript
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};
```

**Protects Against:**
- Unauthorized cross-origin requests
- CSRF attacks

### 4. Input Sanitization
**File:** `script.js`

```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

**Used in:** `createNewsCard()` function

**Protects Against:**
- XSS attacks via article titles/descriptions
- HTML injection

### 5. Rate Limiting (Configured)
**File:** `.env`

```properties
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX=100        # 100 requests per window
```

**Protects Against:**
- Brute force attacks
- DDoS attempts
- API abuse

---

## 🚫 What's NOT Included in Git

The following files/folders are excluded via `.gitignore`:

### Sensitive Files:
- `.env` - Environment variables with configuration
- `.env.local` - Local overrides
- `backend/.env` - Backend environment variables

### Build & Dependencies:
- `node_modules/` - NPM dependencies (large, regeneratable)
- `package-lock.json` - Lock files (optional)
- `dist/` - Build output
- `build/` - Compiled files

### Logs & Runtime:
- `logs/` - Application logs (may contain sensitive info)
- `*.log` - All log files
- `*.pid` - Process IDs

### Personal Files:
- `.vscode/` - Editor settings
- `.idea/` - IDE settings
- `notes.md` - Personal notes
- `TODO.md` - Personal todo lists

---

## 🔑 Environment Variables

### Required Variables (`.env`):

```properties
# Server
PORT=3000
NODE_ENV=development

# CORS - Add your production domain
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Cache (in seconds)
CACHE_TTL=900

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
```

### Production Recommendations:

```properties
NODE_ENV=production
PORT=443
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=warn
```

---

## 🌐 Deployment Security

### For Production Deployment:

1. **Use HTTPS Only**
   ```javascript
   // Enforce HTTPS in production
   if (process.env.NODE_ENV === 'production') {
     app.use((req, res, next) => {
       if (req.header('x-forwarded-proto') !== 'https') {
         res.redirect(`https://${req.header('host')}${req.url}`);
       } else {
         next();
       }
     });
   }
   ```

2. **Set Secure CORS**
   ```properties
   CORS_ORIGIN=https://yourdomain.com
   ```

3. **Enable Strict CSP**
   ```javascript
   imgSrc: ["'self'", "https://images.unsplash.com"],
   ```

4. **Use Environment-Specific Configs**
   - Development: `.env.development`
   - Production: `.env.production`
   - Never commit these files!

5. **Implement API Authentication** (Future Enhancement)
   - JWT tokens for API access
   - API keys for rate limiting
   - OAuth for user accounts

---

## 🔍 Security Audit Checklist

### Before Each Release:

- [ ] Run `npm audit` to check for vulnerabilities
- [ ] Update dependencies: `npm update`
- [ ] Review security headers configuration
- [ ] Test CORS configuration
- [ ] Verify `.gitignore` is working
- [ ] Check for hardcoded secrets in code
- [ ] Review error messages (don't expose internals)
- [ ] Test rate limiting
- [ ] Verify input sanitization
- [ ] Check CSP configuration

### Commands:

```bash
# Check for vulnerabilities
npm audit

# Fix auto-fixable vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

---

## 🚨 What to Do If You Accidentally Commit Secrets

If you accidentally commit sensitive information:

1. **Immediately Rotate Credentials**
   - Change all exposed passwords/keys
   - Revoke compromised tokens

2. **Remove from Git History**
   ```bash
   # Use BFG Repo-Cleaner or git filter-branch
   # WARNING: This rewrites history!
   
   # Example with BFG
   bfg --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

3. **Force Push (Dangerous!)**
   ```bash
   git push --force
   ```

4. **Consider Repository as Compromised**
   - If secrets were exposed, assume they're compromised
   - Create a new repository if necessary

---

## 📱 API Security Best Practices

### Current Implementation:

1. **No Authentication** (Public RSS aggregation)
   - Read-only access
   - No user data stored
   - Rate limiting configured

### Recommended for Production:

1. **Add API Keys**
   ```javascript
   app.use('/api', (req, res, next) => {
     const apiKey = req.header('X-API-Key');
     if (!apiKey || !isValidApiKey(apiKey)) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     next();
   });
   ```

2. **Implement Rate Limiting per Key**
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP'
   });
   
   app.use('/api/', limiter);
   ```

3. **Add Request Logging**
   - Log all API access
   - Monitor for suspicious patterns
   - Already implemented via Winston

---

## 🛠️ Security Tools & Resources

### Recommended Tools:

1. **Snyk** - Dependency vulnerability scanning
   ```bash
   npm install -g snyk
   snyk test
   ```

2. **OWASP Dependency-Check** - Identify known vulnerabilities
   ```bash
   npm install -g owasp-dependency-check
   ```

3. **ESLint Security Plugin**
   ```bash
   npm install --save-dev eslint-plugin-security
   ```

### Resources:

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Node.js Security Checklist:** https://blog.risingstack.com/node-js-security-checklist/
- **Helmet.js Documentation:** https://helmetjs.github.io/
- **Express Security Best Practices:** https://expressjs.com/en/advanced/best-practice-security.html

---

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. **DO** email the maintainers directly (if applicable)
3. **DO** provide detailed information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

## ✅ Final Pre-Push Checklist

Before pushing to GitHub:

```bash
# 1. Check .gitignore is working
git status

# 2. Verify no .env files are staged
git ls-files | grep .env

# 3. Check for sensitive strings
git grep -i "password\|secret\|key\|token" -- ':!*.md' ':!SECURITY.md'

# 4. Run security audit
npm audit

# 5. Test locally
npm start

# 6. Ready to push!
git push origin main
```

---

## 📝 Version History

**Last Updated:** November 14, 2024
**Version:** 1.1.1
**Status:** Production Ready

---

**Remember:** Security is an ongoing process, not a one-time setup. Regularly review and update security measures!
