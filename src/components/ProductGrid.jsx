import ProductCard from './ProductCard.jsx'

/**
 * Grilla responsive de productos. 2 columnas en mobile, hasta 4 en desktop.
 */
export default function ProductGrid({ products }) {
  if (!products.length) {
    return (
      <p className="py-20 text-center text-gray">
        No hay productos que coincidan con tu búsqueda.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
