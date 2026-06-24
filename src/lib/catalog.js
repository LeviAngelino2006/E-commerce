import { useState, useEffect } from 'react'
import api from './api.js'
import { brand } from '../config/brand.js'

export const categories = brand.categories

/** Fetches the full product list from the API. */
export function useCatalogData() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .get('/api/products')
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return { products, loading, error }
}

/** Fetches a single product by id from the API. */
export function useProductData(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setProduct(null)
    setError(false)
    api
      .get(`/api/products/${id}`)
      .then((res) => {
        if (!cancelled) {
          setProduct(res.data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}

export function getFeatured(products) {
  return products.filter((p) => p.destacado)
}

export function getNew(products) {
  return products.filter((p) => p.nuevo)
}

/** Productos relacionados: misma categoría, excluyendo el actual. */
export function getRelated(products, id, limit = 4) {
  const current = products.find((p) => p.id === id)
  if (!current) return []
  return products
    .filter((p) => p.categoria === current.categoria && p.id !== id)
    .slice(0, limit)
}

/** Todos los colores únicos del catálogo (para filtros). */
export function getAllColors(products) {
  return [...new Set(products.flatMap((p) => p.colores))].sort()
}

/** Todos los talles únicos del catálogo (para filtros). */
export function getAllSizes(products) {
  const order = ['S', 'M', 'L', 'XL', 'Único']
  const sizes = [...new Set(products.flatMap((p) => p.talles))]
  return sizes.sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

/** Rango [min, max] de precios del catálogo. */
export function getPriceBounds(products) {
  if (!products.length) return [0, 100000]
  const prices = products.map((p) => p.precio)
  return [Math.min(...prices), Math.max(...prices)]
}
