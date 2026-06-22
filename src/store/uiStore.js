/**
 * uiStore — estado de interfaz efímero (no se persiste).
 * Controla el drawer del carrito, el panel de filtros en mobile y los toasts.
 */
import { create } from 'zustand'

let toastSeq = 0

export const useUiStore = create((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),

  filtersOpen: false,
  openFilters: () => set({ filtersOpen: true }),
  closeFilters: () => set({ filtersOpen: false }),

  // --- Toasts ---
  toasts: [],
  addToast: (message) => {
    const id = ++toastSeq
    set((s) => {
      // máximo 3 toasts visibles; elimina el más antiguo si se supera
      const kept = s.toasts.length >= 3 ? s.toasts.slice(1) : s.toasts
      return { toasts: [...kept, { id, message }] }
    })
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 2500)
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
