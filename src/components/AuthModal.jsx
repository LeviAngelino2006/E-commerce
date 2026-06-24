import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CloseIcon } from './icons.jsx'
import { useUiStore } from '../store/uiStore.js'
import { useAuthStore } from '../store/authStore.js'
import api from '../lib/api.js'

// Carga el SDK de Google Sign-In una sola vez
let googleScriptLoaded = false
function loadGoogleScript() {
  if (googleScriptLoaded || document.getElementById('google-gsi')) return
  googleScriptLoaded = true
  const s = document.createElement('script')
  s.id = 'google-gsi'
  s.src = 'https://accounts.google.com/gsi/client'
  s.async = true
  s.defer = true
  document.head.appendChild(s)
}

function validate(mode, { nombre, email, password }) {
  if (mode === 'registro' && !nombre.trim()) return 'El nombre es obligatorio.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email inválido.'
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  return null
}

export default function AuthModal() {
  const open = useUiStore((s) => s.authModalOpen)
  const close = useUiStore((s) => s.closeAuthModal)
  const setSession = useAuthStore((s) => s.setSession)
  const addToast = useUiStore((s) => s.addToast)

  const [mode, setMode] = useState('login') // 'login' | 'registro'
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const googleBtnRef = useRef(null)
  const firstInputRef = useRef(null)

  // Cierre con Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, close])

  // Focus trap inicial
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50)
    }
  }, [open, mode])

  // Cargar SDK de Google al abrir el modal
  useEffect(() => {
    if (!open) return
    loadGoogleScript()
  }, [open])

  // Renderizar botón de Google cuando el SDK esté listo y el contenedor sea visible
  useEffect(() => {
    if (!open || !googleBtnRef.current) return

    const init = () => {
      if (!window.google?.accounts?.id) return
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: googleBtnRef.current.offsetWidth || 320,
        text: 'continue_with',
        locale: 'es',
      })
    }

    // Si el SDK ya cargó, inicializamos de inmediato; si no, esperamos
    if (window.google?.accounts?.id) {
      init()
    } else {
      const script = document.getElementById('google-gsi')
      script?.addEventListener('load', init)
      return () => script?.removeEventListener('load', init)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode])

  // Resetear form al cambiar de modo o cerrar
  useEffect(() => {
    setError('')
    setNombre('')
    setEmail('')
    setPassword('')
  }, [mode, open])

  async function handleGoogleCredential({ credential }) {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/api/auth/google', { idToken: credential })
      setSession({ user: data.user, token: data.token })
      addToast(`¡Bienvenido, ${data.user.nombre}!`)
      close()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Error al iniciar sesión con Google.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate(mode, { nombre, email, password })
    if (validationError) { setError(validationError); return }

    setLoading(true)
    setError('')
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = mode === 'login' ? { email, password } : { nombre, email, password }
      const { data } = await api.post(endpoint, payload)
      setSession({ user: data.user, token: data.token })
      addToast(`¡Bienvenido, ${data.user.nombre}!`)
      close()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Algo salió mal. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-bg p-8 shadow-xl"
          >
            {/* Cerrar */}
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 p-1 text-gray hover:text-ink"
            >
              <CloseIcon />
            </button>

            {/* Toggle login / registro */}
            <div className="mb-6 flex gap-4 border-b border-line">
              {['login', 'registro'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`pb-3 text-xs uppercase tracking-widest transition-colors ${
                    mode === m
                      ? 'border-b-2 border-ink font-semibold text-ink'
                      : 'text-gray hover:text-ink'
                  }`}
                >
                  {m === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {mode === 'registro' && (
                <div className="flex flex-col gap-1">
                  <label htmlFor="auth-nombre" className="text-[11px] uppercase tracking-widest text-gray">
                    Nombre
                  </label>
                  <input
                    id="auth-nombre"
                    ref={mode === 'registro' ? firstInputRef : undefined}
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="name"
                    required
                    className="border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-ink"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label htmlFor="auth-email" className="text-[11px] uppercase tracking-widest text-gray">
                  Email
                </label>
                <input
                  id="auth-email"
                  ref={mode === 'login' ? firstInputRef : undefined}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="auth-password" className="text-[11px] uppercase tracking-widest text-gray">
                  Contraseña
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  minLength={8}
                  className="border border-line bg-transparent px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              {/* Error inline */}
              {error && (
                <p role="alert" className="text-[11px] text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 bg-ink py-3 text-xs uppercase tracking-widest text-bg transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {loading
                  ? 'Cargando...'
                  : mode === 'login'
                  ? 'Iniciar sesión'
                  : 'Crear cuenta'}
              </button>
            </form>

            {/* Separador */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 border-t border-line" />
              <span className="text-[10px] uppercase tracking-widest text-gray">o</span>
              <div className="flex-1 border-t border-line" />
            </div>

            {/* Botón oficial de Google */}
            <div ref={googleBtnRef} className="flex justify-center" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
