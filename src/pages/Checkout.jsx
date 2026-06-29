import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'

import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import ProductImage from '../components/ProductImage.jsx'
import Button from '../components/ui/Button.jsx'
import { useCartStore } from '../store/cartStore.js'
import { formatPrice, brand } from '../config/brand.js'
import api from '../lib/api.js'

/** Campo de formulario con label + validación de formato. */
function Field({ label, name, value, onChange, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray">
        {label}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-ink ${
          error ? 'border-accent' : 'border-line'
        }`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-accent">{error}</span>}
    </label>
  )
}

const EMPTY = {
  email: '',
  nombre: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  provincia: '',
  cp: '',
  tarjeta: '',
  vencimiento: '',
  cvc: '',
  titular: '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [stockError, setStockError] = useState(null)

  // Carrito vacío -> no tiene sentido el checkout.
  if (items.length === 0) {
    return <Navigate to="/tienda" replace />
  }

  const shipping = subtotal >= brand.shipping.freeOver ? 0 : 6500
  const total = subtotal + shipping

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  // Validación de FORMATO únicamente (nada real). Demo.
  const validate = () => {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email inválido.'
    if (form.nombre.trim().length < 2) e.nombre = 'Ingresá tu nombre.'
    if (!/^\+?[\d\s-]{6,}$/.test(form.telefono))
      e.telefono = 'Teléfono inválido.'
    if (form.direccion.trim().length < 4) e.direccion = 'Ingresá tu dirección.'
    if (form.ciudad.trim().length < 2) e.ciudad = 'Ingresá tu ciudad.'
    if (form.provincia.trim().length < 2) e.provincia = 'Ingresá tu provincia.'
    if (!/^\d{4,8}$/.test(form.cp)) e.cp = 'Código postal inválido.'
    if (!/^\d{4}(\s?\d{4}){3}$|^\d{16}$/.test(form.tarjeta.replace(/\s/g, '')))
      e.tarjeta = 'Número de tarjeta inválido (16 dígitos).'
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.vencimiento))
      e.vencimiento = 'Formato MM/AA.'
    if (!/^\d{3,4}$/.test(form.cvc)) e.cvc = 'CVC inválido.'
    if (form.titular.trim().length < 2) e.titular = 'Ingresá el titular.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = document.querySelector('[data-error="true"]')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)
    setStockError(null)

    try {
      const res = await api.post('/api/orders', {
        items: items.map((i) => ({
          productId: i.productId,
          talle: i.talle,
          color: i.color,
          cantidad: i.qty,
        })),
        envio: {
          email: form.email,
          nombre: form.nombre,
          telefono: form.telefono,
          direccion: form.direccion,
          ciudad: form.ciudad,
          provincia: form.provincia,
          codigoPostal: form.cp,
        },
      })
      navigate(`/confirmacion/${res.data.id}`)
    } catch (err) {
      if (err.response?.status === 409) {
        setStockError(
          err.response.data?.message ||
            'Stock insuficiente para uno o más productos. Revisá tu carrito.',
        )
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setStockError('Ocurrió un error al procesar tu pedido. Intentá de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <Seo title="Checkout" description={`Finalizá tu compra en ${brand.name}.`} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Finalizar compra</h1>

        {stockError && (
          <div className="mb-6 border border-accent bg-accent/5 px-4 py-3 text-sm text-accent">
            {stockError}
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* ---------- Formulario ---------- */}
          <form onSubmit={handleSubmit} noValidate className="space-y-10">
            {/* Contacto */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">
                1 · Contacto
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div data-error={!!errors.email} className="sm:col-span-2">
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="tu@email.com"
                  />
                </div>
                <div data-error={!!errors.nombre}>
                  <Field
                    label="Nombre completo"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    error={errors.nombre}
                  />
                </div>
                <div data-error={!!errors.telefono}>
                  <Field
                    label="Teléfono"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    error={errors.telefono}
                    placeholder="+54 11 ..."
                  />
                </div>
              </div>
            </section>

            {/* Envío */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">
                2 · Dirección de envío
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div data-error={!!errors.direccion} className="sm:col-span-2">
                  <Field
                    label="Dirección"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    error={errors.direccion}
                    placeholder="Calle, número, depto"
                  />
                </div>
                <div data-error={!!errors.ciudad}>
                  <Field
                    label="Ciudad"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    error={errors.ciudad}
                  />
                </div>
                <div data-error={!!errors.provincia}>
                  <Field
                    label="Provincia"
                    name="provincia"
                    value={form.provincia}
                    onChange={handleChange}
                    error={errors.provincia}
                  />
                </div>
                <div data-error={!!errors.cp}>
                  <Field
                    label="Código postal"
                    name="cp"
                    value={form.cp}
                    onChange={handleChange}
                    error={errors.cp}
                    inputMode="numeric"
                  />
                </div>
              </div>
            </section>

            {/* Pago (simulado) */}
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-widest">
                3 · Pago
              </h2>
              <p className="mb-4 text-xs text-gray">
                Pago 100% simulado — no ingreses datos reales. Cualquier número
                con el formato correcto funciona.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div data-error={!!errors.tarjeta} className="sm:col-span-2">
                  <Field
                    label="Número de tarjeta"
                    name="tarjeta"
                    value={form.tarjeta}
                    onChange={handleChange}
                    error={errors.tarjeta}
                    placeholder="4242 4242 4242 4242"
                    inputMode="numeric"
                  />
                </div>
                <div data-error={!!errors.vencimiento}>
                  <Field
                    label="Vencimiento"
                    name="vencimiento"
                    value={form.vencimiento}
                    onChange={handleChange}
                    error={errors.vencimiento}
                    placeholder="MM/AA"
                  />
                </div>
                <div data-error={!!errors.cvc}>
                  <Field
                    label="CVC"
                    name="cvc"
                    value={form.cvc}
                    onChange={handleChange}
                    error={errors.cvc}
                    placeholder="123"
                    inputMode="numeric"
                  />
                </div>
                <div data-error={!!errors.titular} className="sm:col-span-2">
                  <Field
                    label="Titular de la tarjeta"
                    name="titular"
                    value={form.titular}
                    onChange={handleChange}
                    error={errors.titular}
                  />
                </div>
              </div>
            </section>

            <div className="hidden lg:block">
              <Button type="submit" size="lg" full disabled={submitting}>
                {submitting ? 'Procesando...' : `Pagar ${formatPrice(total)}`}
              </Button>
            </div>
          </form>

          {/* ---------- Resumen ---------- */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="border border-line p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest">
                Tu pedido
              </h2>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.lineId} className="flex gap-3">
                    <div className="w-14 shrink-0">
                      <ProductImage src={item.imagen} alt={item.nombre} />
                    </div>
                    <div className="flex flex-1 flex-col text-sm">
                      <span className="font-medium leading-snug">{item.nombre}</span>
                      <span className="text-xs text-gray">
                        Talle {item.talle} · {item.color} · x{item.qty}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatPrice(item.precio * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between text-gray">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* CTA mobile */}
            <div className="mt-4 lg:hidden">
              <Button
                type="submit"
                size="lg"
                full
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Procesando...' : `Pagar ${formatPrice(total)}`}
              </Button>
            </div>

            <Link
              to="/tienda"
              className="mt-4 block text-center text-xs uppercase tracking-widest text-gray hover:text-ink"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}
