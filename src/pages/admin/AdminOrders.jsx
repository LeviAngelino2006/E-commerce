import { useEffect, useState, Fragment } from 'react'
import api from '../../lib/api.js'
import { formatPrice } from '../../config/brand.js'
import { useUiStore } from '../../store/uiStore.js'

const STATUSES = ['PAGADA', 'ENVIADA', 'ENTREGADA', 'CANCELADA']

const STATUS_STYLES = {
  PAGADA: 'bg-blue-50 text-blue-700',
  ENVIADA: 'bg-yellow-50 text-yellow-700',
  ENTREGADA: 'bg-green-50 text-green-700',
  CANCELADA: 'bg-red-50 text-red-600',
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [details, setDetails] = useState({})
  const [loadingDetail, setLoadingDetail] = useState(null)
  const addToast = useUiStore((s) => s.addToast)

  useEffect(() => {
    api
      .get('/api/admin/orders')
      .then((r) => setOrders(Array.isArray(r.data) ? r.data : r.data.orders || []))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  const changeStatus = async (order, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${order.id}/estado`, { estado: newStatus })
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, estado: newStatus } : o))
      )
      addToast(`Pedido actualizado a "${newStatus}".`)
    } catch (e) {
      addToast(e.response?.data?.error || 'Error al actualizar el estado.')
    }
  }

  const toggleDetail = async (orderId) => {
    if (expanded === orderId) {
      setExpanded(null)
      return
    }
    setExpanded(orderId)
    if (!details[orderId]) {
      setLoadingDetail(orderId)
      try {
        const r = await api.get(`/api/orders/${orderId}`)
        setDetails((prev) => ({ ...prev, [orderId]: r.data }))
      } catch {
        setDetails((prev) => ({ ...prev, [orderId]: null }))
      } finally {
        setLoadingDetail(null)
      }
    }
  }

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Pedidos</h1>

      {loading && (
        <p className="text-sm text-gray">Cargando pedidos…</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium">
                  Orden
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium hidden sm:table-cell">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium hidden md:table-cell">
                  Cliente
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium hidden sm:table-cell">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium">
                  Estado
                </th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray">
                    No hay pedidos aún.
                  </td>
                </tr>
              )}
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    className="border-t border-line hover:bg-bg/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-ink">
                      #{String(order.id).slice(0, 8)}
                    </td>
                    <td className="px-4 py-3 text-gray hidden sm:table-cell">
                      {formatDate(order.createdAt || order.fecha)}
                    </td>
                    <td className="px-4 py-3 text-gray hidden md:table-cell max-w-[160px] truncate">
                      {order.user?.nombre || order.user?.email || order.cliente || '—'}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink hidden sm:table-cell">
                      {formatPrice(order.total ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.estado || ''}
                        onChange={(e) => changeStatus(order, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ink ${
                          STATUS_STYLES[order.estado] || 'bg-bg text-gray'
                        }`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleDetail(order.id)}
                        className="text-xs text-gray hover:text-ink transition-colors underline underline-offset-4"
                      >
                        {expanded === order.id ? 'Cerrar' : 'Ver detalle'}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {expanded === order.id && (
                    <tr className="border-t border-line bg-bg/40">
                      <td colSpan={6} className="px-6 py-4">
                        {loadingDetail === order.id && (
                          <p className="text-xs text-gray">Cargando…</p>
                        )}
                        {details[order.id] === null && (
                          <p className="text-xs text-red-500">No se pudo cargar el detalle.</p>
                        )}
                        {details[order.id] && (
                          <div>
                            <p className="text-xs font-medium text-gray uppercase tracking-wider mb-2">
                              Items
                            </p>
                            <ul className="space-y-1.5">
                              {(details[order.id].items || []).map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-ink">
                                    {item.nombre || item.productId}
                                    {item.talle && (
                                      <span className="text-gray ml-2">
                                        T: {item.talle}
                                      </span>
                                    )}
                                    {item.color && (
                                      <span className="text-gray ml-1">
                                        / {item.color}
                                      </span>
                                    )}
                                    <span className="text-gray ml-2">
                                      × {item.qty || item.cantidad || 1}
                                    </span>
                                  </span>
                                  <span className="tabular-nums text-gray">
                                    {formatPrice(
                                      (item.precio || item.price || 0) *
                                        (item.qty || item.cantidad || 1)
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
