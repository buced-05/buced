/**
 * Centralized error handling utility
 */

export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  timestamp: Date;
}

class ErrorHandler {
  private errors: AppError[] = [];
  private maxErrors = 100;

  /**
   * Log an error with context
   */
  logError(error: unknown, context?: string): AppError {
    const appError: AppError = {
      message: this.getErrorMessage(error),
      code: this.getErrorCode(error),
      status: this.getErrorStatus(error),
      details: error,
      timestamp: new Date(),
    };

    // Add context if provided
    if (context) {
      console.error(`[${context}]`, appError);
    } else {
      console.error(appError);
    }

    // Store error (keep only last N errors)
    this.errors.push(appError);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // In production, you could send to error reporting service
    // Example: Sentry.captureException(error, { tags: { context } });

    return appError;
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: unknown): string {
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes("Network Error") || error.message.includes("fetch")) {
        return "Erreur de connexion. Vérifiez votre connexion internet.";
      }
      if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        return "Session expirée. Veuillez vous reconnecter.";
      }
      if (error.message.includes("403") || error.message.includes("Forbidden")) {
        return "Vous n'avez pas les permissions nécessaires.";
      }
      if (error.message.includes("404") || error.message.includes("Not Found")) {
        return "Ressource introuvable.";
      }
      if (error.message.includes("500") || error.message.includes("Internal Server Error")) {
        return "Erreur serveur. Veuillez réessayer plus tard.";
      }
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "Une erreur inattendue s'est produite.";
  }

  /**
   * Extract error message from unknown error
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }
    return "Erreur inconnue";
  }

  /**
   * Extract error code if available
   */
  private getErrorCode(error: unknown): string | undefined {
    if (error && typeof error === "object") {
      if ("code" in error) {
        return String(error.code);
      }
      if ("error" in error && typeof error.error === "object" && error.error && "code" in error.error) {
        return String(error.error.code);
      }
    }
    return undefined;
  }

  /**
   * Extract HTTP status code if available
   */
  private getErrorStatus(error: unknown): number | undefined {
    if (error && typeof error === "object") {
      if ("status" in error) {
        return Number(error.status);
      }
      if ("response" in error && error.response && typeof error.response === "object" && "status" in error.response) {
        return Number(error.response.status);
      }
    }
    return undefined;
  }

  /**
   * Get all logged errors
   */
  getErrors(): AppError[] {
    return [...this.errors];
  }

  /**
   * Clear all errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(error: unknown): boolean {
    const message = this.getErrorMessage(error).toLowerCase();
    return (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection") ||
      message.includes("timeout")
    );
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(error: unknown): boolean {
    const status = this.getErrorStatus(error);
    return status === 401 || status === 403;
  }
}

export const errorHandler = new ErrorHandler();

/**
 * Safe async wrapper that catches errors
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    errorHandler.logError(error, context);
    return fallback;
  }
}

/**
 * Safe sync wrapper that catches errors
 */
export function safeSync<T>(
  fn: () => T,
  fallback?: T,
  context?: string
): T | undefined {
  try {
    return fn();
  } catch (error) {
    errorHandler.logError(error, context);
    return fallback;
  }
}

