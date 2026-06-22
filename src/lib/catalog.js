/**
 * Acceso al catálogo (datos mock).
 *
 * RE-SKIN / DATOS REALES: el catálogo vive en src/data/products.json.
 * Para usar las fotos reales del cliente, reemplazá las URLs del campo
 * "imagenes" de cada producto en ese JSON (o apuntá a /public/products/...).
 * Si una URL falla, <ProductImage> muestra un placeholder estilizado.
 */
import products from '../data/products.json'
import { brand } from '../config/brand.js'

export { products }

export const categories = brand.categories

export function getProductById(id) {
  return products.find((p) => p.id === id) || null
}

export function getFeatured() {
  return products.filter((p) => p.destacado)
}

export function getNew() {
  return products.filter((p) => p.nuevo)
}

/** Productos relacionados: misma categoría, excluyendo el actual. */
export function getRelated(id, limit = 4) {
  const current = getProductById(id)
  if (!current) return []
  return products
    .filter((p) => p.categoria === current.categoria && p.id !== id)
    .slice(0, limit)
}

/** Todos los colores únicos del catálogo (para filtros). */
export function getAllColors() {
  return [...new Set(products.flatMap((p) => p.colores))].sort()
}

/** Todos los talles únicos del catálogo (para filtros). */
export function getAllSizes() {
  const order = ['S', 'M', 'L', 'XL', 'Único']
  const sizes = [...new Set(products.flatMap((p) => p.talles))]
  return sizes.sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

/** Rango [min, max] de precios del catálogo. */
export function getPriceBounds() {
  const prices = products.map((p) => p.precio)
  return [Math.min(...prices), Math.max(...prices)]
}
