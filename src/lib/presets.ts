import type { Card, Category, GameId } from '../types'
import { meetsMinRarity } from './rarity'

/** El filtro de Presets: una o mas sagas + rareza minima. El draft en si lo hace FutDraft, igual que el modo normal. */
export function filterCatalog(catalog: Card[], games: Set<GameId>, minRarity: Category): Card[] {
  return catalog.filter((c) => games.has(c.game) && meetsMinRarity(c.category, minRarity))
}

/** Cuantos jugadores hay para cada puesto con el filtro elegido — para avisar antes de empezar */
export function presetAvailability(catalog: Card[], games: Set<GameId>, minRarity: Category) {
  const pool = filterCatalog(catalog, games, minRarity)
  return {
    total: pool.length,
    GK: pool.filter((c) => c.position === 'GK').length,
    DF: pool.filter((c) => c.position === 'DF').length,
    MF: pool.filter((c) => c.position === 'MF').length,
    FW: pool.filter((c) => c.position === 'FW').length,
  }
}
