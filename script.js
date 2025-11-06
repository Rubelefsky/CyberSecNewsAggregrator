// ===================================
// Configuration
// ===================================

const API_BASE_URL = 'http://localhost:3000';
const USE_BACKEND = true; // Set to false to use sample data

// ===================================
// Global State Management
// ===================================

const state = {
    allArticles: [],
    filteredArticles: [],
    currentSource: 'all',
    currentSort: 'date-desc',
    searchQuery: '',
    isLoading: false,
    error: null
};

// ===================================
// Sample News Data
// Note: In production, this would be replaced with actual API calls
// ===================================

const sampleNews = [
    {
        id: 1,
        title: "Critical Zero-Day Vulnerability Discovered in Popular VPN Software",
        description: "Security researchers have identified a critical zero-day vulnerability affecting millions of VPN users worldwide. The flaw allows remote code execution without authentication.",
        source: "thehackernews",
        sourceName: "The Hacker News",
        url: "https://thehackernews.com",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2,
        title: "Ransomware Gang Targets Healthcare Sector with New Tactics",
        description: "A sophisticated ransomware group has been observed deploying new techniques specifically designed to breach healthcare organizations, putting patient data at risk.",
        source: "bleepingcomputer",
        sourceName: "Bleeping Computer",
        url: "https://www.bleepingcomputer.com",
        imageUrl: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 3,
        title: "FBI Warns of Increase in Business Email Compromise Attacks",
        description: "The FBI has issued a warning about a significant uptick in business email compromise (BEC) attacks, with losses exceeding $2 billion in the past year alone.",
        source: "krebsonsecurity",
        sourceName: "Krebs on Security",
        url: "https://krebsonsecurity.com",
        imageUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 4,
        title: "New Malware Campaign Exploits Microsoft Office Macros",
        description: "Cybersecurity experts have uncovered a widespread malware campaign that leverages malicious Microsoft Office macros to deliver banking trojans and information stealers.",
        source: "darkreading",
        sourceName: "Dark Reading",
        url: "https://www.darkreading.com",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 5,
        title: "Chrome Browser Update Patches 15 Security Vulnerabilities",
        description: "Google has released an emergency update for Chrome browser addressing 15 security vulnerabilities, including several high-severity flaws that could lead to remote code execution.",
        source: "threatpost",
        sourceName: "Threatpost",
        url: "https://threatpost.com",
        imageUrl: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 6,
        title: "Supply Chain Attack Compromises Software Development Tool",
        description: "A supply chain attack has been discovered affecting a widely-used software development tool, potentially exposing thousands of companies to backdoor implants.",
        source: "securityweek",
        sourceName: "SecurityWeek",
        url: "https://www.securityweek.com",
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 7,
        title: "Hackers Exploit IoT Devices to Launch DDoS Attacks",
        description: "Security researchers have identified a botnet comprising millions of compromised IoT devices being used to launch devastating distributed denial-of-service attacks.",
        source: "thehackernews",
        sourceName: "The Hacker News",
        url: "https://thehackernews.com",
        imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 8,
        title: "Critical Infrastructure Targeted in State-Sponsored Cyber Campaign",
        description: "Government agencies have warned about an ongoing state-sponsored cyber campaign targeting critical infrastructure sectors including energy, water, and transportation.",
        source: "bleepingcomputer",
        sourceName: "Bleeping Computer",
        url: "https://www.bleepingcomputer.com",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 9,
        title: "New Phishing Technique Bypasses Multi-Factor Authentication",
        description: "Cybercriminals have developed a sophisticated phishing technique that can bypass multi-factor authentication, putting even security-conscious users at risk.",
        source: "krebsonsecurity",
        sourceName: "Krebs on Security",
        url: "https://krebsonsecurity.com",
        imageUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 10,
        title: "Data Breach Exposes Personal Information of 50 Million Users",
        description: "A major data breach has been disclosed affecting a popular social media platform, exposing personal information including names, emails, and phone numbers of 50 million users.",
        source: "darkreading",
        sourceName: "Dark Reading",
        url: "https://www.darkreading.com",
        imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 11,
        title: "Security Patch Released for Critical Linux Kernel Vulnerability",
        description: "Linux maintainers have released an urgent security patch addressing a critical vulnerability in the kernel that could allow privilege escalation on affected systems.",
        source: "threatpost",
        sourceName: "Threatpost",
        url: "https://threatpost.com",
        imageUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 12,
        title: "Cryptocurrency Exchange Loses $100M in Security Breach",
        description: "A major cryptocurrency exchange has confirmed a security breach resulting in the loss of approximately $100 million worth of digital assets from user wallets.",
        source: "securityweek",
        sourceName: "SecurityWeek",
        url: "https://www.securityweek.com",
        imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&h=400&fit=crop&q=80",
        publishedAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString()
    }
];

