/**
 * News Source Configurations
 * Contains RSS feed URLs and metadata for all cybersecurity news sources
 */

const newsSources = {
  thehackernews: {
    id: 'thehackernews',
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    website: 'https://thehackernews.com',
    description: 'Latest cybersecurity news and analysis',
    enabled: true,
    category: 'news'
  },
  bleepingcomputer: {
    id: 'bleepingcomputer',
    name: 'Bleeping Computer',
    url: 'https://www.bleepingcomputer.com/feed/',
    website: 'https://www.bleepingcomputer.com',
    description: 'Tech news and security guides',
    enabled: true,
    category: 'news'
  },
  krebsonsecurity: {
    id: 'krebsonsecurity',
    name: 'Krebs on Security',
    url: 'https://krebsonsecurity.com/feed/',
    website: 'https://krebsonsecurity.com',
    description: 'In-depth security investigations',
    enabled: true,
    category: 'analysis'
  },
  darkreading: {
    id: 'darkreading',
    name: 'Dark Reading',
    url: 'https://www.darkreading.com/rss.xml',
    website: 'https://www.darkreading.com',
    description: 'Cybersecurity intelligence',
    enabled: true,
    category: 'news'
  },
  threatpost: {
    id: 'threatpost',
    name: 'Threatpost',
    url: 'https://threatpost.com/feed/',
    website: 'https://threatpost.com',
    description: 'Latest security threats and vulnerabilities',
    enabled: false, // Site shut down in September 2022
    category: 'threats'
  },
  securityweek: {
    id: 'securityweek',
    name: 'SecurityWeek',
    url: 'https://feeds.feedburner.com/securityweek',
    website: 'https://www.securityweek.com',
    description: 'Enterprise security news',
    enabled: true,
    category: 'news'
  },
  csoonline: {
    id: 'csoonline',
    name: 'CSO Online',
    url: 'https://www.csoonline.com/feed',
    website: 'https://www.csoonline.com',
    description: 'Security and risk management',
    enabled: true,
    category: 'analysis'
  },
  trendmicro: {
    id: 'trendmicro',
    name: 'Trend Micro Research',
    url: 'http://feeds.trendmicro.com/TrendMicroResearch',
    website: 'https://www.trendmicro.com',
    description: 'Security research and insights',
    enabled: true,
    category: 'research'
  }
};

/**
 * Get all enabled news sources
 */
const getEnabledSources = () => {
  return Object.values(newsSources).filter(source => source.enabled);
};

/**
 * Get source by ID
 */
const getSourceById = (id) => {
  return newsSources[id] || null;
};

/**
 * Get sources by category
 */
const getSourcesByCategory = (category) => {
  return Object.values(newsSources).filter(
    source => source.enabled && source.category === category
  );
};

module.exports = {
  newsSources,
  getEnabledSources,
  getSourceById,
  getSourcesByCategory
};
