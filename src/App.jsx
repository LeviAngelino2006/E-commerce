import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import Navbar from './components/Navbar.jsx'
// import DemoBanner from './components/DemoBanner.jsx'  // RE-SKIN: descomentar para mostrar el banner de demo
// import DemoPanel from './components/DemoPanel.jsx'    // RE-SKIN: descomentar para mostrar el panel "Sobre este demo"
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

import AdminRoute from './components/admin/AdminRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminProducts from './pages/admin/Products.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'

import { useAuthStore } from './store/authStore.js'
import { useCartStore } from './store/cartStore.js'
import api from './lib/api.js'

export default function App() {
  const location = useLocation()
  const isAdminPath = location.pathname.startsWith('/admin')
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const loadCart = useCartStore((s) => s.loadCart)

  // Valida el token y carga el carrito al montar la app
  useEffect(() => {
    if (token) {
      api.get('/api/auth/me')
        .then(() => loadCart())
        .catch((err) => {
          if (err.response?.status === 401) logout()
        })
    } else {
      loadCart()
    }
  // Solo al montar la app
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Admin paths use their own layout (no Navbar/Footer/CartDrawer)
  if (isAdminPath) {
    return (
      <>
        <ScrollToTop />
        <ToastStack />
        <Routes>
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="productos" element={<AdminProducts />} />
              <Route path="pedidos" element={<AdminOrders />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <div className="sticky top-0 z-40">
        {/* <DemoBanner /> */}{/* RE-SKIN: descomentar para mostrar el banner de demo */}
        <Navbar />
      </div>
      <CartDrawer />
      <AuthModal />
      <ToastStack />
      {/* <DemoPanel /> */}{/* RE-SKIN: descomentar para mostrar el panel "Sobre este demo" */}

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
