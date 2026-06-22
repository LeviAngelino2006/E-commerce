import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWishlistStore = create(
  persist(
    (set) => ({
      // Favoritos
      items: [],
      toggleFavorite: (id) =>
        set((s) => ({
          items: s.items.includes(id)
            ? s.items.filter((i) => i !== id)
            : [...s.items, id],
        })),

      // Historial de vistos recientemente (máx 6, más reciente primero)
      history: [],
      addToHistory: (id) =>
        set((s) => {
          const filtered = s.history.filter((i) => i !== id)
          return { history: [id, ...filtered].slice(0, 6) }
        }),
    }),
    { name: 'vertice-wishlist' }
  )
)
