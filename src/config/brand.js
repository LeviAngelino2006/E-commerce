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
  name: 'MANTO',
  // Logo: por simplicidad usamos un wordmark tipográfico (ver componente Logo).
  // Para usar un logo en imagen, reemplazá el componente src/components/Logo.jsx
  tagline: 'Lo esencial, bien hecho.',
  manifesto:
    'Hacemos ropa para tu día real: el que arranca temprano y no para. Cómoda sin ser descuidada, simple sin ser aburrida. Lo que te ponés sin pensarlo dos veces.',

  // --- SEO / metadatos ---
  seo: {
    titleSuffix: 'MANTO',
    defaultDescription:
      'MANTO — Indumentaria urbana y athleisure',
  },

  // --- Paleta (alto contraste, minimalista) ---
  // Estos valores son la referencia; los tokens de Tailwind están en index.css.
  colors: {
    bg: '#F4F3F0', // off-white cálido
    ink: '#161514', // negro cálido
    gray: '#707070', // gris neutro
    line: '#E4E3DF', // bordes / líneas
    accent: '#C24E2C', // terracota
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
  contactEmail: 'hola@manto.demo',

  // --- Envíos / textos comerciales reutilizables ---
  shipping: {
    freeOver: 80000, // umbral envío gratis (mock)
    note: 'Envío gratis en compras superiores a $80.000.',
  },

  // --- Trust badges (footer) ---
  // RE-SKIN: adaptá textos para la marca del cliente.
  trustBadges: [
    { title: 'Despacho en 24 h', text: 'Llegamos a todo el país en 2 a 5 días hábiles.' },
    { title: 'Cambios sin vueltas', text: 'Tenés 30 días para cambiar de idea.' },
    { title: 'Compra protegida', text: 'Pago cifrado y seguimiento de tu pedido de punta a punta.' },
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
