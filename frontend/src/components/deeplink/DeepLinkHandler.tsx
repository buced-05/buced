import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleDeepLink, parseDeepLink } from '../../utils/deepLinking';
import { useAuthStore } from '../../stores/auth';
import useAuth from '../../hooks/useAuth';

/**
 * Component to handle deep links on app initialization
 */
export const DeepLinkHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isAuthenticated = useAuthStore((state) => !!state.accessToken && !!state.user);

  useEffect(() => {
    // Handle deep links from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const deepLink = urlParams.get('deep_link');
    const redirect = urlParams.get('redirect');

    if (deepLink) {
      try {
        handleDeepLink(deepLink, navigate);
        // Clean up URL
        urlParams.delete('deep_link');
        const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
      } catch (error) {
        console.error('Error handling deep link:', error);
      }
    } else if (redirect) {
      // Handle redirect parameter (useful after login)
      try {
        const decodedRedirect = decodeURIComponent(redirect);
        navigate(decodedRedirect);
        // Clean up URL
        urlParams.delete('redirect');
        const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    }
  }, [navigate]);

  useEffect(() => {
    // Handle hash-based deep links
    if (location.hash) {
      const hash = location.hash.substring(1); // Remove #
      const parsed = parseDeepLink(hash);
      
      // If hash contains a path, navigate to it
      if (parsed.path && parsed.path !== location.pathname) {
        navigate(parsed.path + (parsed.query ? `?${new URLSearchParams(parsed.query).toString()}` : ''));
      }
    }
  }, [location.hash, navigate]);

  return null;
};

/**
 * Hook to handle authentication-required deep links
 */
export function useProtectedDeepLink() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = useAuthStore((state) => !!state.accessToken && !!state.user);

  const navigateWithAuth = (path: string, requireAuth: boolean = false) => {
    if (requireAuth && !isAuthenticated) {
      // Store the intended destination and redirect to login
      const loginUrl = `/login?redirect=${encodeURIComponent(path)}`;
      navigate(loginUrl);
    } else {
      navigate(path);
    }
  };

  return { navigateWithAuth };
}

