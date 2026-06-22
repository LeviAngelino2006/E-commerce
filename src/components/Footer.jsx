import { Link } from 'react-router-dom'
import { brand } from '../config/brand.js'
import { TruckIcon, RefreshIcon, ShieldIcon } from './icons.jsx'

const TRUST_ICONS = { truck: TruckIcon, refresh: RefreshIcon, shield: ShieldIcon }

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Trust badges */}
        <div className="mb-12 flex flex-col items-center gap-6 border-b border-line pb-12 sm:flex-row sm:justify-center sm:gap-16">
          {brand.trustBadges.map((badge) => {
            const Icon = TRUST_ICONS[badge.icon]
            return (
              <div key={badge.text} className="flex items-center gap-3">
                {Icon && <Icon width={20} height={20} className="shrink-0 text-gray" />}
                <span className="text-sm text-ink">{badge.text}</span>
              </div>
            )
          })}
        </div>

        <div className="grid gap-10 md:grid-cols-4">
          {/* Marca */}
          <div className="md:col-span-1">
            <p className="font-display text-xl font-bold tracking-tight">
              {brand.name}
            </p>
            <p className="mt-2 max-w-xs text-sm text-gray">{brand.tagline}</p>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="mb-4 text-[11px] uppercase tracking-widest text-gray">
              Tienda
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tienda" className="text-ink hover:text-gray">
                  Ver todo
                </Link>
              </li>
              {brand.categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/tienda?categoria=${encodeURIComponent(c)}`}
                    className="text-ink hover:text-gray"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="mb-4 text-[11px] uppercase tracking-widest text-gray">
              Ayuda
            </h3>
            <ul className="space-y-2 text-sm text-ink">
              <li>Envíos y entregas</li>
              <li>Cambios y devoluciones</li>
              <li>Guía de talles</li>
              <li>
                <a
                  href={`mailto:${brand.contactEmail}`}
                  className="hover:text-gray"
                >
                  {brand.contactEmail}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-[11px] uppercase tracking-widest text-gray">
              Seguinos
            </h3>
            <ul className="space-y-2 text-sm text-ink">
              <li>
                <a href={brand.social.instagram} className="hover:text-gray" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={brand.social.tiktok} className="hover:text-gray" target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-line pt-6 text-xs text-gray sm:flex-row sm:items-center">
          <p>
            © {brand.name}. Demo de e-commerce — sin transacciones reales.
          </p>
          <p>Hecho como template re-skinnable.</p>
        </div>
      </div>
    </footer>
  )
}
