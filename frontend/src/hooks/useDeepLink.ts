import { useCallback } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import {
  generateDeepLink,
  parseDeepLink,
  DeepLinkRoutes,
  createDeepLink,
  shareDeepLink as shareDeepLinkUtil,
  copyDeepLink as copyDeepLinkUtil,
  getCurrentDeepLink,
  type DeepLinkParams,
} from '../utils/deepLinking';

/**
 * Hook for deep linking functionality
 */
export function useDeepLink() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();

  /**
   * Navigate to a deep link
   */
  const navigateToDeepLink = useCallback(
    (config: DeepLinkParams) => {
      const url = generateDeepLink(config);
      navigate(url);
    },
    [navigate]
  );

  /**
   * Navigate to a predefined route
   */
  const navigateToRoute = useCallback(
    (route: string, options?: { query?: Record<string, string | number | boolean>; hash?: string }) => {
      let url = route;
      
      if (options?.query) {
        const queryString = Object.entries(options.query)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');
        url += `?${queryString}`;
      }
      
      if (options?.hash) {
        url += `#${options.hash}`;
      }
      
      navigate(url);
    },
    [navigate]
  );

  /**
   * Get current route with params
   */
  const getCurrentRoute = useCallback(() => {
    return {
      path: location.pathname,
      params,
      query: Object.fromEntries(searchParams.entries()),
      hash: location.hash.replace('#', ''),
      fullPath: getCurrentDeepLink(),
    };
  }, [location, params, searchParams]);

  /**
   * Share current page as deep link
   */
  const shareCurrentPage = useCallback(
    async (options?: { title?: string; text?: string }) => {
      const currentPath = location.pathname + location.search;
      return shareDeepLinkUtil(currentPath, {
        query: Object.fromEntries(searchParams.entries()) as Record<string, string | number | boolean>,
        ...options,
      });
    },
    [location, searchParams]
  );

  /**
   * Copy current page deep link
   */
  const copyCurrentPageLink = useCallback(async () => {
    const currentPath = location.pathname + location.search;
    return copyDeepLinkUtil(currentPath, {
      query: Object.fromEntries(searchParams.entries()) as Record<string, string | number | boolean>,
    });
  }, [location, searchParams]);

  /**
   * Share a specific route
   */
  const shareRoute = useCallback(
    async (
      route: string,
      options?: {
        params?: Record<string, string | number>;
        query?: Record<string, string | number | boolean>;
        title?: string;
        text?: string;
      }
    ) => {
      return shareDeepLinkUtil(route, options);
    },
    []
  );

  /**
   * Copy a specific route link
   */
  const copyRouteLink = useCallback(
    async (
      route: string,
      options?: {
        params?: Record<string, string | number>;
        query?: Record<string, string | number | boolean>;
      }
    ) => {
      return copyDeepLinkUtil(route, options);
    },
    []
  );

  /**
   * Parse current URL
   */
  const parseCurrentUrl = useCallback(() => {
    return parseDeepLink(location.pathname + location.search + location.hash);
  }, [location]);

  return {
    navigateToDeepLink,
    navigateToRoute,
    getCurrentRoute,
    shareCurrentPage,
    copyCurrentPageLink,
    shareRoute,
    copyRouteLink,
    parseCurrentUrl,
    routes: DeepLinkRoutes,
    currentPath: location.pathname,
    currentQuery: Object.fromEntries(searchParams.entries()),
    currentHash: location.hash.replace('#', ''),
  };
}

