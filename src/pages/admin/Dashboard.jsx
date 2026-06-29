import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api.js'
import { formatPrice } from '../../config/brand.js'

const STATUS_LABELS = {
  PAGADA: 'Pagada',
  ENVIADA: 'Enviada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
}

function MetricCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg border border-line p-5">
      <p className="text-xs text-gray uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/api/admin/dashboard')
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-gray">Cargando métricas…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          Error al cargar el dashboard: {error}
        </div>
      </div>
    )
  }

  const ordersByStatus = data?.pedidosPorEstado || {}
  const lowStock = data?.productosBajoStock || []

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">Dashboard</h1>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <MetricCard
          label="Ventas totales"
          value={formatPrice(data?.ventasTotales ?? 0)}
        />
        <MetricCard
          label="Pedidos"
          value={data?.cantidadPedidos ?? 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders by status */}
        <div className="bg-white rounded-lg border border-line p-5">
          <h2 className="font-display font-semibold text-ink text-sm uppercase tracking-wider mb-4">
            Pedidos por estado
          </h2>
          {Object.keys(ordersByStatus).length === 0 ? (
            <p className="text-sm text-gray">Sin datos aún.</p>
          ) : (
            <ul className="space-y-2.5">
              {Object.entries(ordersByStatus).map(([status, count]) => (
                <li key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray">
                    {STATUS_LABELS[status] || status}
                  </span>
                  <span className="font-semibold text-ink tabular-nums">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-lg border border-line p-5">
          <h2 className="font-display font-semibold text-ink text-sm uppercase tracking-wider mb-4">
            Poco stock
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-gray">No hay productos con stock bajo.</p>
          ) : (
            <ul className="space-y-2.5">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <Link
                    to="/admin/productos"
                    className="text-sm text-accent hover:underline underline-offset-4 truncate"
                  >
                    {p.nombre}
                  </Link>
                  <span className="flex-shrink-0 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                    {p.stock} ud.
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
