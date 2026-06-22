import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import { CloseIcon, FilterIcon } from '../components/icons.jsx'
import {
  products,
  categories,
  getAllColors,
  getAllSizes,
  getPriceBounds,
} from '../lib/catalog.js'
import { useUiStore } from '../store/uiStore.js'

const SORTS = [
  { value: 'nuevos', label: 'Novedades' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
]

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const bounds = useMemo(() => getPriceBounds(), [])
  const allColors = useMemo(() => getAllColors(), [])
  const allSizes = useMemo(() => getAllSizes(), [])

  const filtersOpen = useUiStore((s) => s.filtersOpen)
  const openFilters = useUiStore((s) => s.openFilters)
  const closeFilters = useUiStore((s) => s.closeFilters)

  // Estado inicial desde la URL (?categoria=...&orden=...)
  const initialCategoria = searchParams.get('categoria')
  const [filters, setFilters] = useState({
    categorias: initialCategoria ? [initialCategoria] : [],
    talles: [],
    colores: [],
    maxPrice: bounds[1],
  })
  const [sort, setSort] = useState(searchParams.get('orden') || 'nuevos')

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
      if (p.precio > filters.maxPrice) return false
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
  }, [filters, sort])

  return (
    <PageTransition>
      <Seo
        title="Tienda"
        description="Explorá toda la colección VÉRTICE: remeras, buzos, camperas, pantalones y accesorios."
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tienda</h1>
          <p className="mt-2 text-sm text-gray">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        <div className="flex gap-10">
          {/* Sidebar desktop */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <FilterPanel
              categories={categories}
              sizes={allSizes}
              colors={allColors}
              bounds={bounds}
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
            />
          </aside>

          {/* Contenido */}
          <div className="flex-1">
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

            <ProductGrid products={filtered} />
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
                  filters={filters}
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
