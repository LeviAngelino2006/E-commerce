import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo.jsx'
import { BagIcon, MenuIcon, CloseIcon } from './icons.jsx'
import { useCartStore } from '../store/cartStore.js'
import { useUiStore } from '../store/uiStore.js'
import { brand } from '../config/brand.js'

const NAV = [
  { to: '/tienda', label: 'Tienda' },
  ...brand.categories.map((c) => ({
    to: `/tienda?categoria=${encodeURIComponent(c)}`,
    label: c,
  })),
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const openCart = useUiStore((s) => s.openCart)
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0))

  return (
    <header className="border-b border-line bg-bg/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile: hamburguesa */}
        <button
          type="button"
          className="md:hidden"
          aria-label="Abrir menú"
          onClick={() => setMobileOpen(true)}
        >
          <MenuIcon />
        </button>

        {/* Logo (centrado en mobile) */}
        <div className="md:flex-1">
          <Logo />
        </div>

        {/* Desktop: links */}
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-xs uppercase tracking-widest transition-colors hover:text-ink ${
                  isActive ? 'text-ink' : 'text-gray'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Carrito */}
        <div className="flex flex-1 items-center justify-end md:flex-none">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir carrito (${itemCount} ítems)`}
            className="relative p-1"
          >
            <BagIcon />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-bg">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-bg p-6 md:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  onClick={() => setMobileOpen(false)}
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  to="/tienda"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-line py-3 text-sm font-medium uppercase tracking-wide"
                >
                  Tienda
                </Link>
                {brand.categories.map((c) => (
                  <Link
                    key={c}
                    to={`/tienda?categoria=${encodeURIComponent(c)}`}
                    onClick={() => setMobileOpen(false)}
                    className="border-b border-line py-3 text-sm uppercase tracking-wide text-gray"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
