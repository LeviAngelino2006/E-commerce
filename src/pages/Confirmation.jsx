import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { CheckIcon } from '../components/icons.jsx'
import { useCartStore } from '../store/cartStore.js'
import { formatPrice, brand } from '../config/brand.js'

export default function Confirmation() {
  const clearCart = useCartStore((s) => s.clearCart)

  // Snapshot del pedido leído una sola vez (initializer perezoso).
  const [order] = useState(() => {
    const raw = sessionStorage.getItem('vertice-last-order')
    return raw ? JSON.parse(raw) : null
  })

  // Vacía el carrito al llegar a la confirmación (efecto secundario externo).
  useEffect(() => {
    clearCart()
  }, [clearCart])

  if (!order) {
    return (
      <PageTransition>
        <Seo title="Confirmación" />
        <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold">No hay un pedido reciente</h1>
          <p className="mt-2 text-gray">
            Cuando completes una compra, vas a ver acá el detalle.
          </p>
          <Button to="/tienda" className="mt-6">
            Ir a la tienda
          </Button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <Seo title="¡Gracias por tu compra!" />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {/* Éxito */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink text-bg"
          >
            <CheckIcon width={32} height={32} strokeWidth={2} />
          </motion.div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            ¡Gracias por tu compra!
          </h1>
          <p className="mt-2 text-sm text-gray">
            Te enviamos la confirmación a{' '}
            <span className="text-ink">{order.email}</span>. (Demo — no se envían
            emails reales.)
          </p>
          <p className="mt-4 inline-block border border-line px-4 py-2 text-sm">
            Número de orden:{' '}
            <span className="font-semibold tracking-wide">{order.orderNumber}</span>
          </p>
        </div>

        {/* Resumen */}
        <div className="mt-12 border border-line">
          <div className="border-b border-line px-6 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest">
              Resumen del pedido
            </h2>
          </div>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.lineId} className="flex gap-4 px-6 py-4">
                <div className="w-16 shrink-0">
                  <ProductImage src={item.imagen} alt={item.nombre} />
                </div>
                <div className="flex flex-1 flex-col text-sm">
                  <span className="font-medium">{item.nombre}</span>
                  <span className="text-xs text-gray">
                    Talle {item.talle} · {item.color} · x{item.qty}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {formatPrice(item.precio * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-line px-6 py-4 text-sm">
            <div className="flex justify-between text-gray">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray">
              <span>Envío</span>
              <span>
                {order.shipping === 0 ? 'Gratis' : formatPrice(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button to="/tienda" size="lg">
            Seguir comprando
          </Button>
          <p className="mt-6 text-xs text-gray">
            {brand.name} — {brand.tagline}
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
