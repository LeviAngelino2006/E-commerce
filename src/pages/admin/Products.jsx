import { useEffect, useState, useCallback } from 'react'
import api from '../../lib/api.js'
import { formatPrice, brand } from '../../config/brand.js'
import { useUiStore } from '../../store/uiStore.js'

const ALL_TALLES = ['S', 'M', 'L', 'XL', 'Único']

const EMPTY_FORM = {
  nombre: '',
  categoria: brand.categories[0],
  precio: '',
  precioAnterior: '',
  colores: '',
  talles: [],
  imagen1: '',
  imagen2: '',
  descripcion: '',
  destacado: false,
  nuevo: false,
  stock: '',
}

function productToForm(p) {
  return {
    nombre: p.nombre || '',
    categoria: p.categoria || brand.categories[0],
    precio: p.precio ?? '',
    precioAnterior: p.precioAnterior ?? '',
    colores: (p.colores || []).join(', '),
    talles: p.talles || [],
    imagen1: p.imagenes?.[0] || '',
    imagen2: p.imagenes?.[1] || '',
    descripcion: p.descripcion || '',
    destacado: !!p.destacado,
    nuevo: !!p.nuevo,
    stock: p.stock ?? '',
  }
}

function formToPayload(form) {
  return {
    nombre: form.nombre,
    categoria: form.categoria,
    precio: Number(form.precio),
    precioAnterior: form.precioAnterior !== '' ? Number(form.precioAnterior) : null,
    colores: form.colores
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean),
    talles: form.talles,
    imagenes: [form.imagen1, form.imagen2].filter(Boolean),
    descripcion: form.descripcion,
    destacado: form.destacado,
    nuevo: form.nuevo,
    stock: form.stock !== '' ? Number(form.stock) : undefined,
  }
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray uppercase tracking-wider mb-1">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full border border-line rounded px-3 py-2 text-sm text-ink bg-white focus:outline-none focus:border-ink transition-colors'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const addToast = useUiStore((s) => s.addToast)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    api
      .get('/api/products')
      .then((r) => setProducts(Array.isArray(r.data) ? r.data : r.data.products || []))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const openNew = () => {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setPanelOpen(true)
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setForm(productToForm(p))
    setFormError(null)
    setPanelOpen(true)
  }

  const closePanel = () => {
    setPanelOpen(false)
    setEditProduct(null)
    setFormError(null)
  }

  const handleDelete = async (p) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`/api/admin/products/${p.id}`)
      addToast(`"${p.nombre}" eliminado.`)
      fetchProducts()
    } catch (e) {
      addToast(e.response?.data?.error || 'Error al eliminar el producto.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.precio) {
      setFormError('Nombre y precio son obligatorios.')
      return
    }
    setFormError(null)
    setSubmitting(true)
    try {
      const payload = formToPayload(form)
      if (editProduct) {
        await api.put(`/api/admin/products/${editProduct.id}`, payload)
        addToast('Producto actualizado.')
      } else {
        await api.post('/api/admin/products', payload)
        addToast('Producto creado.')
      }
      closePanel()
      fetchProducts()
    } catch (e) {
      setFormError(e.response?.data?.error || 'Error al guardar el producto.')
    } finally {
      setSubmitting(false)
    }
  }

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const toggleTalle = (t) =>
    setForm((f) => ({
      ...f,
      talles: f.talles.includes(t) ? f.talles.filter((x) => x !== t) : [...f.talles, t],
    }))

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Productos</h1>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-ink text-white text-sm rounded hover:bg-ink/80 transition-colors"
        >
          + Nuevo producto
        </button>
      </div>

      {loading && (
        <p className="text-sm text-gray">Cargando productos…</p>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium w-14">
                  Imagen
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium">
                  Nombre
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium hidden md:table-cell">
                  Categoría
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium hidden sm:table-cell">
                  Precio
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium hidden lg:table-cell">
                  Stock
                </th>
                <th className="text-left px-4 py-3 text-xs text-gray uppercase tracking-wider font-medium hidden lg:table-cell">
                  Badges
                </th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray">
                    No hay productos.
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="border-t border-line hover:bg-bg/50 transition-colors">
                  <td className="px-4 py-3">
                    {p.imagenes?.[0] ? (
                      <img
                        src={p.imagenes[0]}
                        alt={p.nombre}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-line rounded" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink max-w-[200px] truncate">
                    {p.nombre}
                  </td>
                  <td className="px-4 py-3 text-gray hidden md:table-cell">
                    {p.categoria}
                  </td>
                  <td className="px-4 py-3 text-ink tabular-nums hidden sm:table-cell">
                    {formatPrice(p.precio)}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {p.stock != null ? (
                      <span
                        className={`text-xs font-medium ${
                          p.stock <= 3 ? 'text-red-600' : 'text-gray'
                        }`}
                      >
                        {p.stock}
                      </span>
                    ) : (
                      <span className="text-xs text-line">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex gap-1">
                      {p.destacado && (
                        <span className="text-xs bg-ink text-white px-1.5 py-0.5 rounded">
                          Dest.
                        </span>
                      )}
                      {p.nuevo && (
                        <span className="text-xs bg-accent text-white px-1.5 py-0.5 rounded">
                          Nuevo
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-xs text-gray hover:text-ink transition-colors underline underline-offset-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors underline underline-offset-4"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Side panel */}
      {panelOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/30"
            onClick={closePanel}
            aria-hidden="true"
          />

          {/* Panel */}
          <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line flex-shrink-0">
              <h2 className="font-display font-semibold text-ink">
                {editProduct ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button
                onClick={closePanel}
                className="text-gray hover:text-ink transition-colors text-xl leading-none"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              <Field label="Nombre" required>
                <input
                  className={inputCls}
                  value={form.nombre}
                  onChange={(e) => setField('nombre', e.target.value)}
                  required
                />
              </Field>

              <Field label="Categoría" required>
                <select
                  className={inputCls}
                  value={form.categoria}
                  onChange={(e) => setField('categoria', e.target.value)}
                >
                  {brand.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Precio" required>
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    step="1"
                    value={form.precio}
                    onChange={(e) => setField('precio', e.target.value)}
                    required
                  />
                </Field>
                <Field label="Precio anterior">
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Opcional"
                    value={form.precioAnterior}
                    onChange={(e) => setField('precioAnterior', e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock">
                  <input
                    className={inputCls}
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Opcional"
                    value={form.stock}
                    onChange={(e) => setField('stock', e.target.value)}
                  />
                </Field>
                <div />
              </div>

              <Field label="Colores (separados por coma)">
                <input
                  className={inputCls}
                  placeholder="Negro, Blanco, Gris"
                  value={form.colores}
                  onChange={(e) => setField('colores', e.target.value)}
                />
              </Field>

              <Field label="Talles">
                <div className="flex flex-wrap gap-2 mt-1">
                  {ALL_TALLES.map((t) => (
                    <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.talles.includes(t)}
                        onChange={() => toggleTalle(t)}
                        className="accent-ink"
                      />
                      <span className="text-sm text-ink">{t}</span>
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Imagen principal (URL)">
                <input
                  className={inputCls}
                  type="url"
                  placeholder="https://..."
                  value={form.imagen1}
                  onChange={(e) => setField('imagen1', e.target.value)}
                />
              </Field>

              <Field label="Imagen secundaria (URL)">
                <input
                  className={inputCls}
                  type="url"
                  placeholder="https://... (opcional)"
                  value={form.imagen2}
                  onChange={(e) => setField('imagen2', e.target.value)}
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) => setField('descripcion', e.target.value)}
                />
              </Field>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setField('destacado', e.target.checked)}
                    className="accent-ink"
                  />
                  <span className="text-sm text-ink">Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.nuevo}
                    onChange={(e) => setField('nuevo', e.target.checked)}
                    className="accent-ink"
                  />
                  <span className="text-sm text-ink">Nuevo</span>
                </label>
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
                  {formError}
                </p>
              )}
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-line flex-shrink-0 flex gap-3">
              <button
                type="button"
                onClick={closePanel}
                className="flex-1 px-4 py-2 border border-line rounded text-sm text-gray hover:text-ink hover:border-ink transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="product-form"
                disabled={submitting}
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-ink text-white text-sm rounded hover:bg-ink/80 transition-colors disabled:opacity-50"
              >
                {submitting
                  ? 'Guardando…'
                  : editProduct
                  ? 'Guardar cambios'
                  : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
