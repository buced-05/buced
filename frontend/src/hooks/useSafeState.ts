/**
 * Safe state management hook that prevents crashes
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { errorHandler } from '../utils/errorHandler';
import { safeString, safeNumber, safeArray, safeObject } from '../utils/validation';

/**
 * Safe useState wrapper that validates and sanitizes values
 */
export function useSafeState<T>(
  initialValue: T,
  validator?: (value: T) => boolean,
  sanitizer?: (value: T) => T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const validatorRef = useRef(validator);
  const sanitizerRef = useRef(sanitizer);

  useEffect(() => {
    validatorRef.current = validator;
    sanitizerRef.current = sanitizer;
  }, [validator, sanitizer]);

  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const newValue = typeof value === 'function' 
        ? (value as (prev: T) => T)(state)
        : value;

      // Sanitize if sanitizer provided
      const sanitized = sanitizerRef.current 
        ? sanitizerRef.current(newValue)
        : newValue;

      // Validate if validator provided
      if (validatorRef.current && !validatorRef.current(sanitized)) {
        errorHandler.logError(
          new Error(`Invalid state value: ${String(sanitized)}`),
          'useSafeState'
        );
        return;
      }

      setState(sanitized);
    } catch (error) {
      errorHandler.logError(error, 'useSafeState');
    }
  }, [state]);

  return [state, safeSetState];
}

/**
 * Safe string state
 */
export function useSafeStringState(initialValue: string = '', maxLength?: number) {
  return useSafeState(
    initialValue,
    (value) => typeof value === 'string' && (maxLength === undefined || value.length <= maxLength),
    (value) => safeString(value, '').slice(0, maxLength)
  );
}

/**
 * Safe number state
 */
export function useSafeNumberState(initialValue: number = 0, min?: number, max?: number) {
  return useSafeState(
    initialValue,
    (value) => {
      const num = safeNumber(value, 0);
      if (min !== undefined && num < min) return false;
      if (max !== undefined && num > max) return false;
      return true;
    },
    (value) => {
      let num = safeNumber(value, 0);
      if (min !== undefined && num < min) num = min;
      if (max !== undefined && num > max) num = max;
      return num;
    }
  );
}

/**
 * Safe array state
 */
export function useSafeArrayState<T>(initialValue: T[] = []) {
  return useSafeState(
    initialValue,
    (value) => Array.isArray(value),
    (value) => safeArray(value, []) as T[]
  );
}

/**
 * Safe object state
 */
export function useSafeObjectState<T extends Record<string, unknown>>(
  initialValue: T,
  fallback: T
) {
  return useSafeState(
    initialValue,
    (value) => value !== null && typeof value === 'object' && !Array.isArray(value),
    (value) => safeObject(value, fallback)
  );
}

