import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Navbar from './components/Navbar.jsx'
import DemoBanner from './components/DemoBanner.jsx'
import DemoPanel from './components/DemoPanel.jsx'
import Footer from './components/Footer.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import AuthModal from './components/AuthModal.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import ToastStack from './components/ToastStack.jsx'

import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import Product from './pages/Product.jsx'
import Checkout from './pages/Checkout.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Favorites from './pages/Favorites.jsx'
import Orders from './pages/Orders.jsx'
import NotFound from './pages/NotFound.jsx'

import { useAuthStore } from './store/authStore.js'
import api from './lib/api.js'

export default function App() {
  const location = useLocation()
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)

  // Valida que el token guardado siga siendo vigente
  useEffect(() => {
    if (!token) return
    api.get('/api/auth/me').catch((err) => {
      if (err.response?.status === 401) logout()
    })
  // Solo al montar la app
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {/* Banner + Navbar en un wrapper sticky único para que ambos queden fijos juntos */}
      <div className="sticky top-0 z-40">
        <DemoBanner />
        <Navbar />
      </div>
      <CartDrawer />
      <AuthModal />
      <ToastStack />
      <DemoPanel />

      <div className="flex-1">
        {/* key por pathname -> transición entre páginas */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/tienda" element={<Catalog />} />
            <Route path="/producto/:id" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmacion/:orderId" element={<Confirmation />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/mis-pedidos" element={<Orders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  )
}
