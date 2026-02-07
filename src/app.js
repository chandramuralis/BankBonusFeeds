import { FEED_SOURCES, CORS_PROXIES } from './feeds-config.js';

// ===================================
// State Management
// ===================================
const state = {
    allFeeds: [],
    filteredFeeds: [],
    currentProxyIndex: 0,
    lastUpdated: null,
    searchQuery: '',
    categoryFilter: 'all',
    timeFilter: 'all',
    viewMode: 'aggregated'
};

// ===================================
// Utility Functions
// ===================================

// Debounce function for search input
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

// Format date to relative time
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}

// Get time filter in milliseconds
function getTimeFilterMs(filter) {
    const filters = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000,
        'all': Infinity
    };
    return filters[filter] || Infinity;
}

// ===================================
// Feed Fetching
// ===================================

async function fetchFeedWithProxy(feed, proxyIndex = 0) {
    if (proxyIndex >= CORS_PROXIES.length) {
        throw new Error('All CORS proxies failed');
    }

    const proxy = CORS_PROXIES[proxyIndex];
    const url = proxy + encodeURIComponent(feed.url);

    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const text = await response.text();
        return parseFeed(text, feed);
    } catch (error) {
        console.warn(`Proxy ${proxyIndex} failed for ${feed.name}:`, error.message);
        // Try next proxy
        return fetchFeedWithProxy(feed, proxyIndex + 1);
    }
}

function parseFeed(xmlText, feedSource) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');

    // Check for parsing errors
    const parserError = xml.querySelector('parsererror');
    if (parserError) {
        throw new Error('XML parsing failed');
    }

    // Handle both RSS and Atom feeds
    const items = xml.querySelectorAll('item, entry');

    return Array.from(items).map(item => {
        // RSS format
        let title = item.querySelector('title')?.textContent || '';
        let link = item.querySelector('link')?.textContent || item.querySelector('link')?.getAttribute('href') || '';
        let pubDateText = item.querySelector('pubDate, published, updated')?.textContent || '';
        let description = item.querySelector('description, summary, content')?.textContent || '';

        // Clean up description (remove HTML tags and decode entities)
        if (description) {
            description = description.replace(/<[^>]*>/g, '');
            const textarea = document.createElement('textarea');
            textarea.innerHTML = description;
            description = textarea.value.trim();
            if (description.length > 250) {
                description = description.substring(0, 250) + '...';
            }
        }

        return {
            title: title.trim(),
            link: link.trim(),
            pubDate: pubDateText ? new Date(pubDateText) : new Date(),
            source: feedSource.name,
            sourceIcon: feedSource.icon,
            category: feedSource.category,
            description: description
        };
    }).filter(item => item.title && item.link); // Filter out invalid items
}

async function fetchAllFeeds() {
    showLoading(true);
    hideError();

    const feedPromises = FEED_SOURCES.map(async (feed) => {
        try {
            return await fetchFeedWithProxy(feed);
        } catch (error) {
            console.error(`Failed to fetch ${feed.name}:`, error);
            return []; // Return empty array on failure
        }
    });

    try {
        const results = await Promise.all(feedPromises);
        state.allFeeds = results.flat();
        state.lastUpdated = new Date();

        // Save to localStorage cache
        saveToCache();

        applyFilters();
        showLoading(false);
    } catch (error) {
        console.error('Error fetching feeds:', error);
        showError('Failed to load feeds. Please try again.');
        showLoading(false);
    }
}

// ===================================
// Filtering & Search
// ===================================

function applyFilters() {
    let filtered = [...state.allFeeds];

    // Apply search filter
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.source.toLowerCase().includes(query)
        );
    }

    // Apply category filter
    if (state.categoryFilter !== 'all') {
        filtered = filtered.filter(item => item.category === state.categoryFilter);
    }

    // Apply time filter
    if (state.timeFilter !== 'all') {
        const timeMs = getTimeFilterMs(state.timeFilter);
        const cutoffDate = new Date(Date.now() - timeMs);
        filtered = filtered.filter(item => item.pubDate >= cutoffDate);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => b.pubDate - a.pubDate);

    state.filteredFeeds = filtered;
    renderFeeds();
    updateStats();
}

// ===================================
// Rendering
// ===================================

