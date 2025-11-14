/**
 * API Health Check Utility
 */
import apiClient from '../api/client';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'unknown';
  database: 'connected' | 'disconnected' | 'unknown';
  message?: string;
  error?: string;
}

let healthCache: HealthStatus | null = null;
let lastCheck = 0;
const CACHE_DURATION = 30000; // 30 seconds

export async function checkApiHealth(): Promise<HealthStatus> {
  const now = Date.now();
  
  // Return cached result if still valid
  if (healthCache && (now - lastCheck) < CACHE_DURATION) {
    return healthCache;
  }

  try {
    const response = await apiClient.get<HealthStatus>('/health/');
    healthCache = response.data;
    lastCheck = now;
    return healthCache;
  } catch (error) {
    const errorStatus: HealthStatus = {
      status: 'unhealthy',
      database: 'unknown',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    healthCache = errorStatus;
    lastCheck = now;
    return errorStatus;
  }
}

export function clearHealthCache(): void {
  healthCache = null;
  lastCheck = 0;
}

