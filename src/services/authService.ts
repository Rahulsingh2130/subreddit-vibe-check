import type { ApiConfig } from '../types/reddit';

const AUTH_CONFIG_KEY = 'reddit_oauth_config';
const ACCESS_TOKEN_KEY = 'reddit_access_token';
const REFRESH_TOKEN_KEY = 'reddit_refresh_token';
const TOKEN_EXPIRY_KEY = 'reddit_token_expiry';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  username?: string;
}

export function getOAuthConfig(): OAuthConfig | null {
  try {
    const saved = localStorage.getItem(AUTH_CONFIG_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn('Failed to parse OAuth config', e);
    return null;
  }
}

export function saveOAuthConfig(config: OAuthConfig): void {
  localStorage.setItem(AUTH_CONFIG_KEY, JSON.stringify(config));
}

export function getStoredAuthToken(): AuthToken | null {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);

    if (!accessToken || !refreshToken || !expiryStr) {
      return null;
    }

    const expiresAt = parseInt(expiryStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      clearAuthToken();
      return null;
    }

    return { accessToken, refreshToken, expiresAt };
  } catch (e) {
    console.warn('Failed to parse auth token', e);
    return null;
  }
}

export function saveAuthToken(token: AuthToken): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken);
  localStorage.setItem(TOKEN_EXPIRY_KEY, token.expiresAt.toString());
}

export function clearAuthToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function getRedditAuthorizationUrl(config: OAuthConfig): string {
  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    state: generateState(),
    redirect_uri: config.redirectUri,
    duration: 'permanent',
    scope: 'read'
  });
  return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(
  code: string,
  config: OAuthConfig
): Promise<AuthToken> {
  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'web:subreddit-vibe-check:v1.0.0'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri
    }).toString()
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json() as any;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000
  };
}

export async function refreshAccessToken(
  config: OAuthConfig,
  refreshToken: string
): Promise<AuthToken> {
  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const response = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'web:subreddit-vibe-check:v1.0.0'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }).toString()
  });

  if (!response.ok) {
    clearAuthToken();
    throw new Error('Failed to refresh token');
  }

  const data = await response.json() as any;
  return {
    accessToken: data.access_token,
    refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000
  };
}

export async function getCurrentUser(accessToken: string): Promise<{ name: string }> {
  const response = await fetch('https://oauth.reddit.com/api/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'User-Agent': 'web:subreddit-vibe-check:v1.0.0'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user info');
  }

  return response.json() as Promise<{ name: string }>;
}

function generateState(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function validateState(state: string): boolean {
  // In production, store state in sessionStorage and compare
  return true;
}
