/**
 * Validation utilities for data safety
 */

/**
 * Check if value is not null or undefined
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Get safe string value with fallback
 */
export function safeString(value: unknown, fallback: string = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (value === null || value === undefined) {
    return fallback;
  }
  return String(value);
}

/**
 * Get safe number value with fallback
 */
export function safeNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

/**
 * Get safe array value with fallback
 */
export function safeArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value;
  }
  return fallback;
}

/**
 * Get safe object value with fallback
 */
export function safeObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T
): T {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as T;
  }
  return fallback;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize string input (basic XSS protection)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate required fields
 */
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  fields: (keyof T)[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];

  for (const field of fields) {
    const value = data[field];
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      missingFields.push(String(field));
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Deep clone object safely
 */
export function safeClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj)) as T;
  } catch {
    return obj;
  }
}

