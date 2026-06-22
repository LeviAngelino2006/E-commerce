import { Link } from 'react-router-dom'
import { brand } from '../config/brand.js'

/**
 * Wordmark tipográfico. RE-SKIN: para usar un logo en imagen,
 * reemplazá el <span> por un <img src="/logo.svg" alt={brand.name} />.
 */
export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label={`${brand.name} — inicio`}
      className={`font-display text-xl font-bold tracking-tight text-ink ${className}`}
    >
      {brand.name}
    </Link>
  )
}
