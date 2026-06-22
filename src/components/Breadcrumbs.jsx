import { Link } from 'react-router-dom'

/**
 * Breadcrumb reutilizable.
 * @param {Array<{label: string, to?: string}>} items — último ítem sin `to` (texto plano)
 */
export default function Breadcrumbs({ items }) {
  return (
    <nav
      aria-label="Ruta de navegación"
      className="mb-6 flex flex-wrap items-center gap-1 text-[11px] uppercase tracking-widest text-gray"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden className="select-none">/</span>}
          {item.to ? (
            <Link to={item.to} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
