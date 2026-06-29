import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { CloseIcon, FilterIcon } from '../components/icons.jsx'
import {
  useCatalogData,
  categories,
  getAllColors,
  getAllSizes,
  getPriceBounds,
} from '../lib/catalog.js'
import { useUiStore } from '../store/uiStore.js'
import { brand } from '../config/brand.js'

const SORTS = [
  { value: 'nuevos', label: 'Novedades' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
]

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-3">
          <div className="aspect-[3/4] bg-line" />
          <div className="h-3 w-3/4 rounded bg-line" />
          <div className="h-3 w-1/2 rounded bg-line" />
        </div>
      ))}
    </div>
  )
}

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const { products, loading, error } = useCatalogData()

  const bounds = useMemo(() => getPriceBounds(products), [products])
  const allColors = useMemo(() => getAllColors(products), [products])
  const allSizes = useMemo(() => getAllSizes(products), [products])

  const filtersOpen = useUiStore((s) => s.filtersOpen)
  const openFilters = useUiStore((s) => s.openFilters)
  const closeFilters = useUiStore((s) => s.closeFilters)

  // Estado inicial desde la URL (?categoria=...&orden=...)
  const initialCategoria = searchParams.get('categoria')
  const [filters, setFilters] = useState({
    categorias: initialCategoria ? [initialCategoria] : [],
    talles: [],
    colores: [],
    maxPrice: Infinity,
  })
  const [sort, setSort] = useState(searchParams.get('orden') || 'nuevos')

  // Sincroniza maxPrice con los bounds reales cuando llegan del API
  const effectiveMaxPrice =
    filters.maxPrice === Infinity ? bounds[1] : filters.maxPrice

  // Si cambia el query param (ej: click en categoría del navbar mientras ya
  // estamos en /tienda), re-aplicamos. Patrón de "ajustar estado en render"
  // recomendado por React, en vez de un efecto con setState.
  const search = searchParams.toString()
  const [lastSearch, setLastSearch] = useState(search)
  if (search !== lastSearch) {
    setLastSearch(search)
    const cat = searchParams.get('categoria')
    setFilters((f) => ({ ...f, categorias: cat ? [cat] : [] }))
    const orden = searchParams.get('orden')
    if (orden) setSort(orden)
  }

  const clearFilters = () =>
    setFilters({ categorias: [], talles: [], colores: [], maxPrice: bounds[1] })

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (filters.categorias.length && !filters.categorias.includes(p.categoria))
        return false
      if (filters.talles.length && !p.talles.some((t) => filters.talles.includes(t)))
        return false
      if (filters.colores.length && !p.colores.some((c) => filters.colores.includes(c)))
        return false
      if (p.precio > effectiveMaxPrice) return false
      return true
    })

    switch (sort) {
      case 'precio-asc':
        list = [...list].sort((a, b) => a.precio - b.precio)
        break
      case 'precio-desc':
        list = [...list].sort((a, b) => b.precio - a.precio)
        break
      case 'nuevos':
      default:
        list = [...list].sort((a, b) => Number(b.nuevo) - Number(a.nuevo))
    }
    return list
  }, [filters, sort, products, effectiveMaxPrice])

  return (
    <PageTransition>
      <Seo
        title="Tienda"
        description={`Explorá toda la colección ${brand.name}: remeras, buzos, camperas, pantalones y accesorios.`}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {(() => {
          const activeCategory =
            filters.categorias.length === 1 ? filters.categorias[0] : null
          const items = [
            { label: 'Inicio', to: '/' },
            activeCategory
              ? { label: 'Tienda', to: '/tienda' }
              : { label: 'Tienda' },
            ...(activeCategory ? [{ label: activeCategory }] : []),
          ]
          return <Breadcrumbs items={items} />
        })()}

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tienda</h1>
          {!loading && (
            <p className="mt-2 text-sm text-gray">
              {filtered.length}{' '}
              {filtered.length === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </div>

        <div className="flex gap-10">
          {/* Sidebar desktop */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <FilterPanel
              categories={categories}
              sizes={allSizes}
              colors={allColors}
              bounds={bounds}
              filters={{ ...filters, maxPrice: effectiveMaxPrice }}
              setFilters={setFilters}
              onClear={clearFilters}
            />
          </aside>

          {/* Contenido */}
          <div className="min-w-0 flex-1">
            {/* Barra de controles */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={openFilters}
                className="inline-flex items-center gap-2 border border-line px-4 py-2 text-xs uppercase tracking-widest lg:hidden"
              >
                <FilterIcon width={16} height={16} />
                Filtros
              </button>

              <label className="ml-auto flex items-center gap-2 text-xs uppercase tracking-widest text-gray">
                Ordenar
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-line bg-bg px-3 py-2 text-xs uppercase tracking-widest text-ink outline-none focus:border-ink"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 py-16 text-center">
                <p className="text-base font-semibold tracking-tight">
                  No pudimos cargar el catálogo, intentá de nuevo.
                </p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="border border-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-ink hover:text-bg"
                >
                  Reintentar
                </button>
              </div>
            ) : loading ? (
              <GridSkeleton />
            ) : filtered.length === 0 ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center gap-6 py-16 text-center">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  className="text-line"
                  aria-hidden
                >
                  <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                  <line x1="9.5" y1="14.5" x2="14.5" y2="19.5" strokeLinecap="round" />
                  <line x1="14.5" y1="14.5" x2="9.5" y2="19.5" strokeLinecap="round" />
                </svg>
                <div>
                  <p className="text-base font-semibold tracking-tight">
                    No encontramos productos con esos filtros.
                  </p>
                  <p className="mt-1 text-sm text-gray">
                    Probá con otras combinaciones o limpiá los filtros.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="border border-ink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-ink hover:text-bg"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <ProductGrid products={filtered} />
            )}
          </div>
        </div>
      </div>

      {/* Drawer de filtros (mobile) */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeFilters}
              className="fixed inset-0 z-50 bg-ink/40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              className="fixed left-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col bg-bg lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <span className="text-sm font-semibold uppercase tracking-widest">
                  Filtros
                </span>
                <button type="button" onClick={closeFilters} aria-label="Cerrar filtros">
                  <CloseIcon />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6">
                <FilterPanel
                  categories={categories}
                  sizes={allSizes}
                  colors={allColors}
                  bounds={bounds}
                  filters={{ ...filters, maxPrice: effectiveMaxPrice }}
                  setFilters={setFilters}
                  onClear={clearFilters}
                />
              </div>
              <div className="border-t border-line p-4">
                <button
                  type="button"
                  onClick={closeFilters}
                  className="w-full rounded-full bg-ink py-3 text-sm font-medium uppercase tracking-wide text-bg"
                >
                  Ver {filtered.length} resultados
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
