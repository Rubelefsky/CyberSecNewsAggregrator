/**
 * CyberSec News Aggregator - Backend Server
 * Main Express server with API endpoints for fetching cybersecurity news
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const logger = require('./config/logger');
const newsRoutes = require('./routes/newsRoutes');
const cache = require('./utils/cache');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ===================================
// Middleware
// ===================================

// Security headers with CSP configuration to allow external images
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

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../../')));

// ===================================
// API Routes
// ===================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  const cacheStats = cache.getStats();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    cache: {
      keys: cacheStats.keys,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.keys > 0
        ? ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(2) + '%'
        : '0%'
    }
  });
});

// News API routes
app.use('/api/news', newsRoutes);

// Cache management endpoints (for development)
if (NODE_ENV === 'development') {
  app.get('/api/cache/stats', (req, res) => {
    res.json({
      success: true,
      data: cache.getStats()
    });
  });

  app.get('/api/cache/keys', (req, res) => {
    res.json({
      success: true,
      data: cache.getKeys()
    });
  });

  app.delete('/api/cache/flush', (req, res) => {
    cache.flush();
    res.json({
      success: true,
      message: 'Cache flushed successfully'
    });
  });
}

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'CyberSec News Aggregator API',
    version: '1.0.0',
    description: 'REST API for aggregating cybersecurity news from multiple sources',
    endpoints: {
      health: {
        method: 'GET',
        path: '/api/health',
        description: 'Check API health and status'
      },
      allNews: {
        method: 'GET',
        path: '/api/news',
        description: 'Get all news articles from all sources'
      },
      sourceNews: {
        method: 'GET',
        path: '/api/news/source/:sourceId',
        description: 'Get news articles from a specific source'
      },
      sources: {
        method: 'GET',
        path: '/api/news/sources',
        description: 'Get list of all available news sources'
      },
      sourceInfo: {
        method: 'GET',
        path: '/api/news/sources/:sourceId',
        description: 'Get information about a specific source'
      }
    },
    documentation: 'https://github.com/Rubelefsky/CyberSecNewsAggregrator'
  });
});

// Serve frontend for any non-API routes
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../../index.html'));
  } else {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
      message: `The endpoint ${req.url} does not exist`
    });
  }
});

// ===================================
// Error Handling
// ===================================

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
    ...(NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===================================
// Server Startup
// ===================================

const server = app.listen(PORT, () => {
  logger.info('='.repeat(60));
  logger.info(`🛡️  CyberSec News Aggregator API`);
  logger.info('='.repeat(60));
  logger.info(`Environment: ${NODE_ENV}`);
  logger.info(`Server running on: http://localhost:${PORT}`);
  logger.info(`API endpoint: http://localhost:${PORT}/api`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
  logger.info('='.repeat(60));
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed');

    // Clear cache
    cache.flush();
    logger.info('Cache cleared');

    logger.info('Graceful shutdown complete');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
