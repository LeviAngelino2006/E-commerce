import { useState } from 'react'
import { brand } from '../config/brand.js'

/**
 * Imagen de producto con:
 *  - aspect-ratio fijo + object-cover (grid siempre alineado)
 *  - lazy loading
 *  - placeholder estilizado si la URL falla
 *
 * RE-SKIN: el placeholder usa el nombre de la marca; se puede cambiar acá.
 */
export default function ProductImage({
  src,
  alt,
  className = '',
  ratio = 'aspect-[3/4]',
  sizes,
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={`relative overflow-hidden bg-line ${ratio} ${className}`}
    >
      {failed || !src ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-line text-gray">
          <span className="font-display text-lg font-semibold tracking-tight">
            {brand.name}
          </span>
          <span className="text-[10px] uppercase tracking-widest">
            Imagen no disponible
          </span>
        </div>
      ) : (
        <>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-line" />
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            sizes={sizes}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </>
      )}
    </div>
  )
}
