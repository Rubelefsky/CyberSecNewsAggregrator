# CyberSec News Aggregator - Backend API

REST API for aggregating cybersecurity news from multiple RSS feeds.

## Overview

This backend service fetches cybersecurity news from multiple trusted sources, parses RSS feeds, and provides a unified REST API for the frontend to consume.

## Features

- **RSS Feed Aggregation**: Fetches news from 8+ cybersecurity sources
- **Caching**: 15-minute cache to reduce load and improve performance
- **CORS Enabled**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling and logging
- **Security**: Helmet.js for security headers
- **Graceful Shutdown**: Proper cleanup on termination
- **Health Checks**: Built-in health check endpoint

## Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **RSS Parser**: rss-parser
- **Caching**: node-cache
- **Logging**: Winston
- **Security**: Helmet.js, CORS
- **Environment**: dotenv

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and adjust settings:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
CACHE_TTL=900
LOG_LEVEL=info
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### Health Check

Check if the API is running and view cache statistics.

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-05T10:00:00.000Z",
  "uptime": 123.456,
  "environment": "development",
  "cache": {
    "keys": 5,
    "hits": 42,
    "misses": 8,
    "hitRate": "84.00%"
  }
}
```

### Get All News

Fetch all news articles from all sources.

```http
GET /api/news
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "YWJjZGVmZ2hpamtsbW5vcA==",
      "title": "Critical Zero-Day Vulnerability...",
      "description": "Security researchers have identified...",
      "source": "thehackernews",
      "sourceName": "The Hacker News",
      "url": "https://thehackernews.com/...",
      "imageUrl": "https://...",
      "publishedAt": "2025-11-05T09:30:00.000Z",
      "author": "John Doe",
      "categories": ["security", "vulnerability"]
    }
  ],
  "meta": {
    "totalArticles": 50,
    "successfulSources": 8,
    "failedSources": 0,
    "fetchedAt": "2025-11-05T10:00:00.000Z"
  }
}
```

### Get News from Specific Source

Fetch news articles from a single source.

```http
GET /api/news/source/:sourceId
```

**Parameters:**
- `sourceId` - One of: `thehackernews`, `bleepingcomputer`, `krebsonsecurity`, `darkreading`, `threatpost`, `securityweek`, `csoonline`, `trendmicro`

**Example:**
```http
GET /api/news/source/thehackernews
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "source": "thehackernews",
    "count": 10,
    "fetchedAt": "2025-11-05T10:00:00.000Z"
  }
}
```

### Get Available Sources

List all available news sources.

```http
GET /api/news/sources
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "thehackernews",
      "name": "The Hacker News",
      "website": "https://thehackernews.com",
      "description": "Latest cybersecurity news and analysis",
      "category": "news"
    }
  ],
  "meta": {
    "count": 8
  }
}
```

### Get Source Information

Get detailed information about a specific source.

```http
GET /api/news/sources/:sourceId
```

**Example:**
```http
GET /api/news/sources/thehackernews
```

### Cache Management (Development Only)

These endpoints are only available when `NODE_ENV=development`:

**Get Cache Statistics:**
```http
GET /api/cache/stats
```

**Get Cache Keys:**
```http
GET /api/cache/keys
```

**Clear Cache:**
```http
DELETE /api/cache/flush
```

## News Sources

Currently aggregating from:

| Source | ID | RSS Feed |
|--------|-------|----------|
| The Hacker News | `thehackernews` | https://feeds.feedburner.com/TheHackersNews |
| Bleeping Computer | `bleepingcomputer` | https://www.bleepingcomputer.com/feed/ |
| Krebs on Security | `krebsonsecurity` | https://krebsonsecurity.com/feed/ |
| Dark Reading | `darkreading` | https://www.darkreading.com/rss.xml |
| Threatpost | `threatpost` | https://threatpost.com/feed/ |
| SecurityWeek | `securityweek` | https://www.securityweek.com/feed |
| CSO Online | `csoonline` | https://www.csoonline.com/feed |
| Trend Micro | `trendmicro` | https://www.trendmicro.com/en_us/research.rss.xml |

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── logger.js         # Winston logging configuration
│   │   └── sources.js        # News source configurations
│   ├── routes/
│   │   └── newsRoutes.js     # API route handlers
│   ├── services/
│   │   └── rssFeedService.js # RSS feed fetching and parsing
│   ├── utils/
│   │   └── cache.js          # Caching utilities
│   └── server.js             # Main Express server
├── logs/                     # Application logs (auto-created)
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .gitignore
├── package.json
└── README.md
```

## Caching Strategy

- **Default TTL**: 15 minutes (900 seconds)
- **Cache Key Format**: `__express__/api/news` (based on request URL)
- **Automatic Expiration**: Expired entries are automatically removed
- **Performance**: Significantly reduces API response time and RSS feed requests

## Error Handling

The API uses standard HTTP status codes:

- `200 OK` - Request successful
- `404 Not Found` - Source or endpoint not found
- `500 Internal Server Error` - Server error

Error responses include:
```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections
- Console (with colors in development)

## Development

### Running with Nodemon

For automatic restarts during development:

```bash
npm run dev
```

### Testing Endpoints

Use curl or any HTTP client:

```bash
# Health check
curl http://localhost:3000/api/health

# Get all news
curl http://localhost:3000/api/news

# Get specific source
curl http://localhost:3000/api/news/source/thehackernews

# Get sources list
curl http://localhost:3000/api/news/sources
```

### Adding New Sources

1. Edit `src/config/sources.js`
2. Add new source configuration:

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

3. Restart the server

## Performance Optimization

- **Caching**: 15-minute cache reduces repeated RSS fetches
- **Parallel Fetching**: All sources fetched simultaneously
- **Timeout Handling**: 10-second timeout per RSS feed
- **Error Isolation**: Failed sources don't block others

## Security

- **Helmet.js**: Security headers
- **CORS**: Configurable origin restrictions
- **Input Validation**: Request parameter validation
- **Error Sanitization**: No sensitive data in production errors

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Configure proper `CORS_ORIGIN`
3. Set appropriate `PORT`
4. Ensure log directory permissions
5. Set `LOG_LEVEL=warn` or `LOG_LEVEL=error`
6. Use a process manager (PM2, systemd)

### Example PM2 Configuration

```bash
pm2 start src/server.js --name cybersec-news-api
pm2 save
pm2 startup
```

## Troubleshooting

### RSS Feed Errors

If a source fails:
1. Check the RSS URL in `src/config/sources.js`
2. Test the URL manually in a browser
3. Check logs for specific error messages
4. Temporarily disable the source by setting `enabled: false`

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Cache Issues

Clear the cache in development:
```bash
curl -X DELETE http://localhost:3000/api/cache/flush
```

## Contributing

1. Follow existing code structure
2. Add JSDoc comments for functions
3. Update this README for new features
4. Test all endpoints before committing

## License

MIT License - see main project LICENSE file

## Support

For issues or questions, open an issue on GitHub:
https://github.com/Rubelefsky/CyberSecNewsAggregrator/issues
