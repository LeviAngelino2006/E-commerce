/**
 * uiStore — estado de interfaz efímero (no se persiste).
 * Controla el drawer del carrito y el panel de filtros en mobile.
 */
import { create } from 'zustand'

export const useUiStore = create((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),

  filtersOpen: false,
  openFilters: () => set({ filtersOpen: true }),
  closeFilters: () => set({ filtersOpen: false }),
}))
