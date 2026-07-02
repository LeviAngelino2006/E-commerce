import { create } from 'zustand'
import { useAuthStore } from './authStore.js'
import api from '../lib/api.js'

const GUEST_KEY = 'manto-cart-guest'

const guestLineId = (productId, talle, color) => `${productId}__${talle}__${color}`

function readGuest() {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY) || '[]') }
  catch { return [] }
}
function writeGuest(items) { localStorage.setItem(GUEST_KEY, JSON.stringify(items)) }
function clearGuest() { localStorage.removeItem(GUEST_KEY) }

const mapApiItemToStoreItem = (item) => ({
  lineId: item.id,
  productId: item.productId,
  nombre: item.product.nombre,
  precio: item.product.precio,
  imagen: item.product.imagenes?.[0] ?? '',
  talle: item.talle,
  color: item.color,
  qty: item.cantidad,
})

export const useCartStore = create((set, get) => ({
  items: [],
  syncing: false,

  loadCart: async () => {
    const { token } = useAuthStore.getState()
    if (token) {
      set({ syncing: true })
      try {
        const { data } = await api.get('/api/cart')
        const list = Array.isArray(data) ? data : (data?.items ?? [])
        set({ items: list.map(mapApiItemToStoreItem) })
      } catch { /* silently fail */ }
      finally { set({ syncing: false }) }
    } else {
      set({ items: readGuest() })
    }
  },

  addItem: async (product, { talle, color, qty = 1 }) => {
    const { token } = useAuthStore.getState()
    if (token) {
      set({ syncing: true })
      try {
        const existing = get().items.find(
          (i) => i.productId === product.id && i.talle === talle && i.color === color
        )
        const cantidad = existing ? existing.qty + qty : qty
        await api.put('/api/cart', { productId: product.id, talle, color, cantidad })
        await get().loadCart()
      } catch { /* silently fail */ }
      finally { set({ syncing: false }) }
    } else {
      const id = guestLineId(product.id, talle, color)
      set((s) => {
        const existing = s.items.find((i) => i.lineId === id)
        const newItems = existing
          ? s.items.map((i) => i.lineId === id ? { ...i, qty: i.qty + qty } : i)
          : [
              ...s.items,
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
            ]
        writeGuest(newItems)
        return { items: newItems }
      })
    }
  },

  removeItem: async (lineId) => {
    const { token } = useAuthStore.getState()
    if (token) {
      set({ syncing: true })
      try {
        await api.delete(`/api/cart/${lineId}`)
        set((s) => ({ items: s.items.filter((i) => i.lineId !== lineId) }))
      } catch { /* silently fail */ }
      finally { set({ syncing: false }) }
    } else {
      set((s) => {
        const newItems = s.items.filter((i) => i.lineId !== lineId)
        writeGuest(newItems)
        return { items: newItems }
      })
    }
  },

  updateQty: async (lineId, qty) => {
    const { token } = useAuthStore.getState()
    if (token) {
      set({ syncing: true })
      try {
        if (qty <= 0) {
          await api.delete(`/api/cart/${lineId}`)
          set((s) => ({ items: s.items.filter((i) => i.lineId !== lineId) }))
        } else {
          const item = get().items.find((i) => i.lineId === lineId)
          if (!item) return
          await api.put('/api/cart', {
            productId: item.productId,
            talle: item.talle,
            color: item.color,
            cantidad: qty,
          })
          set((s) => ({
            items: s.items.map((i) => i.lineId === lineId ? { ...i, qty } : i),
          }))
        }
      } catch { /* silently fail */ }
      finally { set({ syncing: false }) }
    } else {
      set((s) => {
        const newItems = s.items
          .map((i) => i.lineId === lineId ? { ...i, qty: Math.max(1, qty) } : i)
          .filter((i) => i.qty > 0)
        writeGuest(newItems)
        return { items: newItems }
      })
    }
  },

  clearCart: async () => {
    const { token } = useAuthStore.getState()
    if (token) {
      try { await api.delete('/api/cart') } catch { /* silently fail */ }
    }
    clearGuest()
    set({ items: [] })
  },

  // Llama después de setSession: fusiona el carrito invitado con la DB y recarga.
  mergeGuestCartAndLoad: async () => {
    const guestItems = readGuest()
    for (const item of guestItems) {
      try {
        await api.put('/api/cart', {
          productId: item.productId,
          talle: item.talle,
          color: item.color,
          cantidad: item.qty,
        })
      } catch { /* skip items that fail */ }
    }
    clearGuest()
    await get().loadCart()
  },

  // Llama al cerrar sesión: vacía el store y el localStorage invitado.
  onLogout: () => {
    clearGuest()
    set({ items: [] })
  },

  subtotal: () => get().items.reduce((sum, i) => sum + i.precio * i.qty, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
}))
