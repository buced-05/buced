import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '../stores/auth'
import { errorHandler } from '../utils/errorHandler'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: false,
  timeout: 30000, // 30 seconds timeout
})

apiClient.interceptors.request.use(
  (config) => {
    try {
      // Ne pas ajouter le token pour les endpoints d'authentification
      const url = config.url || ''
      if (url.includes('/auth/token/') || url.includes('/auth/register/')) {
        return config
      }
      
      const token = useAuthStore.getState().accessToken
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    } catch (error) {
      errorHandler.logError(error, 'API Request Interceptor')
      return Promise.reject(error)
    }
  },
  (error) => {
    errorHandler.logError(error, 'API Request Error')
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    // Validate response data structure
    if (!response || !response.data) {
      console.warn('Invalid API response structure:', response)
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    // Log error
    errorHandler.logError(error, 'API Response Error')

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshed = await useAuthStore.getState().refreshTokens()
        if (refreshed && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${refreshed}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        errorHandler.logError(refreshError, 'Token Refresh Error')
        useAuthStore.getState().logout()
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // Handle network errors
    if (errorHandler.isNetworkError(error)) {
      console.error('Network error detected. Check your internet connection.')
    }

    // Handle server errors
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error detected. Please try again later.')
    }

    return Promise.reject(error)
  },
)

export default apiClient
