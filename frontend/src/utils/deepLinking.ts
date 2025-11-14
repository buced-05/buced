/**
 * Deep Linking Utility
 * Handles custom deep linking for the application
 */

export interface DeepLinkParams {
  path: string;
  params?: Record<string, string | number>;
  query?: Record<string, string | number | boolean>;
  hash?: string;
}

export interface ParsedDeepLink {
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  hash?: string;
}

/**
 * Generate a deep link URL
 */
export function generateDeepLink(config: DeepLinkParams): string {
  const { path, params, query, hash } = config;
  
  let url = path;
  
  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
      url = url.replace(`{${key}}`, String(value));
    });
  }
  
  // Add query parameters
  if (query && Object.keys(query).length > 0) {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    url += `?${queryString}`;
  }
  
  // Add hash
  if (hash) {
    url += `#${hash}`;
  }
  
  return url;
}

/**
 * Parse a deep link URL
 */
export function parseDeepLink(url: string): ParsedDeepLink {
  const [pathWithQuery, hash] = url.split('#');
  const [path, queryString] = pathWithQuery.split('?');
  
  const query: Record<string, string> = {};
  if (queryString) {
    queryString.split('&').forEach((param) => {
      const [key, value] = param.split('=');
      if (key) {
        query[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    });
  }
  
  // Extract path parameters (basic extraction)
  const params: Record<string, string> = {};
  const pathSegments = path.split('/');
  pathSegments.forEach((segment, index) => {
    // This is a simplified version - you might want more sophisticated parsing
    if (segment.startsWith(':') || segment.startsWith('{')) {
      const paramName = segment.replace(/[:{}]/g, '');
      if (pathSegments[index + 1]) {
        params[paramName] = pathSegments[index + 1];
      }
    }
  });
  
  return {
    path,
    params,
    query,
    hash,
  };
}

/**
 * Deep link routes configuration
 */
export const DeepLinkRoutes = {
  // Projects
  PROJECT_DETAIL: (id: number | string) => `/projects/${id}`,
  PROJECT_CREATE: () => '/projects/new',
  PROJECT_EDIT: (id: number | string) => `/projects/${id}/edit`,
  
  // Profile
  PROFILE: (userId?: number | string) => userId ? `/profile/${userId}` : '/profile',
  PROFILE_EDIT: () => '/profile/edit',
  
  // Votes
  VOTES: () => '/votes',
  VOTE_DETAIL: (id: number | string) => `/votes/${id}`,
  
  // Orientation
  ORIENTATION: () => '/orientation',
  ORIENTATION_REQUEST: (id: number | string) => `/orientation/${id}`,
  ORIENTATION_MESSAGING: (id: number | string) => `/orientation/${id}/messaging`,
  
  // Sponsors
  SPONSORS: () => '/sponsors',
  SPONSOR_PROFILE: (id: number | string) => `/sponsors/${id}`,
  
  // Feed
  FEED: (filter?: string) => filter ? `/feed?filter=${filter}` : '/feed',
  
  // Dashboard
  DASHBOARD: () => '/dashboard',
  
  // Settings
  SETTINGS: () => '/parametres',
  SETTINGS_2FA: () => '/parametres/2fa',
  
  // Search
  SEARCH: (query?: string) => query ? `/search?q=${encodeURIComponent(query)}` : '/search',
  
  // Stats
  STATS: () => '/stats',
  
  // Favorites
  FAVORITES: () => '/favorites',
  
  // Admin
  ADMIN: () => '/admin',
  
  // Accompaniment
  ACCOMPANIMENT: () => '/accompagnement',
  MILESTONES: (id: number | string) => `/accompagnement/milestones/${id}`,
} as const;

/**
 * Generate deep link with query parameters
 */
export function createDeepLink(
  route: string,
  options?: {
    params?: Record<string, string | number>;
    query?: Record<string, string | number | boolean>;
    hash?: string;
  }
): string {
  return generateDeepLink({
    path: route,
    ...options,
  });
}

/**
 * Handle deep link navigation
 * Useful for handling external links or notifications
 */
export function handleDeepLink(url: string, navigate: (path: string) => void): void {
  try {
    // Remove domain if present
    const cleanUrl = url.replace(/^https?:\/\/[^/]+/, '');
    const parsed = parseDeepLink(cleanUrl);
    
    // Navigate to the path
    let navigationPath = parsed.path;
    
    // Add query parameters if any
    if (Object.keys(parsed.query).length > 0) {
      const queryString = Object.entries(parsed.query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      navigationPath += `?${queryString}`;
    }
    
    // Add hash if present
    if (parsed.hash) {
      navigationPath += `#${parsed.hash}`;
    }
    
    navigate(navigationPath);
  } catch (error) {
    console.error('Error handling deep link:', error);
    // Fallback to home
    navigate('/');
  }
}

/**
 * Share deep link
 */
export function shareDeepLink(
  route: string,
  options?: {
    params?: Record<string, string | number>;
    query?: Record<string, string | number | boolean>;
    title?: string;
    text?: string;
  }
): Promise<void> {
  const baseUrl = window.location.origin;
  const deepLink = createDeepLink(route, options);
  const fullUrl = `${baseUrl}${deepLink}`;
  
  const shareData: ShareData = {
    title: options?.title || 'Partager',
    text: options?.text || '',
    url: fullUrl,
  };
  
  if (navigator.share) {
    return navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(fullUrl);
    return Promise.resolve();
  }
}

/**
 * Copy deep link to clipboard
 */
export async function copyDeepLink(
  route: string,
  options?: {
    params?: Record<string, string | number>;
    query?: Record<string, string | number | boolean>;
  }
): Promise<void> {
  const baseUrl = window.location.origin;
  const deepLink = createDeepLink(route, options);
  const fullUrl = `${baseUrl}${deepLink}`;
  
  try {
    await navigator.clipboard.writeText(fullUrl);
  } catch (error) {
    console.error('Error copying deep link:', error);
    throw error;
  }
}

/**
 * Get current deep link
 */
export function getCurrentDeepLink(): string {
  return window.location.pathname + window.location.search + window.location.hash;
}

/**
 * Check if URL is a deep link
 */
export function isDeepLink(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    // Check if it's not just the base domain
    return urlObj.pathname !== '/' || urlObj.search !== '' || urlObj.hash !== '';
  } catch {
    return false;
  }
}

