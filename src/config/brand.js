/**
 * ============================================================================
 *  CONFIGURACIÓN DE MARCA  —  PUNTO ÚNICO DE RE-SKIN
 * ============================================================================
 *  Para adaptar este demo a otra marca, editá ESTE archivo.
 *  Los colores y fuentes viven acá y también en src/index.css (tokens @theme).
 *  Mantené ambos sincronizados:
 *    - Textos / nombre / links / catálogo  -> este archivo
 *    - Colores / fuentes (tokens visuales)  -> este archivo + src/index.css
 *  El catálogo de productos vive en src/data/products.json
 * ============================================================================
 */

export const brand = {
  // --- Aviso de demo ---
  // RE-SKIN: cambiá el texto o poné null para ocultar la barra al entregar al cliente.
  demoBanner: 'Demo — pagos simulados, no se procesan transacciones reales.',

  // --- Identidad ---
  name: 'VÉRTICE',
  // Logo: por simplicidad usamos un wordmark tipográfico (ver componente Logo).
  // Para usar un logo en imagen, reemplazá el componente src/components/Logo.jsx
  tagline: 'Esenciales que duran.',
  manifesto:
    'Diseñamos prendas que sobreviven a las temporadas. Materiales nobles, cortes precisos y cero ruido. Menos, pero mejor.',

  // --- SEO / metadatos ---
  seo: {
    titleSuffix: 'VÉRTICE',
    defaultDescription:
      'VÉRTICE — indumentaria urbana premium. Esenciales que duran.',
  },

  // --- Paleta (alto contraste, minimalista) ---
  // Estos valores son la referencia; los tokens de Tailwind están en index.css.
  colors: {
    bg: '#FAFAFA', // off-white
    ink: '#0A0A0A', // negro
    gray: '#6B6B6B', // gris neutro
    line: '#E5E5E5', // bordes / líneas
    accent: '#2563EB', // acento sobrio (usar con moderación)
  },

  // --- Tipografía ---
  fonts: {
    display: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
  },

  // --- Moneda / formato ---
  currency: {
    symbol: '$',
    code: 'ARS',
    locale: 'es-AR',
  },

  // --- Navegación / categorías visibles en menús ---
  categories: ['Remeras', 'Buzos', 'Camperas', 'Pantalones', 'Accesorios'],

  // --- Footer / contacto (mock) ---
  social: {
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
  },
  contactEmail: 'hola@vertice.demo',

  // --- Envíos / textos comerciales reutilizables ---
  shipping: {
    freeOver: 80000, // umbral envío gratis (mock)
    note: 'Envío gratis en compras superiores a $80.000.',
  },

  // --- Trust badges (footer) ---
  // RE-SKIN: adaptá textos para la marca del cliente.
  trustBadges: [
    { icon: 'truck', text: 'Envíos a todo el país' },
    { icon: 'refresh', text: 'Cambios sin cargo' },
    { icon: 'shield', text: 'Compra protegida' },
  ],

  // --- Roadmap real (panel de demo) ---
  // RE-SKIN: editá la lista para cada pitch de cliente.
  roadmapReal: [
    'Checkout con Mercado Pago',
    'Panel de administración de productos',
    'Gestión de stock en tiempo real',
    'Métricas de ventas y reportes',
    'Sistema de descuentos y cupones',
    'Emails transaccionales automáticos',
  ],
}

/** Formatea un precio según la moneda configurada. */
export function formatPrice(value) {
  return new Intl.NumberFormat(brand.currency.locale, {
    style: 'currency',
    currency: brand.currency.code,
    maximumFractionDigits: 0,
  }).format(value)
}

export default brand
