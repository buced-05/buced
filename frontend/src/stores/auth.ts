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
          // Le backend accepte email grâce au EmailTokenObtainPairSerializer
          // On peut envoyer username (qui peut être un email) ou email
          const payload: Record<string, string> = { password };
          
          // Si username ressemble à un email, utiliser 'email', sinon 'username'
          if (username.includes('@')) {
            payload.email = username.trim().toLowerCase();
          } else {
            payload.username = username.trim();
          }
          
          const { data } = await apiClient.post('/v1/auth/token/', payload)
          
          if (!data.access || !data.refresh) {
            throw new Error('Tokens manquants dans la réponse')
          }
          
          set({ accessToken: data.access, refreshToken: data.refresh })
          await get().fetchProfile()
        } catch (error) {
          console.error('Erreur lors de la connexion:', error)
          throw error
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
        const { data } = await apiClient.post('/v1/auth/token/refresh/', { refresh })
        set({ accessToken: data.access, refreshToken: data.refresh ?? refresh })
        return data.access as string
      },
      fetchProfile: async () => {
        const { data } = await apiClient.get<User>('/v1/auth/profile/')
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
