import type { RedditPostData, SubredditVibeSummary, ApiConfig } from '../types/reddit';
import { aggregateSubredditVibe } from './sentimentEngine';
import { getMockSubredditData } from '../data/mockSubreddits';

const DEFAULT_CONFIG_KEY = 'subreddit_vibe_check_config';

export function getStoredApiConfig(): ApiConfig {
  try {
    const saved = localStorage.getItem(DEFAULT_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse API config from localStorage', e);
  }
  return {
    redditClientId: '',
    redditClientSecret: '',
    redditUserAgent: 'web:subreddit-vibe-check:v1.0.0 (by /u/intern_dev)',
    useFallbackData: false
  };
}

export function saveApiConfig(config: ApiConfig): void {
  try {
    localStorage.setItem(DEFAULT_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save API config', e);
  }
}

export async function fetchSubredditVibe(
  subredditInput: string,
  customConfig?: ApiConfig,
  accessToken?: string
): Promise<SubredditVibeSummary> {
  const config = customConfig || getStoredApiConfig();
  const cleanSubreddit = subredditInput
    .replace(/^r\//i, '')
    .trim()
    .toLowerCase();

  if (!cleanSubreddit) {
    throw new Error('Please enter a valid subreddit name.');
  }

  if (config.useFallbackData) {
    const mockPosts = getMockSubredditData(cleanSubreddit);
    return aggregateSubredditVibe(cleanSubreddit, mockPosts, 'fallback');
  }

  let posts: RedditPostData[] = [];
  let dataSource: 'live' | 'proxy' | 'oauth' | 'fallback' = 'live';

  // First try authenticated OAuth if access token is available
  if (accessToken) {
    try {
      posts = await fetchViaAuthenticatedToken(cleanSubreddit, accessToken);
      dataSource = 'oauth';
    } catch (e) {
      console.warn('Authenticated OAuth fetch failed, trying other methods:', e);
    }
  }

  if (posts.length === 0 && config.redditClientId && config.redditClientSecret) {
    try {
      posts = await fetchViaOAuth(cleanSubreddit, config);
      dataSource = 'oauth';
    } catch (e) {
      console.warn('OAuth fetch failed, trying direct endpoint:', e);
    }
  }

  if (posts.length === 0) {
    try {
      posts = await fetchDirectReddit(cleanSubreddit, config.redditUserAgent);
      dataSource = 'live';
    } catch (e) {
      console.warn('Direct fetch failed, trying proxy strategy:', e);
    }
  }

  if (posts.length === 0) {
    try {
      posts = await fetchViaProxy(cleanSubreddit);
      dataSource = 'proxy';
    } catch (e) {
      console.warn('Proxy fetch failed, falling back to cached snapshot:', e);
    }
  }

  if (posts.length === 0) {
    posts = getMockSubredditData(cleanSubreddit);
    dataSource = 'fallback';
  }

  return aggregateSubredditVibe(cleanSubreddit, posts, dataSource);
}

async function fetchViaAuthenticatedToken(subreddit: string, accessToken: string): Promise<RedditPostData[]> {
  const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot?limit=50`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'web:subreddit-vibe-check:v1.0.0 (by /u/intern_dev)'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch with authenticated token: ${response.status}`);
  }

  const json = await response.json();
  const children = json?.data?.children;
  if (Array.isArray(children) && children.length > 0) {
    return parseRedditJsonResponse(children, subreddit);
  }

  throw new Error('No posts returned via authenticated token');
}

async function fetchDirectReddit(subreddit: string, userAgent: string): Promise<RedditPostData[]> {
  const urls = [
    `https://old.reddit.com/r/${subreddit}/hot.json?limit=50`,
    `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SubredditVibeCheck/1.0'
        }
      });

      if (!response.ok) {
        continue;
      }

      const json = await response.json();
      const children = json?.data?.children;
      if (Array.isArray(children) && children.length > 0) {
        return parseRedditJsonResponse(children, subreddit);
      }
    } catch (err) {
      // Continue to next URL
    }
  }

  throw new Error('Direct Reddit JSON fetch failed');
}

async function fetchViaProxy(subreddit: string): Promise<RedditPostData[]> {
  const targetUrl = `https://www.reddit.com/r/${subreddit}/hot.json?limit=50`;
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
  ];

  for (const proxyUrl of proxies) {
    try {
      const res = await fetch(proxyUrl);
      if (res.ok) {
        const json = await res.json();
        const children = json?.data?.children;
        if (Array.isArray(children) && children.length > 0) {
          return parseRedditJsonResponse(children, subreddit);
        }
      }
    } catch (e) {
      // Try next proxy
    }
  }

  throw new Error('Proxy fetch failed');
}

async function fetchViaOAuth(subreddit: string, config: ApiConfig): Promise<RedditPostData[]> {
  const authHeader = 'Basic ' + btoa(`${config.redditClientId}:${config.redditClientSecret}`);
  const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': config.redditUserAgent
    },
    body: 'grant_type=client_credentials'
  });

  if (!tokenRes.ok) {
    throw new Error(`Reddit OAuth token failed with status ${tokenRes.status}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  const dataRes = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot?limit=50`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': config.redditUserAgent
    }
  });

  if (!dataRes.ok) {
    throw new Error(`Reddit OAuth data fetch failed with status ${dataRes.status}`);
  }

  const dataJson = await dataRes.json();
  const children = dataJson?.data?.children;
  if (Array.isArray(children) && children.length > 0) {
    return parseRedditJsonResponse(children, subreddit);
  }

  throw new Error('No posts returned via OAuth');
}

function parseRedditJsonResponse(children: any[], subredditName: string): RedditPostData[] {
  return children.map((item: any) => {
    const d = item.data || {};
    return {
      id: d.id || Math.random().toString(36).substring(7),
      title: d.title || 'Untitled Post',
      author: d.author || '[deleted]',
      score: typeof d.score === 'number' ? d.score : 0,
      num_comments: typeof d.num_comments === 'number' ? d.num_comments : 0,
      created_utc: typeof d.created_utc === 'number' ? d.created_utc : Date.now() / 1000,
      permalink: d.permalink ? `https://reddit.com${d.permalink}` : `https://reddit.com/r/${subredditName}`,
      url: d.url || `https://reddit.com/r/${subredditName}`,
      thumbnail: d.thumbnail && d.thumbnail.startsWith('http') ? d.thumbnail : undefined,
      subreddit: d.subreddit || subredditName,
      upvote_ratio: typeof d.upvote_ratio === 'number' ? d.upvote_ratio : 0.90,
      over_18: Boolean(d.over_18),
      selftext: d.selftext || ''
    };
  });
}
