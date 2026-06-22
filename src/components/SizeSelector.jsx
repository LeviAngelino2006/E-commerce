/**
 * Selector de talle. Controlado: value + onChange.
 * Muestra todos los talles del producto como botones cuadrados.
 */
export default function SizeSelector({ sizes, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Talle">
      {sizes.map((size) => {
        const active = value === size
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(size)}
            className={`min-w-11 px-3 py-2 text-sm font-medium uppercase transition-colors ${
              active
                ? 'border border-ink bg-ink text-bg'
                : 'border border-line text-ink hover:border-ink'
            }`}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}
