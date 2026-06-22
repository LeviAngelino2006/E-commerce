import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import ProductImage from '../components/ProductImage.jsx'
import SizeSelector from '../components/SizeSelector.jsx'
import ColorSelector from '../components/ColorSelector.jsx'
import Accordion from '../components/Accordion.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Button from '../components/ui/Button.jsx'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import { CheckIcon, HeartIcon } from '../components/icons.jsx'

import { getProductById, getRelated } from '../lib/catalog.js'
import { useCartStore } from '../store/cartStore.js'
import { useUiStore } from '../store/uiStore.js'
import { useWishlistStore } from '../store/wishlistStore.js'
import { formatPrice, brand } from '../config/brand.js'

export default function Product() {
  const { id } = useParams()
  const product = getProductById(id)

  const addItem = useCartStore((s) => s.addItem)
  const addToast = useUiStore((s) => s.addToast)
  const favItems = useWishlistStore((s) => s.items)
  const toggleFavorite = useWishlistStore((s) => s.toggleFavorite)
  const addToHistory = useWishlistStore((s) => s.addToHistory)

  const isFavorite = favItems.includes(product?.id ?? '')

  // Registrar visita en historial
  useEffect(() => {
    if (product?.id) addToHistory(product.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  const [activeImg, setActiveImg] = useState(0)
  const [talle, setTalle] = useState(null)
  const [color, setColor] = useState(product?.colores?.[0] ?? null)
  const [error, setError] = useState(false)

  // Producto inexistente
  if (!product) {
    return (
      <PageTransition>
        <Seo title="Producto no encontrado" />
        <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold">Producto no encontrado</h1>
          <Button to="/tienda" className="mt-6">
            Volver a la tienda
          </Button>
        </div>
      </PageTransition>
    )
  }

  const onSale = product.precioAnterior && product.precioAnterior > product.precio
  const related = getRelated(product.id)

  const handleAdd = () => {
    if (!talle) {
      setError(true)
      return
    }
    addItem(product, { talle, color, qty: 1 })
    addToast(`Agregado: ${product.nombre}`)
  }

  return (
    <PageTransition>
      <Seo
        title={product.nombre}
        description={product.descripcion}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Tienda', to: '/tienda' },
            {
              label: product.categoria,
              to: `/tienda?categoria=${encodeURIComponent(product.categoria)}`,
            },
            { label: product.nombre },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* ---------- Galería ---------- */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {/* Thumbnails */}
            {product.imagenes.length > 1 && (
              <div className="flex gap-3 sm:flex-col">
                {product.imagenes.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImg(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    className={`w-16 shrink-0 border ${activeImg === i ? 'border-ink' : 'border-line'}`}
                  >
                    <ProductImage src={src} alt={`${product.nombre} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
            {/* Imagen principal */}
            <div className="flex-1">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ProductImage
                  src={product.imagenes[activeImg]}
                  alt={product.nombre}
                  ratio="aspect-[3/4]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </div>
          </div>

          {/* ---------- Info / compra ---------- */}
          <div className="lg:py-4">
            <p className="text-xs uppercase tracking-widest text-gray">
              {product.categoria}
            </p>
            <div className="mt-2 flex items-start gap-3">
              <h1 className="flex-1 text-3xl font-bold tracking-tight">
                {product.nombre}
              </h1>
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                className="mt-1 shrink-0"
              >
                <motion.div
                  animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <HeartIcon
                    width={24}
                    height={24}
                    fill={isFavorite ? '#ef4444' : 'none'}
                    stroke={isFavorite ? '#ef4444' : 'currentColor'}
                  />
                </motion.div>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold">
                {formatPrice(product.precio)}
              </span>
              {onSale && (
                <span className="text-base text-gray line-through">
                  {formatPrice(product.precioAnterior)}
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-gray">
              {product.descripcion}
            </p>

            {/* Color */}
            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest">
                Color: <span className="font-normal text-gray">{color}</span>
              </p>
              <ColorSelector
                colors={product.colores}
                value={color}
                onChange={setColor}
              />
            </div>

            {/* Talle (obligatorio) */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest">
                  Talle
                </p>
                <span className="text-xs text-gray">Guía de talles</span>
              </div>
              <SizeSelector
                sizes={product.talles}
                value={talle}
                onChange={(t) => {
                  setTalle(t)
                  setError(false)
                }}
              />
              {error && (
                <p className="mt-2 text-xs text-accent">
                  Elegí un talle para continuar.
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Button full size="lg" onClick={handleAdd}>
                Agregar al carrito
              </Button>
            </div>

            {/* Beneficios */}
            <ul className="mt-6 space-y-2 text-xs text-gray">
              <li className="flex items-center gap-2">
                <CheckIcon width={16} height={16} /> {brand.shipping.note}
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon width={16} height={16} /> Cambios y devoluciones dentro de 30 días.
              </li>
            </ul>

            {/* Acordeón */}
            <div className="mt-10">
              <Accordion
                items={[
                  { title: 'Descripción', content: product.descripcion },
                  {
                    title: 'Envíos',
                    content:
                      'Despachamos en 24/48hs hábiles. Envío gratis superando el umbral indicado. Seguimiento por email. (Demo: sin envíos reales.)',
                  },
                  {
                    title: 'Devoluciones',
                    content:
                      'Tenés 30 días para cambiar o devolver tu compra sin uso y con etiquetas. La primera devolución es sin costo. (Demo.)',
                  },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ---------- Relacionados ---------- */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="mb-8 text-2xl font-bold tracking-tight">
              También te puede gustar
            </h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </PageTransition>
  )
}
