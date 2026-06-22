import { useEffect } from 'react'
import { brand } from '../config/brand.js'

/**
 * SEO básico sin dependencias: setea document.title y meta description
 * por página. (React 19 también permite <title>/<meta> en el árbol, pero
 * este enfoque imperativo evita duplicados y centraliza el sufijo de marca.)
 */
export default function Seo({ title, description }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} — ${brand.seo.titleSuffix}`
      : `${brand.name} — ${brand.tagline}`
    document.title = fullTitle

    const desc = description || brand.seo.defaultDescription
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', desc)
  }, [title, description])

  return null
}
