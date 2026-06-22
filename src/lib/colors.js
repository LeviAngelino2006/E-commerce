/**
 * Mapa nombre de color -> hex, para renderizar swatches.
 * RE-SKIN: agregá acá los colores que use el catálogo del cliente.
 */
export const COLOR_HEX = {
  Negro: '#0A0A0A',
  'Off-white': '#F5F3EF',
  Gris: '#9CA3AF',
  Azul: '#2563EB',
  Blanco: '#FFFFFF',
  Beige: '#D8C9B5',
  Verde: '#3F6B4B',
}

export function colorToHex(name) {
  return COLOR_HEX[name] || '#CCCCCC'
}
