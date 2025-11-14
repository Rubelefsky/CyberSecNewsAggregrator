# CyberSec News Aggregator - Usage Guide

## Overview

The CyberSec News Aggregator is a modern, responsive web application that consolidates cybersecurity news from multiple sources into a single, easy-to-use interface.

## Features

### 🔍 Search Functionality
- Real-time search across article titles, descriptions, and sources
- Instant filtering as you type
- Clear button to reset search

### 🎯 Source Filtering
Filter news by specific cybersecurity sources:
- The Hacker News
- Bleeping Computer
- Krebs on Security
- Dark Reading
- SecurityWeek
- CSO Online
- Trend Micro Research

### 📊 Sorting Options
Sort articles by:
- **Newest First** (default) - Most recent articles appear first
- **Oldest First** - Historical articles shown first
- **Title (A-Z)** - Alphabetical sorting by title

### 🔄 Refresh
- Manual refresh button to reload the latest news
- Automatic timestamp showing last update time
- Visual feedback during refresh

### 📱 Responsive Design
- Fully responsive layout works on all devices
- Mobile-optimized navigation and controls
- Touch-friendly interface

## How to Use

### Opening the Application

**Full Stack Setup (Recommended):**
1. Start the backend server:
   ```bash
   cd backend
   npm install
   npm start
   ```
2. Open `http://localhost:3000` in your browser
3. The application will load real-time cybersecurity news from 7 RSS feeds

**Frontend Only (Sample Data):**
1. Open `index.html` directly in any modern web browser
2. The page will display sample cybersecurity news articles

### Searching for Articles
1. Click on the search bar at the top
2. Type keywords related to what you're looking for
3. Results filter automatically as you type
4. Click the X button to clear your search

### Filtering by Source
1. Use the "Filter by Source" dropdown
2. Select a specific news source or "All Sources"
3. The news grid updates immediately

### Sorting Articles
1. Use the "Sort by" dropdown
2. Choose your preferred sorting method
3. Articles reorganize automatically

### Reading Articles
1. Click "Read More" on any article card
2. Opens the full article in a new tab
3. Original source is preserved

### Refreshing News
1. Click the refresh button (🔄 icon)
2. Wait for the animation to complete
3. News updates with latest articles

## Technical Details

### Files Structure
```
CyberSecNewsAggregrator/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript functionality
├── README.md           # Project overview
└── USAGE.md           # This file
```

### Current Implementation
- **Frontend**: Vanilla HTML, CSS, and JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **RSS Parser**: rss-parser for feed aggregation
- **Caching**: node-cache with 15-minute TTL
- **Security**: Helmet.js with CSP, CORS configuration
- **Logging**: Winston multi-level logging
- **Icons**: Font Awesome 6.4.0
- **Images**: Static Unsplash CDN images (high-quality, reliable)
- **Data**: Real-time RSS feeds from 7 cybersecurity sources

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

## Implemented Features ✅

1. ✅ **API Integration**: Connected to real RSS feeds from 7 cybersecurity sources
2. ✅ **Backend Service**: Node.js/Express backend for aggregating news
3. ✅ **Caching**: In-memory cache with 15-minute TTL
4. ✅ **Security Hardening**: Helmet.js, CORS, CSP, rate limiting
5. ✅ **Comprehensive Logging**: Winston logging with multiple levels

## Future Enhancements

### Planned Features
1. **Database**: Persistent storage with MongoDB or PostgreSQL
2. **Notifications**: Alert users to breaking security news
3. **User Authentication**: Personal accounts and saved preferences
5. **Bookmarks**: Save articles for later reading
6. **Dark/Light Mode Toggle**: User preference for themes
7. **Export**: Download articles as PDF or email digest
8. **Categories**: Filter by threat types (malware, ransomware, vulnerabilities, etc.)
9. **Advanced Search**: Boolean operators, date ranges, keyword highlighting

### API Integration Guide

To connect real news sources, modify `script.js`:

```javascript
// Example: Fetching from a real API
async function fetchFromAPI(source) {
    try {
        const response = await fetch(`/api/news/${source}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}
```

### RSS Feed Integration

```javascript
// Example: Parsing RSS feeds
async function fetchRSSFeed(feedUrl) {
    const response = await fetch(`/api/rss?url=${encodeURIComponent(feedUrl)}`);
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    // Parse XML and return article data
}
```

## Customization

### Adding New News Sources

1. Open `index.html`
2. Add a new option to the source filter dropdown:
```html
<option value="newsource">New Source Name</option>
```

3. Open `script.js`
4. Add sample data or API configuration:
```javascript
const newsSourceConfigs = {
    newsource: {
        name: 'New Source Name',
        rssUrl: 'https://newsource.com/rss',
        apiUrl: null
    }
};
```

### Styling Customization

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-bg: #0a0e27;      /* Main background */
    --accent-color: #00d9ff;     /* Primary accent color */
    --text-primary: #ffffff;     /* Primary text color */
    /* ... more variables ... */
}
```

## Troubleshooting

### Articles Not Loading
- Check browser console for errors
- Ensure all files are in the same directory
- Verify internet connection (for external resources)

### Search Not Working
- Clear browser cache
- Check browser console for JavaScript errors
- Ensure script.js is loaded correctly

### Images Not Displaying
- Images use Unsplash API - requires internet connection
- Fallback image loads if primary fails
- Check network tab in browser developer tools

## Performance Tips

1. **Loading Time**: Initial load displays 12 sample articles
2. **Search**: Debounced by 300ms for smooth performance
3. **Caching**: Browser caches CSS and JS files
4. **Images**: Lazy loading can be added for better performance

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatible
- Focus indicators for keyboard users

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Open an issue on the project repository

## License

This project is part of the CyberSec News Aggregator initiative.
