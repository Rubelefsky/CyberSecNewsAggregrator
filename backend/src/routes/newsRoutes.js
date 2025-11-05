/**
 * News API Routes
 */

const express = require('express');
const router = express.Router();
const logger = require('../config/logger');
const { cacheMiddleware } = require('../utils/cache');
const rssFeedService = require('../services/rssFeedService');
const { getEnabledSources, getSourceById } = require('../config/sources');

/**
 * GET /api/news
 * Fetch all news articles from all sources
 */
router.get('/', cacheMiddleware(900), async (req, res) => {
  try {
    logger.info('Fetching all news articles...');

    const result = await rssFeedService.fetchAllFeeds();

    res.json({
      success: true,
      data: result.articles,
      meta: result.summary
    });

  } catch (error) {
    logger.error('Error fetching all news:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch news articles',
      message: error.message
    });
  }
});

/**
 * GET /api/news/source/:sourceId
 * Fetch news articles from a specific source
 */
router.get('/source/:sourceId', cacheMiddleware(900), async (req, res) => {
  try {
    const { sourceId } = req.params;

    logger.info(`Fetching news from source: ${sourceId}`);

    const result = await rssFeedService.fetchSpecificSource(sourceId);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: `Failed to fetch news from ${sourceId}`,
        message: result.error
      });
    }

    res.json({
      success: true,
      data: result.articles,
      meta: {
        source: result.source,
        count: result.articles.length,
        fetchedAt: result.fetchedAt
      }
    });

  } catch (error) {
    logger.error(`Error fetching news from source:`, error);

    res.status(error.message.includes('not found') ? 404 : 500).json({
      success: false,
      error: error.message,
      message: 'Failed to fetch news from source'
    });
  }
});

/**
 * GET /api/news/sources
 * Get list of all available news sources
 */
router.get('/sources', (req, res) => {
  try {
    const sources = getEnabledSources();

    res.json({
      success: true,
      data: sources.map(source => ({
        id: source.id,
        name: source.name,
        website: source.website,
        description: source.description,
        category: source.category
      })),
      meta: {
        count: sources.length
      }
    });

  } catch (error) {
    logger.error('Error fetching sources:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch news sources',
      message: error.message
    });
  }
});

/**
 * GET /api/news/sources/:sourceId
 * Get information about a specific source
 */
router.get('/sources/:sourceId', (req, res) => {
  try {
    const { sourceId } = req.params;
    const source = getSourceById(sourceId);

    if (!source) {
      return res.status(404).json({
        success: false,
        error: 'Source not found',
        message: `No source found with ID: ${sourceId}`
      });
    }

    res.json({
      success: true,
      data: {
        id: source.id,
        name: source.name,
        website: source.website,
        description: source.description,
        category: source.category,
        enabled: source.enabled
      }
    });

  } catch (error) {
    logger.error('Error fetching source info:', error);

    res.status(500).json({
      success: false,
      error: 'Failed to fetch source information',
      message: error.message
    });
  }
});

module.exports = router;
