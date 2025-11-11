import { create } from 'zustand'

import apiClient from '../api/client'
import type { Notification, PaginatedResponse } from '../types/api'

interface NotificationsState {
  items: Notification[]
  isFetching: boolean
  fetchAll: () => Promise<void>
  addNotification: (notification: Notification) => void
  markAsRead: (id: number) => Promise<void>
  unreadCount: () => number
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  items: [],
  isFetching: false,
  fetchAll: async () => {
    set({ isFetching: true })
    try {
      const { data } = await apiClient.get<PaginatedResponse<Notification>>('/notifications/')
      set({ items: data.results })
    } finally {
      set({ isFetching: false })
    }
  },
  addNotification: (notification) => {
    set((state) => ({ items: [notification, ...state.items] }))
  },
  markAsRead: async (id: number) => {
    await apiClient.patch(`/notifications/${id}/`, { is_read: true })
    set((state) => ({
      items: state.items.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification,
      ),
    }))
  },
  unreadCount: () => get().items.filter((notification) => !notification.is_read).length,
}))
