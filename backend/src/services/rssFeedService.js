/**
 * RSS Feed Service
 * Handles fetching and parsing RSS feeds from cybersecurity news sources
 */

const Parser = require('rss-parser');
const axios = require('axios');
const logger = require('../config/logger');
const { getEnabledSources, getSourceById } = require('../config/sources');

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator']
    ]
  }
});

/**
 * Fetch and parse RSS feed from a single source
 */
const fetchSourceFeed = async (source) => {
  try {
    logger.info(`Fetching feed from ${source.name}...`);

    const feed = await parser.parseURL(source.url);

    const articles = feed.items.map(item => {
      // Extract image URL from various possible locations
      let imageUrl = null;

      if (item.enclosure && item.enclosure.url) {
        imageUrl = item.enclosure.url;
      } else if (item.media && item.media.$) {
        imageUrl = item.media.$.url;
      } else if (item.content && item.content.includes('<img')) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      } else if (item.contentEncoded && item.contentEncoded.includes('<img')) {
        const imgMatch = item.contentEncoded.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      // Fallback to a default cybersecurity image based on source
      if (!imageUrl) {
        imageUrl = getDefaultImage(source.id);
      }

      // Clean up description/content
      let description = item.contentSnippet || item.summary || item.content || '';
      description = description
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .trim()
        .substring(0, 300); // Limit to 300 characters

      if (description.length === 300) {
        description += '...';
      }

      return {
        id: generateArticleId(item.link),
        title: item.title,
        description,
        source: source.id,
        sourceName: source.name,
        url: item.link,
        imageUrl,
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        author: item.creator || item.author || null,
        categories: item.categories || []
      };
    });

    logger.info(`Successfully fetched ${articles.length} articles from ${source.name}`);

    return {
      success: true,
      source: source.id,
      articles,
      fetchedAt: new Date().toISOString()
    };

  } catch (error) {
    logger.error(`Error fetching feed from ${source.name}:`, error.message);

    return {
      success: false,
      source: source.id,
      error: error.message,
      articles: [],
      fetchedAt: new Date().toISOString()
    };
  }
};

/**
 * Fetch feeds from all enabled sources
 */
const fetchAllFeeds = async () => {
  const sources = getEnabledSources();

  logger.info(`Fetching feeds from ${sources.length} sources...`);

  const results = await Promise.allSettled(
    sources.map(source => fetchSourceFeed(source))
  );

  const feeds = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        source: sources[index].id,
        error: result.reason.message,
        articles: [],
        fetchedAt: new Date().toISOString()
      };
    }
  });

  const allArticles = feeds
    .filter(feed => feed.success)
    .flatMap(feed => feed.articles);

  // Sort by published date (newest first)
  allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const successCount = feeds.filter(f => f.success).length;
  const failureCount = feeds.filter(f => !f.success).length;

  logger.info(`Feed fetch complete: ${successCount} successful, ${failureCount} failed, ${allArticles.length} total articles`);

  return {
    articles: allArticles,
    sources: feeds,
    summary: {
      totalArticles: allArticles.length,
      successfulSources: successCount,
      failedSources: failureCount,
      fetchedAt: new Date().toISOString()
    }
  };
};

/**
 * Fetch feed from a specific source
 */
const fetchSpecificSource = async (sourceId) => {
  const source = getSourceById(sourceId);

  if (!source) {
    throw new Error(`Source not found: ${sourceId}`);
  }

  if (!source.enabled) {
    throw new Error(`Source is disabled: ${sourceId}`);
  }

  return await fetchSourceFeed(source);
};

/**
 * Generate unique article ID from URL
 */
const generateArticleId = (url) => {
  return Buffer.from(url).toString('base64').substring(0, 32);
};

/**
 * Get default image for a source
 */
const getDefaultImage = (sourceId) => {
  const defaultImages = {
    thehackernews: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    bleepingcomputer: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=400&fit=crop',
    krebsonsecurity: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop',
    darkreading: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop',
    threatpost: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=400&fit=crop',
    securityweek: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    csoonline: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop',
    trendmicro: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop'
  };

  return defaultImages[sourceId] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop';
};

module.exports = {
  fetchAllFeeds,
  fetchSpecificSource,
  fetchSourceFeed
};