// ===================================
// DOM Elements
// ===================================

const elements = {
    newsGrid: document.getElementById('newsGrid'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    noResults: document.getElementById('noResults'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    sourceFilter: document.getElementById('sourceFilter'),
    sortBy: document.getElementById('sortBy'),
    refreshBtn: document.getElementById('refreshBtn'),
    articleCount: document.getElementById('articleCount'),
    lastUpdated: document.getElementById('lastUpdated')
};

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    attachEventListeners();
});

function initializeApp() {
    showLoading();
    setTimeout(() => {
        loadNews();
    }, 1000);
}

// ===================================
// Event Listeners
// ===================================

function attachEventListeners() {
    // Search functionality
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    elements.clearSearch.addEventListener('click', clearSearch);

    // Filter and sort
    elements.sourceFilter.addEventListener('change', handleSourceFilter);
    elements.sortBy.addEventListener('change', handleSort);

    // Refresh button
    elements.refreshBtn.addEventListener('click', handleRefresh);
}

// ===================================
// News Loading and Display
// ===================================

async function loadNews() {
    try {
        state.isLoading = true;

        if (USE_BACKEND) {
            // Fetch from backend API
            const endpoint = state.currentSource === 'all'
                ? `${API_BASE_URL}/api/news`
                : `${API_BASE_URL}/api/news/source/${state.currentSource}`;

            const response = await fetch(endpoint);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to fetch news');
            }

            state.allArticles = result.data;
            state.filteredArticles = [...result.data];

        } else {
            // Use sample data
            state.allArticles = [...sampleNews];
            state.filteredArticles = [...sampleNews];
        }

        applyFiltersAndSort();
        displayNews();
        updateStats();
        hideLoading();
        state.error = null;

    } catch (error) {
        console.error('Error loading news:', error);
        state.error = error.message;

        // Fallback to sample data if backend fails
        if (USE_BACKEND && sampleNews.length > 0) {
            console.warn('Backend failed, falling back to sample data');
            state.allArticles = [...sampleNews];
            state.filteredArticles = [...sampleNews];
            applyFiltersAndSort();
            displayNews();
            updateStats();
            hideLoading();
            showWarning('Using cached news. Backend server may be unavailable.');
        } else {
            showError('Failed to load news articles. Please try again later.');
            hideLoading();
        }
    } finally {
        state.isLoading = false;
    }
}

function displayNews() {
    elements.newsGrid.innerHTML = '';

    if (state.filteredArticles.length === 0) {
        elements.noResults.style.display = 'block';
        elements.newsGrid.style.display = 'none';
        return;
    }

    elements.noResults.style.display = 'none';
    elements.newsGrid.style.display = 'grid';

    state.filteredArticles.forEach(article => {
        const card = createNewsCard(article);
        elements.newsGrid.appendChild(card);
    });
}

