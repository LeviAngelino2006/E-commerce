import { Outlet, NavLink, Link } from 'react-router-dom'
import { brand } from '../../config/brand.js'
import { useAuthStore } from '../../store/authStore.js'

const navClass = ({ isActive }) =>
  [
    'block px-3 py-2 rounded text-sm transition-colors',
    isActive
      ? 'bg-white/15 text-white font-medium'
      : 'text-white/60 hover:bg-white/10 hover:text-white',
  ].join(' ')

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-ink flex flex-col">
        <div className="px-4 py-5 border-b border-white/10">
          <span className="block font-display font-bold text-white tracking-wide text-base">
            {brand.name}
          </span>
          <span className="block text-xs text-white/40 mt-0.5">
            Administración
          </span>
        </div>

        {user && (
          <div className="px-4 py-2.5 border-b border-white/10">
            <span className="text-xs text-white/45 truncate block">
              {user.nombre || user.email}
            </span>
          </div>
        )}

        <nav className="flex-1 p-3 space-y-0.5">
          <NavLink to="/admin" end className={navClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/productos" className={navClass}>
            Productos
          </NavLink>
          <NavLink to="/admin/pedidos" className={navClass}>
            Pedidos
          </NavLink>
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            to="/"
            className="block px-3 py-2 rounded text-sm text-white/45 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 bg-bg overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
