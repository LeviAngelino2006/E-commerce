/**
 * Control de cantidad (+/−). Controlado: recibe value y onChange.
 */
export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div className="inline-flex items-center border border-line">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Restar uno"
        className="flex h-9 w-9 items-center justify-center text-lg leading-none transition-colors hover:bg-ink hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        −
      </button>
      <span
        className="w-10 select-none text-center text-sm tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Sumar uno"
        className="flex h-9 w-9 items-center justify-center text-lg leading-none transition-colors hover:bg-ink hover:text-bg disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
      >
        +
      </button>
    </div>
  )
}
