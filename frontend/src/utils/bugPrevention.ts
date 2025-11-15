/**
 * Bug Prevention Utilities
 * Centralized utilities to prevent common bugs and crashes
 */

import { errorHandler } from './errorHandler';
import { safeString, safeNumber, safeArray, safeObject, isDefined } from './validation';

/**
 * Safe property access with fallback
 */
export function safeGet<T>(
  obj: unknown,
  path: string,
  fallback: T
): T {
  try {
    if (!obj || typeof obj !== 'object') {
      return fallback;
    }

    const keys = path.split('.');
    let current: unknown = obj;

    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return fallback;
      }
      current = (current as Record<string, unknown>)[key];
    }

    return (current as T) ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safe array access
 */
export function safeArrayAccess<T>(arr: unknown[], index: number, fallback: T): T {
  if (!Array.isArray(arr) || index < 0 || index >= arr.length) {
    return fallback;
  }
  return (arr[index] as T) ?? fallback;
}

/**
 * Safe function call with error handling
 */
export function safeCall<T>(
  fn: () => T,
  fallback: T,
  context?: string
): T {
  try {
    return fn();
  } catch (error) {
    errorHandler.logError(error, context || 'Safe Call');
    return fallback;
  }
}

/**
 * Safe async function call with error handling
 */
export async function safeCallAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    errorHandler.logError(error, context || 'Safe Async Call');
    return fallback;
  }
}

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim().slice(0, 10000); // Max length protection
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(obj: unknown, fallback: string = '{}'): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
}

/**
 * Debounce function to prevent excessive calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit call frequency
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Safe localStorage operations
 */
export const safeStorage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return fallback;
      }
      return safeJsonParse(item, fallback);
    } catch {
      return fallback;
    }
  },

  set: (key: string, value: unknown): boolean => {
    try {
      localStorage.setItem(key, safeJsonStringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Safe sessionStorage operations
 */
export const safeSessionStorage = {
  get: <T>(key: string, fallback: T): T => {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) {
        return fallback;
      }
      return safeJsonParse(item, fallback);
    } catch {
      return fallback;
    }
  },

  set: (key: string, value: unknown): boolean => {
    try {
      sessionStorage.setItem(key, safeJsonStringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

/**
 * Safe URL operations
 */
export function safeUrl(url: string, base?: string): URL | null {
  try {
    return new URL(url, base);
  } catch {
    return null;
  }
}

/**
 * Safe navigation (prevents crashes on invalid routes)
 */
export function safeNavigate(
  navigate: (path: string) => void,
  path: string,
  fallback: string = '/'
): void {
  try {
    if (typeof path === 'string' && path.length > 0 && path.length < 500) {
      navigate(path);
    } else {
      navigate(fallback);
    }
  } catch (error) {
    errorHandler.logError(error, 'Safe Navigate');
    navigate(fallback);
  }
}

/**
 * Safe date parsing
 */
export function safeDate(date: unknown, fallback: Date = new Date()): Date {
  try {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    if (typeof date === 'string') {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    if (typeof date === 'number' && date > 0) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safe number formatting
 */
export function safeFormatNumber(
  value: unknown,
  options?: Intl.NumberFormatOptions,
  fallback: string = '0'
): string {
  try {
    const num = safeNumber(value, 0);
    return new Intl.NumberFormat('fr-FR', options).format(num);
  } catch {
    return fallback;
  }
}

/**
 * Safe string truncation
 */
export function safeTruncate(str: unknown, maxLength: number, suffix: string = '...'): string {
  const safeStr = safeString(str, '');
  if (safeStr.length <= maxLength) {
    return safeStr;
  }
  return safeStr.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Check if value is valid ID
 */
export function isValidId(id: unknown): boolean {
  if (typeof id === 'number') {
    return id > 0 && Number.isInteger(id);
  }
  if (typeof id === 'string') {
    const num = parseInt(id, 10);
    return !isNaN(num) && num > 0;
  }
  return false;
}

/**
 * Safe array operations
 */
export const safeArrayOps = {
  map: <T, U>(arr: unknown[], fn: (item: T, index: number) => U, fallback: U[] = []): U[] => {
    try {
      if (!Array.isArray(arr)) {
        return fallback;
      }
      return arr.map((item, index) => fn(item as T, index));
    } catch {
      return fallback;
    }
  },

  filter: <T>(arr: unknown[], fn: (item: T) => boolean, fallback: T[] = []): T[] => {
    try {
      if (!Array.isArray(arr)) {
        return fallback;
      }
      return arr.filter((item) => fn(item as T)) as T[];
    } catch {
      return fallback;
    }
  },

  find: <T>(arr: unknown[], fn: (item: T) => boolean, fallback: T | null = null): T | null => {
    try {
      if (!Array.isArray(arr)) {
        return fallback;
      }
      const found = arr.find((item) => fn(item as T));
      return (found as T) ?? fallback;
    } catch {
      return fallback;
    }
  },

  reduce: <T, U>(
    arr: unknown[],
    fn: (acc: U, item: T, index: number) => U,
    initial: U,
    fallback: U = initial
  ): U => {
    try {
      if (!Array.isArray(arr)) {
        return fallback;
      }
      return arr.reduce((acc, item, index) => fn(acc, item as T, index), initial);
    } catch {
      return fallback;
    }
  },
};

