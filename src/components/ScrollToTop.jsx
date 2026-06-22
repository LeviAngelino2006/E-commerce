import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Vuelve al tope de la página en cada cambio de ruta. */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
