/**
 * Cache Utility
 * In-memory caching using node-cache for improved performance
 */

const NodeCache = require('node-cache');
const logger = require('../config/logger');

// Cache TTL from environment or default to 15 minutes (900 seconds)
const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 900;

// Create cache instance
const cache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false // Don't clone objects for better performance
});

/**
 * Get value from cache
 */
const get = (key) => {
  try {
    const value = cache.get(key);
    if (value) {
      logger.debug(`Cache hit for key: ${key}`);
      return value;
    }
    logger.debug(`Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    logger.error(`Error getting cache key ${key}:`, error.message);
    return null;
  }
};

/**
 * Set value in cache
 */
const set = (key, value, ttl = CACHE_TTL) => {
  try {
    const success = cache.set(key, value, ttl);
    if (success) {
      logger.debug(`Cache set for key: ${key} (TTL: ${ttl}s)`);
    }
    return success;
  } catch (error) {
    logger.error(`Error setting cache key ${key}:`, error.message);
    return false;
  }
};

/**
 * Delete value from cache
 */
const del = (key) => {
  try {
    const count = cache.del(key);
    if (count > 0) {
      logger.debug(`Cache deleted for key: ${key}`);
    }
    return count;
  } catch (error) {
    logger.error(`Error deleting cache key ${key}:`, error.message);
    return 0;
  }
};

/**
 * Clear all cache
 */
const flush = () => {
  try {
    cache.flushAll();
    logger.info('Cache flushed');
    return true;
  } catch (error) {
    logger.error('Error flushing cache:', error.message);
    return false;
  }
};

/**
 * Get cache statistics
 */
const getStats = () => {
  return cache.getStats();
};

/**
 * Get all cache keys
 */
const getKeys = () => {
  return cache.keys();
};

/**
 * Cache middleware for Express routes
 */
const cacheMiddleware = (duration = CACHE_TTL) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = get(key);

    if (cachedResponse) {
      logger.debug(`Serving cached response for: ${req.originalUrl}`);
      return res.json(cachedResponse);
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (data) => {
      set(key, data, duration);
      return originalJson(data);
    };

    next();
  };
};

// Log cache events
cache.on('set', (key, value) => {
  logger.debug(`Cache event: set - ${key}`);
});

cache.on('del', (key, value) => {
  logger.debug(`Cache event: del - ${key}`);
});

cache.on('expired', (key, value) => {
  logger.debug(`Cache event: expired - ${key}`);
});

cache.on('flush', () => {
  logger.debug('Cache event: flush');
});

module.exports = {
  get,
  set,
  del,
  flush,
  getStats,
  getKeys,
  cacheMiddleware
};
