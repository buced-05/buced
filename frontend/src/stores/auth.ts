import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import apiClient from '../api/client'
import type { User } from '../types/api'

interface Credentials {
  username: string
  password: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticating: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => void
  refreshTokens: () => Promise<string | null>
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticating: false,
      login: async ({ username, password }) => {
        set({ isAuthenticating: true })
        try {
          const { data } = await apiClient.post('/auth/token/', { username, password })
          set({ accessToken: data.access, refreshToken: data.refresh })
          await get().fetchProfile()
        } finally {
          set({ isAuthenticating: false })
        }
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null })
      },
      refreshTokens: async () => {
        const refresh = get().refreshToken
        if (!refresh) {
          get().logout()
          return null
        }
        const { data } = await apiClient.post('/auth/token/refresh/', { refresh })
        set({ accessToken: data.access, refreshToken: data.refresh ?? refresh })
        return data.access as string
      },
      fetchProfile: async () => {
        const { data } = await apiClient.get<User>('/auth/profile/')
        set({ user: data })
      },
    }),
    {
      name: 'buced-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ accessToken, refreshToken, user }) => ({ accessToken, refreshToken, user }),
    },
  ),
)
