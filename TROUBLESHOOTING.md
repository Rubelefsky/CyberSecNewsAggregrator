# 🔧 Troubleshooting Guide - Images Not Loading

## Problem: Photos/Images Not Displaying on Main Page

This guide will help you diagnose and fix image loading issues.

---

## Quick Diagnosis Checklist

### ✅ Step 1: Verify Backend is Running

Open PowerShell and run:
```powershell
curl http://localhost:3000/api/health
```

**Expected Output:** JSON with `"status": "healthy"`

**If it fails:** The backend server is not running. Start it:
```powershell
cd backend
npm start
```

---

### ✅ Step 2: Check API Returns Images

Test the API endpoint:
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/news"
$response.data | Select-Object -First 3 | Format-List title, imageUrl, source
```

**Expected Output:** You should see `imageUrl` fields with URLs

**If imageUrl is empty/null:**
- RSS feeds might not contain images
- Image extraction logic needs adjustment
- Fallback images should be used

---

### ✅ Step 3: Test API with Debug Page

1. Make sure backend is running
2. Open: http://localhost:3000/test-api.html
3. Check browser console (F12) for errors

**What to look for:**
- ✅ Green checkmarks = images loading successfully
- ❌ Red borders on images = loading failed
- Console logs showing image URLs

---

### ✅ Step 4: Check Browser Console on Main Page

1. Open: http://localhost:3000/
2. Press F12 to open Developer Tools
3. Go to Console tab

**Look for:**
- "API Response:" - Should show data
- "Creating card with image:" - Should show image URLs
- Any CORS errors
- Any CSP (Content Security Policy) errors

---

## Common Issues & Solutions

### Issue 1: CORS Errors
**Symptom:** Console shows "blocked by CORS policy"

**Solution:** Backend CORS is already configured. Make sure you're accessing via `http://localhost:3000` not opening the HTML file directly.

---

### Issue 2: Content Security Policy Blocking Images
**Symptom:** Console shows "refused to load the image because it violates CSP"

**Solution:** The helmet configuration has been updated to allow external images:
- `imgSrc: ["'self'", "data:", "https:", "http:"]` - Allows all image sources

---

### Issue 3: Image URLs are NULL or Undefined
**Symptom:** API returns articles but imageUrl is null

**Solution:** The RSS feed might not have images. The code has been updated with:
1. Enhanced image extraction from multiple RSS formats
2. Fallback to default images per source
3. Additional error handling

---

### Issue 4: Images Loading Slowly
**Symptom:** Images take a long time to appear

**Possible Causes:**
- External image hosts (Unsplash, news sites) are slow
- Network connectivity issues
- Images are large files

**Solutions:**
- Images have fallback on error
- Consider implementing image caching
- Use CDN for faster delivery

---

### Issue 5: Mixed Content Warnings
**Symptom:** Console shows "mixed content" warnings (HTTPS/HTTP)

**Solution:** The helmet CSP has been configured to allow both:
- `https:` - Secure images
- `http:` - Non-secure images (for compatibility)

---

## Debugging Commands

### Check what the backend is serving:
```powershell
# Get first article with full details
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/news"
$response.data[0] | ConvertTo-Json -Depth 5
```

### Test specific source:
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/news/source/thehackernews"
$response.data[0] | Format-List
```

### Check cache status:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/cache/stats"
```

### Clear cache and refetch:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/cache/flush" -Method DELETE
```

---

## Code Changes Made

### 1. Fixed API URL (script.js)
**Before:**
```javascript
const API_BASE_URL = window.location.origin;
```

**After:**
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

**Why:** Ensures frontend always connects to the backend server.

---

### 2. Enhanced Image Extraction (rssFeedService.js)
**Added support for:**
- `media:content` arrays
- `media:thumbnail` elements
- Image extraction from HTML content
- Multiple fallback strategies
- Better regex patterns

---

### 3. Improved Card Creation (script.js)
**Added:**
- Image URL validation and fallback
- Debug logging for troubleshooting
- Better error handling with console logs
- HTML escaping for security

---

### 4. Fixed Helmet CSP (server.js)
**Added Content Security Policy:**
```javascript
imgSrc: ["'self'", "data:", "https:", "http:"]
```
**Why:** Allows loading images from external sources.

---

## How to Verify Fix

### Method 1: Visual Check
1. Start backend: `npm start` in backend folder
2. Open: http://localhost:3000
3. You should see images on article cards

### Method 2: Browser DevTools
1. Open http://localhost:3000
2. Press F12
3. Go to Network tab
4. Filter by "Img"
5. Refresh page
6. You should see image requests with status 200

### Method 3: Element Inspection
1. Open http://localhost:3000
2. Right-click on an article card
3. Select "Inspect Element"
4. Check the `<img>` tag's `src` attribute
5. Verify it has a valid URL

---

## Still Not Working?

### Try These Steps:

1. **Restart Everything:**
   ```powershell
   # Stop backend (Ctrl+C)
   # Clear cache
   rm -r backend/node_modules/.cache -ErrorAction SilentlyContinue
   # Restart
   cd backend
   npm start
   ```

2. **Hard Refresh Browser:**
   - Windows: `Ctrl + Shift + R`
   - Or: `Ctrl + F5`

3. **Check Image URLs Manually:**
   - Copy an image URL from the API response
   - Paste it in a new browser tab
   - If it doesn't load there, the source URL is invalid

4. **Verify RSS Feeds:**
   Some RSS feeds might be blocking requests or have changed URLs.
   Check `backend/src/config/sources.js` for feed URLs.

---

## Alternative: Use Sample Data

If the RSS feeds are having issues, you can temporarily use sample data:

**In script.js, change:**
```javascript
const USE_BACKEND = false; // Use sample data instead
```

This will display the built-in sample articles with working image URLs.

---

## Contact & Support

If issues persist:
1. Check GitHub issues: https://github.com/Rubelefsky/CyberSecNewsAggregrator/issues
2. Review backend logs in: `backend/logs/`
3. Take screenshots of console errors
4. Note the exact steps to reproduce

---

**Last Updated:** November 5, 2025
