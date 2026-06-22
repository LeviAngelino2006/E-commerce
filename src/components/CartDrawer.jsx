import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon, TrashIcon } from './icons.jsx'
import ProductImage from './ProductImage.jsx'
import QuantitySelector from './QuantitySelector.jsx'
import Button from './ui/Button.jsx'
import { useCartStore } from '../store/cartStore.js'
import { useUiStore } from '../store/uiStore.js'
import { formatPrice, brand } from '../config/brand.js'

/**
 * Carrito como drawer lateral global. Se abre/cierra desde uiStore.
 */
export default function CartDrawer() {
  const navigate = useNavigate()
  const open = useUiStore((s) => s.cartOpen)
  const closeCart = useUiStore((s) => s.closeCart)

  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = useCartStore((s) => s.subtotal())

  // Bloquea el scroll del body mientras el drawer está abierto.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Cierra con Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeCart])

  const goCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-ink/40"
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-label="Carrito de compras"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-bg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest">
                Carrito ({items.reduce((n, i) => n + i.qty, 0)})
              </h2>
              <button type="button" onClick={closeCart} aria-label="Cerrar carrito">
                <CloseIcon />
              </button>
            </div>

            {/* Barra de envío gratis */}
            {items.length > 0 && (
              <div className="border-b border-line px-5 py-3">
                {subtotal >= brand.shipping.freeOver ? (
                  <p className="text-xs font-medium text-ink">
                    🎉 ¡Tenés envío gratis!
                  </p>
                ) : (
                  <>
                    <p className="text-xs text-gray">
                      Te faltan{' '}
                      <strong className="font-semibold text-ink">
                        {formatPrice(brand.shipping.freeOver - subtotal)}
                      </strong>{' '}
                      para envío gratis
                    </p>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-ink transition-all duration-500"
                        style={{
                          width: `${Math.min((subtotal / brand.shipping.freeOver) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-gray">Tu carrito está vacío.</p>
                <Button variant="outline" size="sm" onClick={closeCart}>
                  Seguir comprando
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-5">
                    {items.map((item) => (
                      <li key={item.lineId} className="flex gap-4">
                        <div className="w-20 shrink-0">
                          <ProductImage
                            src={item.imagen}
                            alt={item.nombre}
                            ratio="aspect-[3/4]"
                          />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <p className="text-sm font-medium leading-snug">
                              {item.nombre}
                            </p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.lineId)}
                              aria-label={`Eliminar ${item.nombre}`}
                              className="text-gray hover:text-ink"
                            >
                              <TrashIcon width={18} height={18} />
                            </button>
                          </div>
                          <p className="mt-0.5 text-xs uppercase tracking-wide text-gray">
                            Talle {item.talle} · {item.color}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <QuantitySelector
                              value={item.qty}
                              onChange={(q) => updateQty(item.lineId, q)}
                            />
                            <span className="text-sm font-semibold">
                              {formatPrice(item.precio * item.qty)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer / subtotal */}
                <div className="border-t border-line px-5 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-gray">Subtotal</span>
                    <span className="text-lg font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <Button full onClick={goCheckout}>
                    Iniciar compra
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
