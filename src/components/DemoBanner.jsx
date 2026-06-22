import { brand } from '../config/brand.js'

/**
 * Barra de aviso de demo. Se muestra sólo si brand.demoBanner tiene texto.
 * RE-SKIN: poné brand.demoBanner = null para ocultarla en producción real.
 */
export default function DemoBanner() {
  if (!brand.demoBanner) return null

  return (
    <div className="w-full bg-ink px-4 py-2 text-center text-[11px] font-medium uppercase tracking-widest text-bg/80">
      {brand.demoBanner}
    </div>
  )
}
