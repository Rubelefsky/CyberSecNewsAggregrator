# 🛡️ CyberSec News Aggregator

A modern, responsive web application that aggregates cybersecurity news from multiple trusted sources into a single, unified interface. Stay informed about the latest security threats, vulnerabilities, and industry developments all in one place.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)

## 📋 Overview

The CyberSec News Aggregator is a full-stack web application that consolidates cybersecurity news from leading security publications and blogs. It features a modern frontend interface and a robust backend API that fetches and aggregates news from multiple RSS feeds in real-time, providing security professionals, researchers, and enthusiasts with a centralized hub for staying current with the latest threats, vulnerabilities, and security trends.

## ✨ Features

### Frontend Features
- **🔍 Real-time Search**: Instantly search across all articles by title, description, or source
- **🎯 Source Filtering**: Filter news by specific cybersecurity publications
- **📊 Smart Sorting**: Sort articles by date or title for easy navigation
- **🔄 Auto-Refresh**: Manually refresh to get the latest news updates
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, cybersecurity-themed dark interface
- **⚡ Fast Performance**: Optimized loading and smooth interactions
- **♿ Accessible**: WCAG compliant with keyboard navigation support

### Backend Features
- **📡 RSS Aggregation**: Fetches news from 8+ cybersecurity sources
- **⚡ Caching**: 15-minute cache for improved performance
- **🔒 Security**: CORS support and Helmet.js security headers
- **📝 Logging**: Comprehensive Winston logging system
- **🏥 Health Checks**: Built-in health monitoring endpoint
- **🛡️ Error Handling**: Graceful error handling and recovery
- **🔌 RESTful API**: Clean, documented API endpoints

## 🎯 Supported News Sources

Currently aggregating from 8 major cybersecurity sources:
- **The Hacker News** - Latest cybersecurity news and analysis
- **Bleeping Computer** - Tech news and security guides
- **Krebs on Security** - In-depth security investigations
- **Dark Reading** - Cybersecurity intelligence
- **Threatpost** - Latest security threats and vulnerabilities
- **SecurityWeek** - Enterprise security news
- **CSO Online** - Security and risk management
- **Trend Micro** - Security research and insights

## 🚀 Quick Start

### Option 1: Frontend Only (Sample Data)

**Prerequisites**: Any modern web browser

1. Clone the repository:
```bash
git clone https://github.com/Rubelefsky/CyberSecNewsAggregrator.git
cd CyberSecNewsAggregrator
```

2. Open `index.html` in your browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

The frontend will display sample news data. Perfect for testing the UI!

### Option 2: Full Stack (Live RSS Feeds)

**Prerequisites**: Node.js v16+ and npm

1. Clone and navigate to the repository:
```bash
git clone https://github.com/Rubelefsky/CyberSecNewsAggregrator.git
cd CyberSecNewsAggregrator
```

2. Install and start the backend:
```bash
cd backend
npm install
cp .env.example .env
npm start
```

The backend will start on `http://localhost:3000`

3. Open the frontend:
   - If using the backend, open `http://localhost:3000` in your browser
   - The frontend automatically connects to the backend API
   - Real-time news from 8+ RSS feeds!

For development with auto-reload:
```bash
npm run dev
```

## 📖 Usage

For detailed usage instructions, see [USAGE.md](USAGE.md).

### Quick Guide

1. **Search**: Use the search bar to find specific articles
2. **Filter**: Select a news source from the dropdown menu
3. **Sort**: Choose how to order your articles (newest, oldest, alphabetical)
4. **Read**: Click "Read More" on any article to view the full story
5. **Refresh**: Click the refresh button to reload the latest news

## 🏗️ Project Structure

