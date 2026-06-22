import { colorToHex } from '../lib/colors.js'
import { formatPrice } from '../config/brand.js'

/**
 * Panel de filtros reutilizable (sidebar desktop + drawer mobile).
 * Es controlado: recibe el estado de filtros y los setters desde el padre.
 */
export default function FilterPanel({
  categories,
  sizes,
  colors,
  bounds, // [min, max]
  filters, // { categorias:[], talles:[], colores:[], maxPrice:number }
  setFilters,
  onClear,
}) {
  const toggle = (key, value) => {
    setFilters((f) => {
      const set = new Set(f[key])
      set.has(value) ? set.delete(value) : set.add(value)
      return { ...f, [key]: [...set] }
    })
  }

  return (
    <div className="space-y-8">
      {/* Categorías */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest">
          Categoría
        </legend>
        <div className="space-y-2">
          {categories.map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.categorias.includes(c)}
                onChange={() => toggle('categorias', c)}
                className="h-4 w-4 accent-ink"
              />
              {c}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Talles */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest">
          Talle
        </legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => {
            const active = filters.talles.includes(s)
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle('talles', s)}
                className={`min-w-10 px-2 py-1.5 text-xs font-medium uppercase transition-colors ${
                  active ? 'border border-ink bg-ink text-bg' : 'border border-line hover:border-ink'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Colores */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest">
          Color
        </legend>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const active = filters.colores.includes(c)
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggle('colores', c)}
                title={c}
                aria-label={c}
                aria-pressed={active}
                className={`h-7 w-7 rounded-full border transition-transform ${
                  active ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-bg' : 'border-line hover:scale-110'
                }`}
                style={{ backgroundColor: colorToHex(c) }}
              />
            )
          })}
        </div>
      </fieldset>

      {/* Precio */}
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest">
          Precio
        </legend>
        <input
          type="range"
          min={bounds[0]}
          max={bounds[1]}
          step={1000}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-ink"
          aria-label="Precio máximo"
        />
        <div className="mt-1 flex justify-between text-xs text-gray">
          <span>{formatPrice(bounds[0])}</span>
          <span className="font-medium text-ink">
            Hasta {formatPrice(filters.maxPrice)}
          </span>
        </div>
      </fieldset>

      <button
        type="button"
        onClick={onClear}
        className="text-xs uppercase tracking-widest text-gray underline-offset-4 hover:text-ink hover:underline"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
