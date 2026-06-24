import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { CheckIcon } from '../components/icons.jsx'
import { useCartStore } from '../store/cartStore.js'
import { formatPrice, brand } from '../config/brand.js'
import api from '../lib/api.js'

export default function Confirmation() {
  const { orderId } = useParams()
  const clearCart = useCartStore((s) => s.clearCart)

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      setError(true)
      return
    }
    api
      .get(`/api/orders/${orderId}`)
      .then((res) => {
        setOrder(res.data)
        setLoading(false)
        clearCart()
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  // clearCart is stable (Zustand), orderId changes only on navigation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  if (loading) {
    return (
      <PageTransition>
        <Seo title="Confirmando pedido..." />
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4">
          <svg
            className="h-8 w-8 animate-spin text-ink"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Cargando"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="mt-4 text-sm text-gray">Confirmando tu pedido...</p>
        </div>
      </PageTransition>
    )
  }

  if (error || !order) {
    return (
      <PageTransition>
        <Seo title="Confirmación" />
        <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold">No pudimos encontrar tu pedido</h1>
          <p className="mt-2 text-sm text-gray">
            Si completaste la compra, guardá el número de orden que recibiste.
          </p>
          <Button to="/tienda" className="mt-6">
            Ir a la tienda
          </Button>
        </div>
      </PageTransition>
    )
  }

  // The backend may return different field names; normalize here.
  const orderNumber = order.numeroOrden ?? order.orderNumber ?? order.id
  const orderItems = order.items ?? []
  const orderSubtotal = order.subtotal ?? 0
  const orderShipping = order.shipping ?? order.envio ?? 0
  const orderTotal = order.total ?? 0
  const orderEmail = order.email ?? order.envio?.email ?? ''

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
          {orderEmail && (
            <p className="mt-2 text-sm text-gray">
              Te enviamos la confirmación a{' '}
              <span className="text-ink">{orderEmail}</span>. (Demo — no se envían
              emails reales.)
            </p>
          )}
          <p className="mt-4 inline-block border border-line px-4 py-2 text-sm">
            Número de orden:{' '}
            <span className="font-semibold tracking-wide">{orderNumber}</span>
          </p>
        </div>

        {/* Resumen */}
        {orderItems.length > 0 && (
          <div className="mt-12 border border-line">
            <div className="border-b border-line px-6 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest">
                Resumen del pedido
              </h2>
            </div>
            <ul className="divide-y divide-line">
              {orderItems.map((item, idx) => (
                <li key={item.lineId ?? item.id ?? idx} className="flex gap-4 px-6 py-4">
                  {item.imagen && (
                    <div className="w-16 shrink-0">
                      <ProductImage src={item.imagen} alt={item.nombre ?? ''} />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-medium">{item.nombre ?? item.nombreProducto ?? item.productId}</span>
                    <span className="text-xs text-gray">
                      {item.talle && `Talle ${item.talle}`}
                      {item.talle && item.color && ' · '}
                      {item.color}
                      {(item.qty ?? item.cantidad) && ` · x${item.qty ?? item.cantidad}`}
                    </span>
                  </div>
                  {item.precio != null && (
                    <span className="text-sm font-medium">
                      {formatPrice(item.precio * (item.qty ?? item.cantidad ?? 1))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-line px-6 py-4 text-sm">
              <div className="flex justify-between text-gray">
                <span>Subtotal</span>
                <span>{formatPrice(orderSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray">
                <span>Envío</span>
                <span>
                  {orderShipping === 0 ? 'Gratis' : formatPrice(orderShipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>
        )}

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
