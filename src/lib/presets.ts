import type { Card, Category, GameId } from '../types'
import { getFormation, type FormationId, type LineupMap, type SlotId } from './lineup'
import { RARITY_ORDER, meetsMinRarity } from './rarity'

export interface PresetParams {
  game: GameId
  minRarity: Category
  formation: FormationId
}

export interface PresetResult {
  lineup: LineupMap
  bench: (Card | null)[]
  captain: SlotId
}

const BENCH_SLOTS = 5

function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Cuantos jugadores de esta saga (con la rareza minima elegida) hay para cada puesto — para avisar antes de generar */
export function presetAvailability(catalog: Card[], game: GameId, minRarity: Category) {
  const pool = catalog.filter((c) => c.game === game && meetsMinRarity(c.category, minRarity))
  return {
    total: pool.length,
    GK: pool.filter((c) => c.position === 'GK').length,
    DF: pool.filter((c) => c.position === 'DF').length,
    MF: pool.filter((c) => c.position === 'MF').length,
    FW: pool.filter((c) => c.position === 'FW').length,
  }
}

/**
 * Genera un equipo completo (once + banquillo) de una sola saga, respetando la
 * rareza minima y la formacion elegidas. Puede fallar si a esa saga+rareza le
 * faltan jugadores de algun puesto — se devuelve el puesto que falta, no se
 * rellena con otra saga (seria hacer trampa con el filtro que pidio el usuario).
 */
export function generatePreset(catalog: Card[], params: PresetParams): PresetResult | { error: string } {
  const pool = shuffle(catalog.filter((c) => c.game === params.game && meetsMinRarity(c.category, params.minRarity)))
  const def = getFormation(params.formation)
  const used = new Set<string>()
  const lineup: LineupMap = {}

  for (const slot of def.slots) {
    const pick = pool.find((c) => c.position === slot.role && !used.has(c.characterId))
    if (!pick) return { error: `No hay suficientes jugadores de puesto ${slot.role} en esta saga con esa rareza minima.` }
    used.add(pick.characterId)
    lineup[slot.id] = pick
  }

  const bench: (Card | null)[] = Array(BENCH_SLOTS).fill(null)
  const rest = pool.filter((c) => !used.has(c.characterId))
  for (let i = 0; i < BENCH_SLOTS && i < rest.length; i++) bench[i] = rest[i]

  const starters = Object.entries(lineup) as [SlotId, Card][]
  const captain = starters.reduce((best, cur) =>
    RARITY_ORDER.indexOf(cur[1].category) > RARITY_ORDER.indexOf(best[1].category) ? cur : best
  )[0]

  return { lineup, bench, captain }
}
