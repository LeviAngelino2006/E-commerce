import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import Button from '../components/ui/Button.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { useCatalogData, getFeatured, getNew } from '../lib/catalog.js'
import { brand } from '../config/brand.js'
import { useWishlistStore } from '../store/wishlistStore.js'

// RE-SKIN: imagen editorial del hero. Reemplazar por foto de campaña del cliente.
const HERO_IMG =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80'

function SectionHeader({ title, to, linkLabel = 'Ver todo' }) {
  return (
    <div className="mb-8 flex items-end justify-between">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      {to && (
        <Link
          to={to}
          className="text-xs uppercase tracking-widest text-gray underline-offset-4 hover:text-ink hover:underline"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

function GridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="aspect-[3/4] bg-line" />
          <div className="h-3 w-3/4 rounded bg-line" />
          <div className="h-3 w-1/2 rounded bg-line" />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const { products, loading, error } = useCatalogData()
  const historyIds = useWishlistStore((s) => s.history)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const nuevos = getNew(products).slice(0, 4)
  const destacados = getFeatured(products).slice(0, 4)
  const recentProducts = historyIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  const onSubscribe = (e) => {
    e.preventDefault()
    if (email) setSubscribed(true)
  }

  return (
    <PageTransition>
      <Seo />

      {/* ---------- HERO ---------- */}
      <section className="relative h-[88vh] min-h-[520px] w-full overflow-hidden">
        <img
          src={HERO_IMG}
          alt={`Campaña editorial ${brand.name}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-xl text-bg"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-bg/80">
              {brand.tagline}
            </p>
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
              Esenciales
              <br />
              que duran.
            </h1>
            <p className="mt-5 max-w-md text-sm text-bg/85 sm:text-base">
              {brand.manifesto}
            </p>
            <div className="mt-8">
              <Button to="/tienda" size="lg" variant="outline" className="border-bg text-bg hover:bg-bg hover:text-ink">
                Ver colección
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- CATEGORÍAS ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-5 md:gap-4 md:overflow-visible">
          {brand.categories.map((c) => (
            <Link
              key={c}
              to={`/tienda?categoria=${encodeURIComponent(c)}`}
              className="group flex min-w-[140px] flex-1 items-center justify-center border border-line py-6 text-center text-sm font-medium uppercase tracking-widest transition-colors hover:border-ink hover:bg-ink hover:text-bg"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- NUEVOS INGRESOS ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader title="Nuevos ingresos" to="/tienda?orden=nuevos" />
        {error ? (
          <p className="text-sm text-gray">
            No pudimos cargar el catálogo, intentá de nuevo.
          </p>
        ) : loading ? (
          <GridSkeleton count={4} />
        ) : (
          <ProductGrid products={nuevos} />
        )}
      </section>

      {/* ---------- BANNER MANIFIESTO ---------- */}
      <section className="my-20 bg-ink py-24 text-bg">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-bg/60">
            Manifiesto
          </p>
          <p className="font-display text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
            Menos, pero mejor. Prendas pensadas para usarse miles de veces, no
            para una temporada.
          </p>
          <div className="mt-10">
            <Button to="/tienda" variant="outline" className="border-bg text-bg hover:bg-bg hover:text-ink">
              Descubrir la colección
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- DESTACADOS ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader title="Destacados" to="/tienda" />
        {error ? (
          <p className="text-sm text-gray">
            No pudimos cargar el catálogo, intentá de nuevo.
          </p>
        ) : loading ? (
          <GridSkeleton count={4} />
        ) : (
          <ProductGrid products={destacados} />
        )}
      </section>

      {/* ---------- VISTOS RECIENTEMENTE ---------- */}
      {!loading && recentProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <SectionHeader title="Vistos recientemente" />
          <ProductGrid products={recentProducts} />
        </section>
      )}

      {/* ---------- NEWSLETTER ---------- */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 border border-line md:grid-cols-2">
          <div className="hidden h-full md:block">
            <ProductImage
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80"
              alt={`Sumate a la comunidad ${brand.name}`}
              ratio="aspect-[4/3] h-full"
            />
          </div>
          <div className="px-6 py-12 sm:px-10">
            <h2 className="text-2xl font-bold tracking-tight">Sumate al círculo</h2>
            <p className="mt-2 text-sm text-gray">
              Acceso anticipado a drops, restocks y ediciones limitadas.
            </p>
            {subscribed ? (
              <p className="mt-6 text-sm font-medium text-accent">
                ¡Listo! Te sumaste a la lista. (Demo — no se envía nada.)
              </p>
            ) : (
              <form onSubmit={onSubscribe} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  aria-label="Tu email"
                  className="flex-1 border border-line bg-bg px-4 py-3 text-sm outline-none focus:border-ink"
                />
                <Button type="submit">Suscribirme</Button>
              </form>
            )}
            <p className="mt-3 text-[11px] text-gray">
              Al suscribirte aceptás recibir comunicaciones. Podés darte de baja
              cuando quieras.
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
