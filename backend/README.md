# 🛡️ CyberSec News Aggregator - Backend API

A robust, production-ready REST API for aggregating cybersecurity news from multiple RSS feeds with intelligent caching, comprehensive logging, and security hardening.

![Version](https://img.shields.io/badge/version-1.1.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [News Sources](#-news-sources)
- [Caching Strategy](#-caching-strategy)
- [Logging](#-logging)
- [Security](#-security)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 📖 Overview

This backend service is the heart of the CyberSec News Aggregator application. It fetches cybersecurity news from 7 trusted RSS sources, parses and normalizes the data, and provides a unified REST API with intelligent caching and comprehensive error handling.

**Key Capabilities:**
- ⚡ Real-time RSS feed aggregation from 7 sources
- 🗄️ Intelligent 15-minute caching for optimal performance
- 🔒 Production-ready security with Helmet.js and CSP
- 📝 Comprehensive Winston logging system
- 🎨 Static Unsplash images for reliable visual content
- 🌐 CORS support for cross-origin requests
- 🏥 Built-in health monitoring endpoints
- 🚀 Graceful shutdown and error handling

---

## ✨ Features

### Core Features
- **RSS Feed Aggregation** - Fetches and parses news from 7 cybersecurity sources simultaneously
- **Smart Caching** - 15-minute in-memory cache with automatic expiration and hit/miss tracking
- **Static Image Assignment** - Each source has a unique, high-quality Unsplash image for consistent branding
- **Parallel Fetching** - All RSS feeds fetched concurrently using Promise.allSettled
- **Error Isolation** - Failed sources don't block others; graceful degradation

### API Features
- **RESTful Design** - Clean, intuitive endpoints following REST principles
- **Comprehensive Responses** - Rich metadata including fetch times, source counts, and statistics
- **Source Management** - Query all sources or filter by specific source/category
- **Health Monitoring** - Real-time health checks with cache statistics and uptime
- **Development Tools** - Cache management endpoints for debugging

### Security Features
- **Helmet.js** - Security headers (CSP, XSS protection, frame options)
- **CORS** - Configurable cross-origin resource sharing
- **Content Security Policy** - Restricts resource loading to trusted sources
- **Input Validation** - Request parameter validation and sanitization
- **Error Sanitization** - No sensitive data exposed in production errors

### Operational Features
- **Winston Logging** - Multi-level logging (debug, info, warn, error)
- **Log Files** - Separate logs for combined, errors, exceptions, and rejections
- **Graceful Shutdown** - Proper cleanup on SIGTERM/SIGINT
- **Process Management** - PM2-ready with uncaught exception handling
- **Static File Serving** - Serves frontend files automatically

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                     │
│                   (HTML/CSS/JavaScript)                     │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    Express.js Server                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Middleware Layer                                     │   │
│  │  • Helmet.js (Security)                             │   │
│  │  • CORS (Cross-Origin)                              │   │
│  │  • Body Parser                                       │   │
│  │  • Request Logger                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                      │                                       │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ API Routes Layer                                     │   │
│  │  • /api/health                                       │   │
│  │  • /api/news                                         │   │
│  │  • /api/news/source/:id                             │   │
│  │  • /api/news/sources                                │   │
│  │  • /api/cache/* (dev only)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                      │                                       │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Cache Middleware                                     │   │
│  │  • node-cache (In-Memory)                           │   │
│  │  • TTL: 15 minutes                                  │   │
│  │  • Cache hit/miss tracking                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                      │                                       │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ RSS Feed Service                                     │   │
│  │  • rss-parser                                       │   │
│  │  • Parallel fetching (Promise.allSettled)          │   │
│  │  • Timeout: 10 seconds per feed                     │   │
│  │  • Error handling per source                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                      │                                       │
│                      ↓                                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ News Sources (7 Active RSS Feeds)                   │   │
│  │  • The Hacker News                                  │   │
│  │  • Bleeping Computer                                │   │
│  │  • Krebs on Security                                │   │
│  │  • Dark Reading                                     │   │
│  │  • SecurityWeek (Fixed)                             │   │
│  │  • CSO Online                                       │   │
│  │  • Trend Micro Research (Fixed)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────────────┐
│                    Winston Logger                           │
│  • combined.log (all logs)                                 │
│  • error.log (errors only)                                 │
│  • exceptions.log (uncaught exceptions)                    │
│  • rejections.log (unhandled rejections)                   │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── logger.js              # Winston logging configuration
│   │   │   • Multi-level logging (debug, info, warn, error)
│   │   │   • File transports (combined, error, exceptions)
│   │   │   • Console transport with colors
│   │   │   • Timestamp formatting
│   │   │
│   │   └── sources.js             # News source configurations
│   │       • Source metadata (name, url, description)
│   │       • Helper functions (getEnabledSources, getSourceById)
│   │       • Category filtering
│   │
│   ├── routes/
│   │   └── newsRoutes.js          # API route handlers
│   │       • GET / - List all sources
│   │       • GET /sources - Get source information
│   │       • GET /sources/:id - Get specific source info
│   │       • GET /source/:id - Get news from specific source
│   │       • Cache middleware integration
│   │
│   ├── services/
│   │   └── rssFeedService.js      # RSS feed fetching and parsing
│   │       • fetchAllFeeds() - Aggregate all sources
│   │       • fetchSourceFeed() - Fetch single source
│   │       • fetchSpecificSource() - Fetch by ID
│   │       • generateArticleId() - Unique ID generation
│   │       • getDefaultImage() - Static Unsplash images
│   │
│   ├── utils/
│   │   └── cache.js               # Caching utilities
│   │       • get() - Retrieve cached value
│   │       • set() - Store value with TTL
│   │       • del() - Delete cached value
│   │       • flush() - Clear all cache
│   │       • getStats() - Cache statistics
│   │       • cacheMiddleware() - Express middleware
│   │
│   └── server.js                  # Main Express server
│       • Middleware setup (Helmet, CORS, body parser)
│       • Route mounting
│       • Error handling (404, 500, uncaught exceptions)
│       • Graceful shutdown
│       • Static file serving
│
├── logs/                          # Application logs (auto-created)
│   ├── combined.log               # All logs
│   ├── error.log                  # Errors only
│   ├── exceptions.log             # Uncaught exceptions
│   └── rejections.log             # Unhandled rejections
│
├── .env                           # Environment variables (not in git)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16 or higher
- **npm** v8 or higher
- A modern terminal (PowerShell, bash, zsh)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env with your settings (optional)
   nano .env  # or use your preferred editor
   ```

4. **Start the server:**

   **Development mode (with auto-reload):**
   ```bash
   npm run dev
   ```

   **Production mode:**
   ```bash
   npm start
   ```

5. **Verify it's running:**
   ```bash
   curl http://localhost:3000/api/health
   ```

   You should see:
   ```json
   {
     "status": "healthy",
     "timestamp": "2025-11-06T10:00:00.000Z",
     "uptime": 1.234,
     "environment": "development",
     "cache": {
       "keys": 0,
       "hits": 0,
       "misses": 0,
       "hitRate": "0%"
     }
   }
   ```

6. **Access the application:**
   - API: `http://localhost:3000/api`
   - Frontend: `http://localhost:3000`
   - Health: `http://localhost:3000/api/health`

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints Overview

| Method | Endpoint | Description | Cache | Auth |
|--------|----------|-------------|-------|------|
| GET | `/api` | API documentation and endpoint list | No | No |
| GET | `/api/health` | Health check and cache statistics | No | No |
| GET | `/api/news` | Fetch all news from all sources | 15 min | No |
| GET | `/api/news/source/:sourceId` | Fetch news from specific source | 15 min | No |
| GET | `/api/news/sources` | List all available sources | No | No |
| GET | `/api/news/sources/:sourceId` | Get specific source information | No | No |

### Development-Only Endpoints

Available only when `NODE_ENV=development`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cache/stats` | Get cache statistics |
| GET | `/api/cache/keys` | List all cache keys |
| DELETE | `/api/cache/flush` | Clear all cache |

---

### Detailed Endpoint Documentation

For complete API documentation with examples, response formats, and error handling, see the [API Reference section](#api-reference) below.

**Quick Examples:**

```bash
# Health check
curl http://localhost:3000/api/health

# Get all news
curl http://localhost:3000/api/news

# Get news from specific source
curl http://localhost:3000/api/news/source/thehackernews

# List all sources
curl http://localhost:3000/api/news/sources

# Cache management (dev only)
curl http://localhost:3000/api/cache/stats
curl -X DELETE http://localhost:3000/api/cache/flush
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

### Available Configuration

```properties
# ===================================
# Server Configuration
# ===================================
PORT=3000
NODE_ENV=development

# ===================================
# CORS Configuration
# ===================================
# Comma-separated list of allowed origins
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000

# ===================================
# Cache Configuration
# ===================================
# Cache TTL in seconds (default: 900 = 15 minutes)
CACHE_TTL=900

# ===================================
# Rate Limiting
# ===================================
# Time window in milliseconds (default: 900000 = 15 minutes)
RATE_LIMIT_WINDOW=900000

# Maximum requests per window (default: 100)
RATE_LIMIT_MAX=100

# ===================================
# Logging Configuration
# ===================================
# Log level: debug, info, warn, error (default: info)
LOG_LEVEL=info
```

### Production Configuration

For production deployments, use these recommended settings:

```properties
PORT=443
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
CACHE_TTL=900
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
LOG_LEVEL=warn
```

---

## 📰 News Sources

### Current Sources

The API aggregates news from **7 active cybersecurity sources**:

| Source | ID | Category | RSS Feed | Status | Image Theme |
|--------|----|---------| -|--------|-------------|
| **The Hacker News** | `thehackernews` | news | [Feed](https://feeds.feedburner.com/TheHackersNews) | ✅ Active | Cybersecurity lock |
| **Bleeping Computer** | `bleepingcomputer` | news | [Feed](https://www.bleepingcomputer.com/feed/) | ✅ Active | Security shield |
| **Krebs on Security** | `krebsonsecurity` | analysis | [Feed](https://krebsonsecurity.com/feed/) | ✅ Active | Digital security |
| **Dark Reading** | `darkreading` | news | [Feed](https://www.darkreading.com/rss.xml) | ✅ Active | Tech security |
| **SecurityWeek** | `securityweek` | news | [Feed](https://feeds.feedburner.com/securityweek) | ✅ Fixed | Network security |
| **CSO Online** | `csoonline` | analysis | [Feed](https://www.csoonline.com/feed) | ✅ Active | IoT security |
| **Trend Micro Research** | `trendmicro` | research | [Feed](http://feeds.trendmicro.com/TrendMicroResearch) | ✅ Fixed | Space/tech security |
| ~~**Threatpost**~~ | ~~`threatpost`~~ | ~~threats~~ | ~~Feed~~ | ❌ Disabled | ~~Browser security~~ |

**Recent Updates:**
- **SecurityWeek**: Updated RSS feed URL to FeedBurner (was returning 403 error)
- **Trend Micro Research**: Updated to correct RSS feed URL (old URL returned 404)
- **Threatpost**: Disabled - Site shut down in September 2022

### Static Image Assignments

Each source has a unique, high-quality Unsplash image (800x400px, quality 80):

```javascript
const staticImages = {
  thehackernews: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&q=80',
  bleepingcomputer: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=400&fit=crop&q=80',
  krebsonsecurity: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop&q=80',
  darkreading: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop&q=80',
  securityweek: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&q=80',
  csoonline: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop&q=80',
  trendmicro: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80'
  // Note: Threatpost disabled (site shut down Sept 2022)
};
```

### Adding New Sources

1. **Edit source configuration** (`src/config/sources.js`):
   ```javascript
   newsource: {
     id: 'newsource',
     name: 'New Source Name',
     url: 'https://newsource.com/rss',
     website: 'https://newsource.com',
     description: 'Source description',
     enabled: true,
     category: 'news'
   }
   ```

2. **Add static image** (`src/services/rssFeedService.js`):
   ```javascript
   const staticImages = {
     // ... existing images
     newsource: 'https://images.unsplash.com/photo-YOUR-IMAGE-ID?w=800&h=400&fit=crop&q=80'
   };
   ```

3. **Restart the server:**
   ```bash
   npm restart
   ```

4. **Test the new source:**
   ```bash
   curl http://localhost:3000/api/news/source/newsource
   ```

---

## 🗄️ Caching Strategy

### Overview

The backend uses `node-cache` for in-memory caching to significantly improve performance and reduce load on RSS feeds.

### Cache Configuration

- **TTL**: 15 minutes (900 seconds) - Configurable via `CACHE_TTL`
- **Check Period**: 2 minutes (120 seconds) - Automatic cleanup of expired keys
- **Storage**: In-memory (cleared on server restart)
- **Clone Strategy**: `useClones: false` for better performance

### Cache Keys

Cache keys are automatically generated based on the request URL:

```
__express__/api/news                          # All news
__express__/api/news/source/thehackernews    # Specific source
```

### Cache Behavior

1. **First Request** (Cache Miss):
   - Fetches data from all RSS feeds
   - Stores in cache with TTL
   - Returns data to client
   - Response time: ~2-5 seconds

2. **Subsequent Requests** (Cache Hit):
   - Returns cached data immediately
   - Response time: <100ms

3. **After TTL Expires**:
   - Cached data is automatically removed
   - Next request triggers fresh fetch

### Cache Management (Development)

**View statistics:**
```bash
curl http://localhost:3000/api/cache/stats
```

**List keys:**
```bash
curl http://localhost:3000/api/cache/keys
```

**Clear all cache:**
```bash
curl -X DELETE http://localhost:3000/api/cache/flush
```

### Performance Impact

- **Without Cache**: 2-5 seconds per request
- **With Cache**: <100ms per request
- **RSS Feed Load Reduction**: 98% (cached requests don't hit RSS feeds)

---

## 📝 Logging

### Winston Logger Configuration

The backend uses Winston for comprehensive, multi-level logging.

### Log Levels

```
error: 0    # Critical errors
warn: 1     # Warning messages
info: 2     # Informational messages
debug: 3    # Debug information
```

### Log Files

Logs are automatically written to the `logs/` directory:

| File | Content | Rotation |
|------|---------|----------|
| `combined.log` | All logs (info, warn, error, debug) | Manual |
| `error.log` | Error-level logs only | Manual |
| `exceptions.log` | Uncaught exceptions | Manual |
| `rejections.log` | Unhandled promise rejections | Manual |

### Viewing Logs

**Real-time monitoring:**
```bash
# All logs
tail -f logs/combined.log

# Errors only
tail -f logs/error.log

# Last 100 lines
tail -n 100 logs/combined.log

# Search for specific text
grep "error" logs/combined.log
```

**On Windows:**
```powershell
Get-Content logs\combined.log -Wait -Tail 10
```

### Log Level Control

Set log level via environment variable:

```bash
# Development (verbose)
LOG_LEVEL=debug npm run dev

# Production (minimal)
LOG_LEVEL=warn npm start
```

---

## 🔒 Security

### Implemented Security Features

#### 1. Helmet.js Security Headers

- **X-DNS-Prefetch-Control** - Controls DNS prefetching
- **X-Frame-Options** - Prevents clickjacking
- **X-Content-Type-Options** - Prevents MIME type sniffing
- **X-XSS-Protection** - Enables XSS filter
- **Strict-Transport-Security** - Forces HTTPS (production)

#### 2. Content Security Policy (CSP)

```javascript
{
  defaultSrc: ["'self'"],
  imgSrc: ["'self'", "data:", "https:", "http:"],
  scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
  fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
  connectSrc: ["'self'"]
}
```

#### 3. CORS Configuration

```javascript
{
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}
```

**Production:** Set `CORS_ORIGIN` to your domain:
```bash
CORS_ORIGIN=https://yourdomain.com
```

---

## 💻 Development

### Development Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/Rubelefsky/CyberSecNewsAggregrator.git
   cd CyberSecNewsAggregrator/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Development Tools

**Auto-reload with Nodemon:**
```bash
npm run dev
```

**Manual start:**
```bash
npm start
```

**Check for updates:**
```bash
npm outdated
```

**Security audit:**
```bash
npm audit
```

---

## 🧪 Testing

### Manual API Testing

```bash
# Health check
curl http://localhost:3000/api/health

# All news
curl http://localhost:3000/api/news

# Specific source
curl http://localhost:3000/api/news/source/thehackernews

# Source list
curl http://localhost:3000/api/news/sources

# Cache stats (dev only)
curl http://localhost:3000/api/cache/stats

# Clear cache (dev only)
curl -X DELETE http://localhost:3000/api/cache/flush
```

---

## 🚀 Deployment

### Production Deployment Checklist

#### 1. Environment Configuration
- [ ] Set `NODE_ENV=production`
- [ ] Configure `CORS_ORIGIN` with your domain
- [ ] Set appropriate `PORT`
- [ ] Set `LOG_LEVEL=warn` or `error`

#### 2. Security
- [ ] Enable HTTPS (SSL/TLS certificate)
- [ ] Configure firewall rules
- [ ] Review CORS settings

#### 3. Monitoring
- [ ] Set up log rotation
- [ ] Configure error alerting
- [ ] Monitor health endpoint

### Example PM2 Configuration

```bash
pm2 start src/server.js --name cybersec-news-api
pm2 save
pm2 startup
```

---

## ⚡ Performance

### Performance Metrics

- **Average Response Time (Cached):** <100ms
- **Average Response Time (Uncached):** 2-5 seconds
- **Cache Hit Rate:** 85-95% (typical)
- **RSS Feed Timeout:** 10 seconds

---

## 🔧 Troubleshooting

### Port Already in Use

**Linux/Mac:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Windows:**
```powershell
netstat -ano | findstr :3000
taskkill /F /PID <process_id>
```

### RSS Feed Errors

1. Check RSS URL in `src/config/sources.js`
2. Temporarily disable source: `enabled: false`
3. Check logs: `logs/error.log`

### Cache Issues

```bash
curl -X DELETE http://localhost:3000/api/cache/flush
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Open a Pull Request

---

## 📄 License

MIT License - see main project [LICENSE](../LICENSE) file

---

## 📞 Support

**GitHub Issues:**
https://github.com/Rubelefsky/CyberSecNewsAggregrator/issues

**Documentation:**
- [Main README](../README.md)
- [Troubleshooting Guide](../TROUBLESHOOTING.md)
- [Security Guidelines](../SECURITY.md)

---

<div align="center">

**Built with ❤️ for the cybersecurity community**

[⬆ Back to Top](#️-cybersec-news-aggregator---backend-api)

</div>
