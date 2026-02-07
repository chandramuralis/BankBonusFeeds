# Bonus Hunting Feed Aggregator 💰

A modern, responsive RSS feed aggregator for bonus hunting, bank promotions, credit card deals, and financial opportunities. Aggregates content from 12+ top sources into one easy-to-navigate interface.

![Feed Aggregator](https://img.shields.io/badge/status-active-success)
![GitHub Pages](https://img.shields.io/badge/hosted-GitHub%20Pages-blue)

## ✨ Features

- **12+ Feed Sources**: Aggregates content from top blogs, YouTube channels, Reddit communities, and podcasts
- **Smart Search**: Real-time search across all feed titles and descriptions
- **Advanced Filtering**: Filter by category (blogs, YouTube, Reddit, podcasts) and time period
- **Multiple View Modes**: Switch between aggregated view and grouped-by-source view
- **Dark Mode**: Toggle between light and dark themes
- **Auto-Refresh**: Feeds automatically update every 15 minutes
- **Offline Cache**: Uses localStorage to cache feeds for faster loading
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations

## 🚀 Live Demo

Visit the live site: `https://[your-username].github.io/cashbackcow-clone/`

## 📦 Feed Sources

### Blogs
- Doctor of Credit
- Profitable Content
- Hustler Money Blog
- Million Mile Secrets
- The Points Guy
- Frequent Miler
- Danny the Deal Guru
- Travel Miles 101

### Reddit Communities
- r/churning
- r/CreditCards

### YouTube Channels
- Run on The Bank
- AskSebby

## 🛠️ Local Development

### Prerequisites
- A modern web browser
- Python 3 (for local server) or any other static file server

### Running Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/cashbackcow-clone.git
   cd cashbackcow-clone
   ```

2. **Start a local server**
   
   Using Python 3:
   ```bash
   python3 -m http.server 8000
   ```
   
   Or using Node.js (if you have `npx`):
   ```bash
   npx serve
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🌐 GitHub Pages Deployment

### Option 1: Deploy from Main Branch (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[your-username]/cashbackcow-clone.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select **main** branch and **/ (root)** folder
   - Click **Save**

3. **Wait for deployment**
   - GitHub will build and deploy your site (usually takes 1-2 minutes)
   - Your site will be available at `https://[your-username].github.io/cashbackcow-clone/`

### Option 2: Using GitHub Actions (Advanced)

A GitHub Actions workflow is included in `.github/workflows/deploy.yml` for automated deployment.

## ⚙️ Customization

### Adding/Removing Feed Sources

Edit `src/feeds-config.js`:

```javascript
export const FEED_SOURCES = [
    {
        name: 'Your Blog Name',
        url: 'https://yourblog.com/feed/',
        category: 'blog', // blog, youtube, reddit, podcast
        icon: '💡',
        description: 'Your blog description'
    },
    // ... more feeds
];
```

### Changing Colors

Edit CSS variables in `src/styles.css`:

```css
:root {
    --color-primary: #dc2626; /* Change primary color */
    --color-bg: #ffffff; /* Background color */
    /* ... more variables */
}
```

### Adjusting Auto-Refresh Interval

Edit `src/app.js` (line ~440):

```javascript
// Change 15 to desired minutes
setInterval(fetchAllFeeds, 15 * 60 * 1000);
```

## 🔧 Technical Details

### Architecture
- **Pure HTML/CSS/JavaScript**: No build tools or frameworks required
- **ES6 Modules**: Modern JavaScript module system
- **CORS Proxies**: Multiple fallback proxies for reliable feed fetching
- **LocalStorage Caching**: Reduces API calls and improves performance

### Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

### Performance
- Lazy loading of feeds
- Debounced search input
- Efficient DOM manipulation
- Cached feed data

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by [CashbackCow.io](https://cashbackcow.io/)
- Feed sources from the bonus hunting community
- Icons from Unicode emoji

## 🐛 Troubleshooting

### Feeds not loading?
- Check browser console for errors
- Verify feed URLs are still valid
- CORS proxies may occasionally be down (the app will try fallbacks)

### Site not updating on GitHub Pages?
- Clear your browser cache
- Wait a few minutes for GitHub's CDN to update
- Check GitHub Actions tab for deployment status

### Dark mode not persisting?
- Ensure localStorage is enabled in your browser
- Check browser privacy settings

## 📧 Support

For issues or questions, please [open an issue](https://github.com/[your-username]/cashbackcow-clone/issues) on GitHub.

---

**Happy Bonus Hunting! 💰**
