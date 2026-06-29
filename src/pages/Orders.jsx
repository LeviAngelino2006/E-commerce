import { useEffect, useState } from 'react'

import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import { useAuthStore, isAuthenticated } from '../store/authStore.js'
import { useUiStore } from '../store/uiStore.js'
import { formatPrice, brand } from '../config/brand.js'
import api from '../lib/api.js'

const STATUS_LABELS = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

function OrderRow({ order }) {
  const fecha = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'
  const numero = order.numeroOrden ?? order.orderNumber ?? order.id
  const estado = STATUS_LABELS[order.estado] ?? order.estado ?? '—'

  return (
    <li className="grid grid-cols-[1fr_auto] gap-4 border-b border-line px-4 py-4 sm:grid-cols-[auto_1fr_auto_auto] sm:items-center sm:px-6">
      <span className="text-xs font-medium uppercase tracking-widest text-gray sm:w-28">
        {fecha}
      </span>
      <span className="text-sm font-semibold tracking-wide">{numero}</span>
      <span className="text-right text-sm font-semibold sm:text-left">
        {formatPrice(order.total ?? 0)}
      </span>
      <span
        className={`text-right text-xs uppercase tracking-widest sm:text-left ${
          order.estado === 'cancelled' ? 'text-accent' : 'text-gray'
        }`}
      >
        {estado}
      </span>
    </li>
  )
}

export default function Orders() {
  const loggedIn = useAuthStore(isAuthenticated)
  const openAuthModal = useUiStore((s) => s.openAuthModal)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false)
      return
    }
    api
      .get('/api/orders/me')
      .then((res) => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [loggedIn])

  return (
    <PageTransition>
      <Seo title="Mis pedidos" description={`Historial de compras en ${brand.name}.`} />

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Mis pedidos</h1>

        {!loggedIn ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 py-12 text-center">
            <p className="text-base text-gray">
              Iniciá sesión para ver el historial de tus compras.
            </p>
            <Button onClick={openAuthModal}>Iniciar sesión</Button>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4 border-b border-line py-4">
                <div className="h-4 w-20 rounded bg-line" />
                <div className="h-4 flex-1 rounded bg-line" />
                <div className="h-4 w-16 rounded bg-line" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-12 text-center">
            <p className="text-base text-gray">
              No pudimos cargar tus pedidos. Intentá de nuevo.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="border border-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-ink hover:text-bg"
            >
              Reintentar
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 py-12 text-center">
            <p className="text-base text-gray">Todavía no hiciste ningún pedido.</p>
            <Button to="/tienda">Explorar la tienda</Button>
          </div>
        ) : (
          <div className="border border-line">
            <div className="hidden border-b border-line bg-bg/60 px-6 py-3 sm:grid sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4">
              <span className="w-28 text-xs uppercase tracking-widest text-gray">Fecha</span>
              <span className="text-xs uppercase tracking-widest text-gray">Número</span>
              <span className="text-xs uppercase tracking-widest text-gray">Total</span>
              <span className="text-xs uppercase tracking-widest text-gray">Estado</span>
            </div>
            <ul>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
