import { colorToHex } from '../lib/colors.js'

/**
 * Selector de color como swatches. Controlado: value + onChange.
 */
export default function ColorSelector({ colors, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Color">
      {colors.map((color) => {
        const active = value === color
        return (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={color}
            title={color}
            onClick={() => onChange(color)}
            className={`relative h-8 w-8 rounded-full border transition-transform ${
              active ? 'border-ink ring-2 ring-ink ring-offset-2 ring-offset-bg' : 'border-line hover:scale-110'
            }`}
            style={{ backgroundColor: colorToHex(color) }}
          />
        )
      })}
    </div>
  )
}
