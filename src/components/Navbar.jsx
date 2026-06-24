import { useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo.jsx'
import { BagIcon, MenuIcon, CloseIcon, HeartIcon } from './icons.jsx'
import { useCartStore } from '../store/cartStore.js'
import { useUiStore } from '../store/uiStore.js'
import { useWishlistStore } from '../store/wishlistStore.js'
import { useAuthStore, isAuthenticated } from '../store/authStore.js'
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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  const openCart = useUiStore((s) => s.openCart)
  const openAuthModal = useUiStore((s) => s.openAuthModal)
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0))
  const favCount = useWishlistStore((s) => s.items.length)

  const loggedIn = useAuthStore(isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const addToast = useUiStore((s) => s.addToast)

  function handleLogout() {
    setUserMenuOpen(false)
    logout()
    addToast('Hasta pronto')
  }

  // Cierre del menú de usuario al hacer click fuera
  function handleUserBtnBlur(e) {
    if (!userMenuRef.current?.contains(e.relatedTarget)) {
      setUserMenuOpen(false)
    }
  }

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

        {/* Acciones: usuario, favoritos, carrito */}
        <div className="flex flex-1 items-center justify-end gap-1 md:flex-none">
          {/* Sesión */}
          {loggedIn ? (
            <div ref={userMenuRef} className="relative" onBlur={handleUserBtnBlur}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                className="hidden items-center gap-1.5 px-2 py-1 text-xs uppercase tracking-widest text-gray transition-colors hover:text-ink md:flex"
              >
                <span>Hola, {user?.nombre?.split(' ')[0]}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
                  <path d="M5 7L1 3h8z" />
                </svg>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 min-w-[140px] border border-line bg-bg shadow-md"
                  >
                    <Link
                      to="/mis-pedidos"
                      onClick={() => setUserMenuOpen(false)}
                      className="block w-full px-4 py-3 text-left text-xs uppercase tracking-widest text-gray transition-colors hover:text-ink"
                    >
                      Mis pedidos
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full border-t border-line px-4 py-3 text-left text-xs uppercase tracking-widest text-gray transition-colors hover:text-ink"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="hidden px-2 py-1 text-xs uppercase tracking-widest text-gray transition-colors hover:text-ink md:block"
            >
              Iniciar sesión
            </button>
          )}

          {/* Favoritos */}
          <Link
            to="/favoritos"
            aria-label={`Ver favoritos (${favCount})`}
            className="relative p-1"
          >
            <HeartIcon />
            {favCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold text-bg">
                {favCount}
              </span>
            )}
          </Link>

          {/* Carrito */}
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
                <Link
                  to="/favoritos"
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-line py-3 text-sm font-medium uppercase tracking-wide"
                >
                  Favoritos
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
                {/* Sesión en mobile */}
                <div className="mt-4 border-t border-line pt-4">
                  {loggedIn ? (
                    <>
                      <p className="mb-2 text-xs uppercase tracking-widest text-gray">
                        Hola, {user?.nombre?.split(' ')[0]}
                      </p>
                      <Link
                        to="/mis-pedidos"
                        onClick={() => setMobileOpen(false)}
                        className="mb-2 block border-b border-line py-3 text-sm uppercase tracking-wide"
                      >
                        Mis pedidos
                      </Link>
                      <button
                        type="button"
                        onClick={() => { setMobileOpen(false); handleLogout() }}
                        className="text-sm uppercase tracking-wide text-gray"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setMobileOpen(false); openAuthModal() }}
                      className="text-sm font-medium uppercase tracking-wide"
                    >
                      Iniciar sesión
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
