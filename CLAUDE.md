# VÉRTICE — Demo de e-commerce (template re-skinnable)

Tienda online de indumentaria **frontend-only**, pensada como demo de venta y
como template para clonar y re-skinnear a otra marca en minutos. Todos los datos
son mock y el checkout es **100% simulado** (sin backend, sin pagos, sin auth).

## Stack

- **React 19** + **Vite**
- **Tailwind CSS 4** (plugin `@tailwindcss/vite`; tema por tokens `@theme` en `src/index.css`)
- **Zustand 5** (estado global con persistencia en `localStorage`)
- **React Router 7** (`react-router-dom`)
- **Framer Motion** (animaciones y microinteracciones)

## Scripts

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
npm run lint     # ESLint
```

## Estructura de carpetas

```
src/
  config/
    brand.js            # ⭐ identidad de marca + helper formatPrice()
  data/
    products.json       # ⭐ catálogo mock (~18 productos)
  lib/
    catalog.js          # acceso/filtros sobre el catálogo
    colors.js           # mapa nombre de color -> hex (swatches)
  store/
    cartStore.js        # carrito (persistido en localStorage)
    uiStore.js          # estado de UI (drawer carrito, panel filtros mobile)
  components/
    Navbar, Footer, CartDrawer, FilterPanel, ProductCard, ProductGrid,
    ProductImage, SizeSelector, ColorSelector, QuantitySelector, Accordion,
    Logo, Seo, ScrollToTop, PageTransition, icons.jsx, ui/Button.jsx
  pages/
    Home, Catalog (/tienda), Product (/producto/:id),
    Checkout (/checkout), Confirmation (/confirmacion), NotFound
  App.jsx               # rutas + layout + transiciones de página
  main.jsx              # entrypoint + BrowserRouter
  index.css             # ⭐ tokens de tema Tailwind (colores/fuentes)
```

## Rutas

| Ruta               | Página       |
|--------------------|--------------|
| `/`                | Home         |
| `/tienda`          | Catálogo/PLP (acepta `?categoria=` y `?orden=`) |
| `/producto/:id`    | Detalle/PDP  |
| `/checkout`        | Checkout (simulado) |
| `/confirmacion`    | Confirmación (vacía el carrito) |

## Cómo RE-SKINNEAR (cambiar de marca)

Tocá principalmente **3 lugares**:

1. **`src/config/brand.js`** — nombre, tagline, manifiesto, SEO, moneda,
   categorías, redes, contacto, umbral de envío gratis. Es el punto único de
   textos e identidad.
2. **`src/index.css`** (bloque `@theme`) — colores y fuentes como tokens
   (`--color-bg`, `--color-ink`, `--color-accent`, `--font-display`, etc.).
   Mantenelos sincronizados con `colors`/`fonts` de `brand.js`.
   Si cambiás las fuentes, actualizá también el `<link>` de Google Fonts en
   `index.html`.
3. **`src/data/products.json`** — catálogo. Reemplazá las URLs del campo
   `imagenes` por las fotos reales del cliente (o `/public/...`). Si una URL
   falla, `ProductImage` muestra un placeholder estilizado.

Extras opcionales: `src/lib/colors.js` (agregar colores nuevos del catálogo) y
`src/components/Logo.jsx` (cambiar el wordmark por un `<img>` de logo).

## Modelo de producto (`products.json`)

```json
{
  "id": "string",
  "nombre": "string",
  "categoria": "Remeras|Buzos|Camperas|Pantalones|Accesorios",
  "precio": 0,
  "precioAnterior": null,
  "colores": ["string"],
  "talles": ["S", "M", "L", "XL"],
  "imagenes": ["url1", "url2"],
  "descripcion": "string",
  "destacado": true,
  "nuevo": true
}
```

## Estado (Zustand)

- **cartStore** (persistido, clave `vertice-cart`): `items`, `addItem`,
  `removeItem`, `updateQty`, `clearCart`; selectores `subtotal()`, `itemCount()`.
  Cada línea se identifica por `producto+talle+color`.
- **uiStore** (efímero): `cartOpen` (drawer del carrito) y `filtersOpen`
  (panel de filtros en mobile).

## Reglas del proyecto (NO hacer)

- ❌ Nada de backend, base de datos ni API real.
- ❌ Nada de Mercado Pago ni ningún pago real; **jamás** pedir/usar credenciales reales.
- ❌ Nada de autenticación / login / cuenta de usuario.
- El checkout valida **solo formato** de los campos; no valida nada real.

## Convenciones

- Mobile-first, responsive. Imágenes con aspect-ratio fijo + `object-cover` y
  `loading="lazy"`.
- SEO básico por página vía `<Seo title description />` (setea `document.title`
  y meta description).
- Accesibilidad: `alt` en imágenes, foco visible, roles ARIA en selectores,
  navegación por teclado, cerrar drawers con Escape.
- Comentarios marcados con `RE-SKIN` señalan lo que se toca al cambiar de marca.
