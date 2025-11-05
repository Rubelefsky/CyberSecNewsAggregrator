# 🛡️ CyberSec News Aggregator

A modern, responsive web application that aggregates cybersecurity news from multiple trusted sources into a single, unified interface. Stay informed about the latest security threats, vulnerabilities, and industry developments all in one place.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📋 Overview

The CyberSec News Aggregator consolidates cybersecurity news from leading security publications and blogs, providing security professionals, researchers, and enthusiasts with a centralized hub for staying current with the latest threats, vulnerabilities, and security trends.

## ✨ Features

- **🔍 Real-time Search**: Instantly search across all articles by title, description, or source
- **🎯 Source Filtering**: Filter news by specific cybersecurity publications
- **📊 Smart Sorting**: Sort articles by date or title for easy navigation
- **🔄 Auto-Refresh**: Manually refresh to get the latest news updates
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, cybersecurity-themed dark interface
- **⚡ Fast Performance**: Optimized loading and smooth interactions
- **♿ Accessible**: WCAG compliant with keyboard navigation support

## 🎯 Supported News Sources

Currently aggregating from:
- **The Hacker News** - Latest cybersecurity news and analysis
- **Bleeping Computer** - Tech news and security guides
- **Krebs on Security** - In-depth security investigations
- **Dark Reading** - Cybersecurity intelligence
- **Threatpost** - Latest security threats and vulnerabilities
- **SecurityWeek** - Enterprise security news

## 🚀 Quick Start

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies or installations required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Rubelefsky/CyberSecNewsAggregrator.git
```

2. Navigate to the project directory:
```bash
cd CyberSecNewsAggregrator
```

3. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

That's it! No build process or dependencies needed.

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
├── index.html          # Main HTML structure and layout
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and logic
├── README.md          # This file - project overview
└── USAGE.md           # Detailed usage instructions
```

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Icons**: Font Awesome 6.4.0
- **Images**: Unsplash (placeholder images)
- **Design**: CSS Grid, Flexbox, CSS Variables
- **Performance**: Debounced search, efficient DOM updates

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

- [ ] **Backend Integration**: Node.js/Python API for real-time news fetching
- [ ] **RSS Feed Parser**: Direct RSS feed integration from news sources
- [ ] **Database**: Article caching and persistent storage
- [ ] **User Accounts**: Personalized feeds and saved articles
- [ ] **Notifications**: Real-time alerts for breaking security news
- [ ] **Advanced Filtering**: Filter by threat type, severity, affected platforms
- [ ] **Dark/Light Mode**: User-selectable themes
- [ ] **Export Features**: PDF reports, email digests
- [ ] **AI Summarization**: Automatic article summaries
- [ ] **Multi-language Support**: International news sources

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
