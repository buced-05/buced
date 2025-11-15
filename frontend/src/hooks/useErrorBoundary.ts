/**
 * Error Boundary Hook
 * Provides error boundary functionality for functional components
 */

import { useEffect, useState, useCallback } from 'react';
import { errorHandler } from '../utils/errorHandler';

interface UseErrorBoundaryReturn {
  error: Error | null;
  resetError: () => void;
  ErrorBoundary: React.ComponentType<{ children: React.ReactNode }>;
}

/**
 * Hook to catch and handle errors in component tree
 */
export function useErrorBoundary(): UseErrorBoundaryReturn {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (error) {
      errorHandler.logError(error, 'Component Error Boundary');
    }
  }, [error]);

  const ErrorBoundary = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      if (error) {
        return (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-semibold">
              Une erreur s'est produite
            </p>
            <p className="text-red-600 dark:text-red-300 text-sm mt-1">
              {error.message}
            </p>
            <button
              onClick={resetError}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        );
      }
      return <>{children}</>;
    },
    [error, resetError]
  );

  return { error, resetError, ErrorBoundary };
}