```
CyberSecNewsAggregrator/
├── frontend/
│   ├── index.html              # Main HTML structure and layout
│   ├── styles.css              # CSS styling and responsive design
│   ├── script.js               # JavaScript functionality and API integration
│   └── USAGE.md               # Frontend usage instructions
├── backend/
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── logger.js      # Winston logging setup
│   │   │   └── sources.js     # News source configurations
│   │   ├── routes/            # API route handlers
│   │   │   └── newsRoutes.js  # News API endpoints
│   │   ├── services/          # Business logic
│   │   │   └── rssFeedService.js  # RSS feed fetching
│   │   ├── utils/             # Utility functions
│   │   │   └── cache.js       # Caching middleware
│   │   └── server.js          # Main Express server
│   ├── logs/                  # Application logs (auto-generated)
│   ├── .env.example           # Environment configuration template
│   ├── package.json           # Node.js dependencies
│   └── README.md             # Backend documentation
└── README.md                  # This file - project overview
```

## 🔧 Technical Stack

### Frontend
- **Languages**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Images**: Unsplash API (placeholder images)
- **Design**: CSS Grid, Flexbox, CSS Variables
- **Features**: Debounced search, efficient DOM updates, API integration

### Backend
- **Runtime**: Node.js v16+
- **Framework**: Express.js 4.x
- **RSS Parser**: rss-parser 3.x
- **Caching**: node-cache 5.x
- **Security**: Helmet.js, CORS
- **Logging**: Winston 3.x
- **Environment**: dotenv

## 🔌 API Endpoints

The backend provides a RESTful API for fetching cybersecurity news:

### Main Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check and cache statistics |
| GET | `/api/news` | Fetch all news from all sources |
| GET | `/api/news/source/:sourceId` | Fetch news from a specific source |
| GET | `/api/news/sources` | List all available news sources |
| GET | `/api/news/sources/:sourceId` | Get information about a specific source |

### Example Requests

```bash
# Health check
curl http://localhost:3000/api/health

# Get all news
curl http://localhost:3000/api/news

# Get news from The Hacker News
curl http://localhost:3000/api/news/source/thehackernews

# List all sources
curl http://localhost:3000/api/news/sources
```

For detailed API documentation, see [backend/README.md](backend/README.md).

## 🎨 Customization

### Color Scheme

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-bg: #0a0e27;       /* Main background color */
    --accent-color: #00d9ff;     /* Accent/highlight color */
    --text-primary: #ffffff;     /* Primary text color */
    /* ... more customizable variables */
}
```

### Adding News Sources

1. Add source to the dropdown in `index.html`
2. Configure source details in `script.js`
3. Update sample data or API integration

See [USAGE.md](USAGE.md) for detailed customization instructions.

## 🚀 Future Roadmap

- [x] **Backend API**: Node.js/Express API for real-time news fetching ✅
- [x] **RSS Feed Parser**: Direct RSS feed integration from 8+ sources ✅
- [x] **Caching System**: In-memory caching for performance ✅
- [ ] **Database**: Persistent storage (MongoDB/PostgreSQL)
- [ ] **User Accounts**: Authentication and personalized feeds
- [ ] **Bookmarks**: Save articles for later reading
- [ ] **Notifications**: Real-time alerts for breaking security news
- [ ] **Advanced Filtering**: Filter by threat type, severity, affected platforms
- [ ] **Dark/Light Mode**: User-selectable themes
- [ ] **Export Features**: PDF reports, email digests
- [ ] **AI Summarization**: Automatic article summaries with OpenAI
- [ ] **Multi-language Support**: International news sources
- [ ] **Mobile App**: React Native iOS/Android app
- [ ] **Analytics**: Usage statistics and popular articles

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Notes

### Current Implementation

- Uses sample data for demonstration
- No backend server required
- All processing happens client-side
- Ready for API integration

### API Integration

The codebase is structured to easily integrate with real APIs:

```javascript
// Replace sample data with actual API calls
async function fetchFromAPI(source) {
    const response = await fetch(`/api/news/${source}`);
    return await response.json();
}
```

## 🐛 Known Issues

- Currently using sample data instead of live feeds
- Images are placeholders from Unsplash
- No backend for article persistence

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Rubelefsky** - Initial work

## 🙏 Acknowledgments

- Font Awesome for icons
- Unsplash for placeholder images
- All the cybersecurity news sources for their valuable content

## 📧 Contact

Project Link: [https://github.com/Rubelefsky/CyberSecNewsAggregrator](https://github.com/Rubelefsky/CyberSecNewsAggregrator)

---

**Stay Secure, Stay Informed! 🛡️**
