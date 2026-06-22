import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductImage from './ProductImage.jsx'
import { HeartIcon } from './icons.jsx'
import { formatPrice } from '../config/brand.js'
import { colorToHex } from '../lib/colors.js'
import { useCartStore } from '../store/cartStore.js'
import { useUiStore } from '../store/uiStore.js'
import { useWishlistStore } from '../store/wishlistStore.js'

export default function ProductCard({ product }) {
  const onSale = product.precioAnterior && product.precioAnterior > product.precio
  const discountPct = onSale
    ? Math.round((1 - product.precio / product.precioAnterior) * 100)
    : 0
  const lowStock = typeof product.stock === 'number' && product.stock <= 3

  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUiStore((s) => s.addToast)
  const favItems = useWishlistStore((s) => s.items)
  const toggleFavorite = useWishlistStore((s) => s.toggleFavorite)

  const isFavorite = favItems.includes(product.id)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const talle = product.talles?.[0]
    const color = product.colores?.[0]
    if (!talle || !color) return
    addItem(product, { talle, color, qty: 1 })
    addToast(`Agregado: ${product.nombre}`)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative"
    >
      {/* Corazón — fuera del Link para no navegar al clickear */}
      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center"
      >
        <motion.div
          animate={{ scale: isFavorite ? [1, 1.35, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <HeartIcon
            width={18}
            height={18}
            fill={isFavorite ? '#ef4444' : 'none'}
            stroke={isFavorite ? '#ef4444' : '#0a0a0a'}
            className="drop-shadow-sm"
          />
        </motion.div>
      </button>

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
                -{discountPct}%
              </span>
            )}
            {lowStock && (
              <span className="bg-amber-500 px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-white">
                Últimas unidades
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

          {/* Quick add (solo desktop, visible en hover del grupo) */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 whitespace-nowrap bg-bg px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-ink shadow-md transition-opacity duration-200 pointer-events-none opacity-0 md:block md:group-hover:opacity-100 md:group-hover:pointer-events-auto"
          >
            Agregar
          </button>
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
