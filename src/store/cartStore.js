/**
 * cartStore — estado global del carrito, persistido en localStorage.
 *
 * Cada item se identifica por la combinación producto+talle+color (lineId),
 * así dos variantes del mismo producto conviven como líneas distintas.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const lineId = (productId, talle, color) => `${productId}__${talle}__${color}`

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      /** Agrega una variante; si ya existe, suma cantidad. */
      addItem: (product, { talle, color, qty = 1 }) => {
        const id = lineId(product.id, talle, color)
        set((state) => {
          const existing = state.items.find((i) => i.lineId === id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.lineId === id ? { ...i, qty: i.qty + qty } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                lineId: id,
                productId: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagenes?.[0] ?? '',
                talle,
                color,
                qty,
              },
            ],
          }
        })
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.lineId !== id) })),

      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.lineId === id ? { ...i, qty: Math.max(1, qty) } : i))
            .filter((i) => i.qty > 0),
        })),

      clearCart: () => set({ items: [] }),

      // --- Selectores derivados ---
      subtotal: () => get().items.reduce((sum, i) => sum + i.precio * i.qty, 0),
      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'vertice-cart', // RE-SKIN: clave de localStorage
    }
  )
)
