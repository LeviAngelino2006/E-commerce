/**
 * Genera public/og-image.png (1200×630) a partir de un SVG con la identidad
 * de marca de VÉRTICE. Ejecutar una vez con: npm run generate-og
 * RE-SKIN: ajustá los textos, colores y tipografía según la nueva marca.
 */
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dir, '..', 'public', 'og-image.png')

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- fondo cálido -->
  <rect width="1200" height="630" fill="#161514"/>

  <!-- acento de línea (color de marca) -->
  <rect x="510" y="335" width="180" height="2" fill="#C24E2C" opacity="0.7"/>

  <!-- wordmark principal -->
  <text
    x="600" y="320"
    font-family="Arial, Helvetica, sans-serif"
    font-size="108"
    font-weight="700"
    fill="#F4F3F0"
    text-anchor="middle"
    letter-spacing="18"
  >MANTO</text>

  <!-- tagline -->
  <text
    x="600" y="390"
    font-family="Arial, Helvetica, sans-serif"
    font-size="26"
    font-weight="400"
    fill="#F4F3F0"
    text-anchor="middle"
    letter-spacing="6"
    opacity="0.55"
  >Lo esencial, bien hecho.</text>
</svg>`

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
})
const pngData = resvg.render()
const pngBuffer = pngData.asPng()

writeFileSync(OUT, pngBuffer)
console.log(`✓ og-image.png generado → ${OUT}`)