function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.setAttribute('data-article-id', article.id);

    const formattedDate = formatDate(article.publishedAt);
    
    // Use static Unsplash image - always reliable
    const imageUrl = article.imageUrl || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&q=80';

    card.innerHTML = `
        <div class="news-card-header">
            <img
                src="${escapeHtml(imageUrl)}"
                alt="${escapeHtml(article.title)}"
                class="news-card-image"
                onerror="this.src='https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop&q=80'"
            >
            <span class="news-card-source">${escapeHtml(article.sourceName)}</span>
        </div>
        <div class="news-card-body">
            <h3 class="news-card-title">${escapeHtml(article.title)}</h3>
            <p class="news-card-description">${escapeHtml(article.description)}</p>
            <div class="news-card-footer">
                <span class="news-card-date">
                    <i class="far fa-clock"></i>
                    ${formattedDate}
                </span>
                <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="news-card-link">
                    Read More
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;

    return card;
}

// ===================================
// Filtering and Sorting
// ===================================

function applyFiltersAndSort() {
    let filtered = [...state.allArticles];

    // Apply search filter
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(article =>
            article.title.toLowerCase().includes(query) ||
            article.description.toLowerCase().includes(query) ||
            article.sourceName.toLowerCase().includes(query)
        );
    }

    // Apply source filter
    if (state.currentSource !== 'all') {
        filtered = filtered.filter(article => article.source === state.currentSource);
    }

    // Apply sorting
    filtered.sort((a, b) => {
        switch (state.currentSort) {
            case 'date-desc':
                return new Date(b.publishedAt) - new Date(a.publishedAt);
            case 'date-asc':
                return new Date(a.publishedAt) - new Date(b.publishedAt);
            case 'title':
                return a.title.localeCompare(b.title);
            default:
                return 0;
        }
    });

    state.filteredArticles = filtered;
}

function handleSearch(event) {
    state.searchQuery = event.target.value;
    applyFiltersAndSort();
    displayNews();
    updateStats();
}

function clearSearch() {
    elements.searchInput.value = '';
    state.searchQuery = '';
    applyFiltersAndSort();
    displayNews();
    updateStats();
}

function handleSourceFilter(event) {
    state.currentSource = event.target.value;

    // If using backend and filtering by source, reload from specific endpoint
    if (USE_BACKEND && state.currentSource !== 'all') {
        showLoading();
        loadNews();
    } else {
        applyFiltersAndSort();
        displayNews();
        updateStats();
    }
}

function handleSort(event) {
    state.currentSort = event.target.value;
    applyFiltersAndSort();
    displayNews();
}

// ===================================
// Refresh Functionality
// ===================================

function handleRefresh() {
    const refreshIcon = elements.refreshBtn.querySelector('i');
    refreshIcon.classList.add('spinning');
    elements.refreshBtn.disabled = true;

    showLoading();

    setTimeout(() => {
        loadNews();
        refreshIcon.classList.remove('spinning');
        elements.refreshBtn.disabled = false;
    }, 1500);
}

// ===================================
// UI State Management
// ===================================

function showLoading() {
    elements.loadingSpinner.style.display = 'block';
    elements.newsGrid.style.display = 'none';
    elements.errorMessage.style.display = 'none';
    elements.noResults.style.display = 'none';
}

function hideLoading() {
    elements.loadingSpinner.style.display = 'none';
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.style.display = 'block';
    elements.newsGrid.style.display = 'none';
    elements.noResults.style.display = 'none';
}

function showWarning(message) {
    console.warn('Warning:', message);
    // Could add a toast notification here in the future
}

function updateStats() {
    elements.articleCount.textContent = state.filteredArticles.length;
    elements.lastUpdated.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===================================
// Utility Functions
// ===================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// API Integration (for future use)
// ===================================

/**
 * This section is prepared for future API integration
 * Replace the sampleNews data with actual API calls
 */

async function fetchFromAPI(source) {
    // Example structure for API integration
    // const response = await fetch(`/api/news/${source}`);
    // const data = await response.json();
    // return data;

    // For now, return sample data
    return sampleNews.filter(article =>
        source === 'all' ? true : article.source === source
    );
}

/**
 * RSS Feed parser (for future implementation)
 */
function parseRSSFeed(xmlString) {
    // Implementation for parsing RSS feeds from various sources
    // This would convert RSS XML to our article format
}

/**
 * News source configurations (for future use)
 */
const newsSourceConfigs = {
    thehackernews: {
        name: 'The Hacker News',
        rssUrl: 'https://feeds.feedburner.com/TheHackersNews',
        apiUrl: null
    },
    bleepingcomputer: {
        name: 'Bleeping Computer',
        rssUrl: 'https://www.bleepingcomputer.com/feed/',
        apiUrl: null
    },
    krebsonsecurity: {
        name: 'Krebs on Security',
        rssUrl: 'https://krebsonsecurity.com/feed/',
        apiUrl: null
    },
    darkreading: {
        name: 'Dark Reading',
        rssUrl: 'https://www.darkreading.com/rss.xml',
        apiUrl: null
    },
    threatpost: {
        name: 'Threatpost',
        rssUrl: 'https://threatpost.com/feed/',
        apiUrl: null
    },
    securityweek: {
        name: 'SecurityWeek',
        rssUrl: 'https://www.securityweek.com/feed',
        apiUrl: null
    }
};
