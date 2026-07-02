import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './authStore.js'
import api from '../lib/api.js'

const GUEST_KEY = 'manto-wishlist-guest'

function readGuest() {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY) || '[]') }
  catch { return [] }
}
function writeGuest(ids) { localStorage.setItem(GUEST_KEY, JSON.stringify(ids)) }
function clearGuest() { localStorage.removeItem(GUEST_KEY) }

// El backend puede devolver strings de ids u objetos { productId }
function normalizeIds(raw) {
  const list = Array.isArray(raw) ? raw : (raw?.items ?? [])
  return list.map((i) => (typeof i === 'string' ? i : i.productId))
}

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // array de productIds

      loadFavorites: async () => {
        const { token } = useAuthStore.getState()
        if (token) {
          try {
            const { data } = await api.get('/api/favorites')
            set({ items: normalizeIds(data) })
          } catch { /* silently fail */ }
        } else {
          set({ items: readGuest() })
        }
      },

      toggleFavorite: async (productId) => {
        const { token } = useAuthStore.getState()
        if (token) {
          const isFav = get().items.includes(productId)
          try {
            if (isFav) {
              await api.delete(`/api/favorites/${productId}`)
              set((s) => ({ items: s.items.filter((id) => id !== productId) }))
            } else {
              await api.post(`/api/favorites/${productId}`)
              set((s) => ({ items: [...s.items, productId] }))
            }
          } catch { /* silently fail */ }
        } else {
          set((s) => {
            const newItems = s.items.includes(productId)
              ? s.items.filter((id) => id !== productId)
              : [...s.items, productId]
            writeGuest(newItems)
            return { items: newItems }
          })
        }
      },

      isFavorite: (productId) => get().items.includes(productId),

      onLogout: () => {
        clearGuest()
        set({ items: [] })
      },

      mergeGuestFavoritesAndLoad: async () => {
        const guestIds = readGuest()
        if (guestIds.length > 0) {
          try {
            const { data: existing } = await api.get('/api/favorites')
            const dbIds = normalizeIds(existing)
            const merged = [...new Set([...dbIds, ...guestIds])]
            const { data: result } = await api.put('/api/favorites', { productIds: merged })
            set({ items: normalizeIds(result) })
          } catch { /* silently fail */ }
          clearGuest()
        } else {
          await get().loadFavorites()
        }
      },

      // Historial de vistos recientemente — sin cambios, persiste via Zustand
      history: [],
      addToHistory: (id) =>
        set((s) => {
          const filtered = s.history.filter((i) => i !== id)
          return { history: [id, ...filtered].slice(0, 6) }
        }),
    }),
    {
      name: 'vertice-wishlist',
      // Solo persiste history; items se gestiona via API o manto-wishlist-guest
      partialize: (state) => ({ history: state.history }),
    }
  )
)
