import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.js'

export default function AdminRoute() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)

  if (!token || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center max-w-sm px-6">
          <h2 className="font-display text-xl font-semibold text-ink mb-3">
            Acceso restringido
          </h2>
          <p className="text-sm text-gray mb-6">
            Esta sección es solo para administradores.
          </p>
          <Link
            to="/"
            className="text-sm text-accent underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return <Outlet />
}
