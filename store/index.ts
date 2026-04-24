'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AppState {
  user: User | null
  setUser: (user: User | null) => void

  favIds: string[]
  toggleFav: (id: string) => void

  toast: { msg: string; type: 'ok' | 'error' | 'info' } | null
  showToast: (msg: string, type?: 'ok' | 'error' | 'info') => void

  authOpen: boolean
  setAuthOpen: (v: boolean) => void

  chatOpen: boolean
  chatListingId: string | null
  openChat: (listingId: string) => void
  closeChat: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      favIds: [],
      toggleFav: (id) =>
        set((s) => ({
          favIds: s.favIds.includes(id)
            ? s.favIds.filter((f) => f !== id)
            : [...s.favIds, id],
        })),

      toast: null,
      showToast: (msg, type = 'ok') => {
        set({ toast: { msg, type } })
        setTimeout(() => set({ toast: null }), 3000)
      },

      authOpen: false,
      setAuthOpen: (v) => set({ authOpen: v }),

      chatOpen: false,
      chatListingId: null,
      openChat: (listingId) => set({ chatOpen: true, chatListingId: listingId }),
      closeChat: () => set({ chatOpen: false, chatListingId: null }),
    }),
    {
      name: 'mekendesh-store',
      partialize: (state) => ({ user: state.user, favIds: state.favIds }),
    }
  )
)
