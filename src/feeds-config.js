// Feed Sources Configuration
// Each feed can have either:
// - icon: emoji string (e.g., '💳')
// - iconUrl: URL to an image (optional, takes precedence over emoji)
export const FEED_SOURCES = [
    // Blogs
    {
        name: 'Doctor of Credit',
        url: 'https://www.doctorofcredit.com/category/bank-account-bonuses/feed/',
        category: 'blog',
        icon: '💳',
        iconUrl: 'https://www.doctorofcredit.com/favicon.ico',
        description: 'Bank bonuses, credit card deals, and financial tips'
    },
    {
        name: 'Profitable Content',
        url: 'https://www.profitablecontent.com/feed/',
        category: 'blog',
        icon: '💰',
        description: 'Credit card and bank bonus opportunities'
    },
    {
        name: 'Hustler Money Blog',
        url: 'https://www.hustlermoneyblog.com/feed/',
        category: 'blog',
        icon: '💵',
        description: 'Bank promotions and money-making opportunities'
    },
    // {
    //     name: 'Million Mile Secrets',
    //     url: 'https://millionmilesecrets.com/feed/',
    //     category: 'blog',
    //     icon: '✈️',
    //     description: 'Travel rewards and credit card strategies'
    // },
    // {
    //     name: 'The Points Guy',
    //     url: 'https://thepointsguy.com/feed/',
    //     category: 'blog',
    //     icon: '🎯',
    //     description: 'Travel and credit card rewards news'
    // },

    // Reddit Feeds
    {
        name: 'r/churning',
        url: 'https://www.reddit.com/r/churning/.rss',
        category: 'reddit',
        icon: '🔄',
        description: 'Credit card churning community'
    },
    // {
    //     name: 'r/CreditCards',
    //     url: 'https://www.reddit.com/r/CreditCards/.rss',
    //     category: 'reddit',
    //     icon: '💳',
    //     description: 'Credit card discussion and advice'
    // },

    // YouTube Channels (Note: YouTube RSS feeds)
    {
        name: 'Run on The Bank',
        url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCqd2RKRHYlBxq9FLJxjJLvQ',
        category: 'youtube',
        icon: '🎥',
        description: 'Bank bonus strategies and tutorials'
    },
    {
        name: 'AskSebby',
        url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCvnvJLbKbLlPP2-LGcf8FYQ',
        category: 'youtube',
        icon: '📺',
        description: 'Credit cards and travel rewards'
    },

    // Additional Blogs
    // {
    //     name: 'Frequent Miler',
    //     url: 'https://frequentmiler.com/feed/',
    //     category: 'blog',
    //     icon: '🛫',
    //     description: 'Miles, points, and travel rewards'
    // },
    {
        name: 'Danny the Deal Guru',
        url: 'https://dannythedealg.wixsite.com/blog/feed.xml',
        category: 'blog',
        icon: '🎓',
        description: 'Credit card and bank bonus deals'
    },
    // {
    //     name: 'Travel Miles 101',
    //     url: 'https://travelmiles101.com/feed/',
    //     category: 'blog',
    //     icon: '🌍',
    //     description: 'Travel rewards and points strategies'
    // }
];

// CORS Proxies (fallback list)
export const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
];