function renderFeeds() {
    const container = document.getElementById('feedContainer');
    const emptyState = document.getElementById('emptyState');

    container.innerHTML = '';

    if (state.filteredFeeds.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'grid';
    emptyState.style.display = 'none';

    if (state.viewMode === 'aggregated') {
        renderAggregatedView(container);
    } else {
        renderIndividualView(container);
    }
}

function renderAggregatedView(container) {
    let lastSource = null;
    let currentGroup = null;
    let groupContainer = null;

    state.filteredFeeds.forEach((item, index) => {
        // Check if we need to create a new group
        if (item.source !== lastSource) {
            // Create new group wrapper
            currentGroup = document.createElement('div');
            currentGroup.className = 'feed-source-group';

            // Add source header
            const sourceHeader = document.createElement('div');
            sourceHeader.className = 'feed-source-header';
            sourceHeader.innerHTML = `
                <span class="source-badge">${item.sourceIcon} ${item.source}</span>
            `;
            currentGroup.appendChild(sourceHeader);

            // Create container for items in this group
            groupContainer = document.createElement('div');
            groupContainer.className = 'feed-group-items';
            currentGroup.appendChild(groupContainer);

            container.appendChild(currentGroup);
            lastSource = item.source;
        }

        // Add item to current group (groupContainer is guaranteed to exist here)
        if (groupContainer) {
            const feedItem = createFeedItemElement(item, false);
            groupContainer.appendChild(feedItem);
        }
    });
}

function renderIndividualView(container) {
    // Group feeds by source
    const groupedFeeds = {};
    state.filteredFeeds.forEach(item => {
        if (!groupedFeeds[item.source]) {
            groupedFeeds[item.source] = [];
        }
        groupedFeeds[item.source].push(item);
    });

    // Render each group
    Object.entries(groupedFeeds).forEach(([source, items]) => {
        const sourceGroup = document.createElement('div');
        sourceGroup.className = 'source-group';

        const header = document.createElement('div');
        header.className = 'source-group-header';
        header.innerHTML = `
            <h2 class="source-group-title">${items[0].sourceIcon} ${source}</h2>
            <span class="source-group-count">${items.length} items</span>
        `;
        sourceGroup.appendChild(header);

        const groupItems = document.createElement('div');
        groupItems.className = 'feed-group-items';

        items.forEach(item => {
            const feedItem = createFeedItemElement(item, false);
            groupItems.appendChild(feedItem);
        });

        sourceGroup.appendChild(groupItems);
        container.appendChild(sourceGroup);
    });
}

function createFeedItemElement(item, showSource = true) {
    const div = document.createElement('div');
    div.className = 'feed-item';

    const sourceBadge = showSource ? `<div class="feed-source">${item.sourceIcon} ${item.source}</div>` : '';
    const description = item.description ? `<div class="feed-description">${item.description}</div>` : '';

    div.innerHTML = `
        ${sourceBadge}
        <div class="feed-title">
            <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                ${item.title}
            </a>
        </div>
        ${description}
        <div class="feed-date">${formatRelativeTime(item.pubDate)}</div>
    `;

    return div;
}

function updateStats() {
    document.getElementById('itemCount').textContent = state.filteredFeeds.length;
    document.getElementById('lastUpdated').textContent =
        state.lastUpdated ? formatRelativeTime(state.lastUpdated) : 'Never';
}

// ===================================
// UI State Management
// ===================================

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

// ===================================
// Local Storage Cache
// ===================================

function saveToCache() {
    try {
        const cacheData = {
            feeds: state.allFeeds,
            timestamp: state.lastUpdated.getTime()
        };
        localStorage.setItem('feedCache', JSON.stringify(cacheData));
    } catch (error) {
        console.warn('Failed to save cache:', error);
    }
}

function loadFromCache() {
    try {
        const cached = localStorage.getItem('feedCache');
        if (!cached) return false;

        const cacheData = JSON.parse(cached);
        const cacheAge = Date.now() - cacheData.timestamp;

        // Use cache if less than 15 minutes old
        if (cacheAge < 15 * 60 * 1000) {
            state.allFeeds = cacheData.feeds.map(item => ({
                ...item,
                pubDate: new Date(item.pubDate)
            }));
            state.lastUpdated = new Date(cacheData.timestamp);
            applyFilters();
            return true;
        }
    } catch (error) {
        console.warn('Failed to load cache:', error);
    }
    return false;
}

// ===================================
// Dark Mode
// ===================================

function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateDarkModeIcon(savedTheme);

    darkModeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateDarkModeIcon(newTheme);
    });
}

function updateDarkModeIcon(theme) {
    const icon = document.getElementById('darkModeToggle');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// ===================================
// Scroll to Top
// ===================================

function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Event Listeners
// ===================================

function initEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce((e) => {
        state.searchQuery = e.target.value;
        applyFilters();
    }, 300));

    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        state.categoryFilter = e.target.value;
        applyFilters();
    });

    // Time filter
    document.getElementById('timeFilter').addEventListener('change', (e) => {
        state.timeFilter = e.target.value;
        applyFilters();
    });

    // View mode
    document.getElementById('viewMode').addEventListener('change', (e) => {
        state.viewMode = e.target.value;
        renderFeeds();
    });

    // Retry button
    document.getElementById('retryBtn').addEventListener('click', () => {
        fetchAllFeeds();
    });
}

// ===================================
// Initialization
// ===================================

async function init() {
    initEventListeners();
    initDarkMode();
    initScrollToTop();

    // Try to load from cache first
    const cacheLoaded = loadFromCache();

    if (cacheLoaded) {
        console.log('Loaded feeds from cache');
    }

    // Fetch fresh feeds (even if cache loaded, to update in background)
    await fetchAllFeeds();

    // Auto-refresh every 15 minutes
    setInterval(fetchAllFeeds, 15 * 60 * 1000);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}