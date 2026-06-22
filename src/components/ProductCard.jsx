import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductImage from './ProductImage.jsx'
import { formatPrice } from '../config/brand.js'
import { colorToHex } from '../lib/colors.js'

/**
 * Card de producto para grillas. Zoom suave de imagen en hover (Framer Motion),
 * badges de "Nuevo"/oferta, swatches de color y precio (con tachado si hay oferta).
 */
export default function ProductCard({ product }) {
  const onSale = product.precioAnterior && product.precioAnterior > product.precio

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group"
    >
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
            {product.nuevo && (
              <span className="bg-ink px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-bg">
                Nuevo
              </span>
            )}
            {onSale && (
              <span className="bg-accent px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-white">
                Oferta
              </span>
            )}
          </div>

          {/* Imagen con zoom suave en hover */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <ProductImage
              src={product.imagenes?.[0]}
              alt={product.nombre}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </motion.div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <p className="text-[11px] uppercase tracking-widest text-gray">
            {product.categoria}
          </p>
          <h3 className="text-sm font-medium leading-snug text-ink">
            {product.nombre}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-ink">
              {formatPrice(product.precio)}
            </span>
            {onSale && (
              <span className="text-xs text-gray line-through">
                {formatPrice(product.precioAnterior)}
              </span>
            )}
          </div>
          {/* Swatches de color */}
          <div className="flex gap-1 pt-1">
            {product.colores.map((c) => (
              <span
                key={c}
                title={c}
                className="h-3 w-3 rounded-full border border-line"
                style={{ backgroundColor: colorToHex(c) }}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
