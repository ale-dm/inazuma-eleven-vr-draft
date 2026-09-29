import type { Category } from '../types'

/** Slug de CSS para el color de rareza (ver .vr-card--<slug> en index.css). */
export function raritySlug(category: Category): string {
  switch (category) {
    case 'Legendary Player': return 'legendary'
    case 'Top Player': return 'top'
    case 'Advanced Player': return 'advanced'
    case 'Growing Player': return 'growing'
    case 'Common Player': return 'common'
  }
}

export function rarityLabel(category: Category): string {
  return category.replace(' Player', '')
}

/** De menor a mayor — para filtros "rareza mínima" */
export const RARITY_ORDER: Category[] = ['Common Player', 'Growing Player', 'Advanced Player', 'Top Player', 'Legendary Player']

export function meetsMinRarity(category: Category, min: Category): boolean {
  return RARITY_ORDER.indexOf(category) >= RARITY_ORDER.indexOf(min)
}

/**
 * grade (0-5) de ExtraRoster BB por categoria. Confirmado leyendo
 * growth_table_config del juego: charaRank tiene 6 escalones reales (0-5),
 * el salto fuerte de stats esta en 3->4 y 4->5 — se salta el 3 a proposito
 * para que Top/Legendary conserven ese salto.
 *
 * NOTA (2026-09-29): confirmado en pruebas reales que el Stade BB (modo
 * "detente") no refleja este valor ni en color ni en stats visibles en
 * ninguna pantalla probada — se escribe igualmente porque es el dato
 * correcto del formato y podria importar en otros modos de juego.
 */
export const GRADE_BY_CATEGORY: Record<Category, number> = {
  'Common Player': 0,
  'Growing Player': 1,
  'Advanced Player': 2,
  'Top Player': 4,
  'Legendary Player': 5,
}
