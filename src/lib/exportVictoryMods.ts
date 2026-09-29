import { zipSync, strToU8 } from 'fflate'
import type { Card } from '../types'
import { GRADE_BY_CATEGORY } from './rarity'

// Hashes reales confirmados funcionando en equipos exportados por VictoryMods
// en el PC del usuario (mods/Los Masikos) — sin nombre resuelto todavia, ver
// catalog/README.md del proyecto hermano. Formacion tiene 115 alternativas
// reales en src/data/formations.json.
export const DEFAULT_FORMATION = 2048855606
export const DEFAULT_MAILLOT = -707195289
export const DEFAULT_EMBLEME = 'em070017'

export interface TeamSlot {
  slot: number
  card: Card
}

export interface ExportOptions {
  name: string
  slots: TeamSlot[]
  captainSlot: number
  formation?: number
  maillot?: number
  embleme?: string
  tactiques?: number[]
}

export function buildVictoryModsJson(opts: ExportOptions) {
  const joueurs: Record<string, string> = {}
  const niveaux: Record<string, { niveau: number; grade: number }> = {}
  const techniques: Record<string, number[]> = {}

  for (const { slot, card } of opts.slots) {
    if (!card.victorymodsCharacterCode) {
      throw new Error(`"${card.name}" (${card.game} ${card.version}) no tiene codigo de personaje resuelto todavia — no se puede exportar.`)
    }
    joueurs[slot] = card.victorymodsCharacterCode
    niveaux[slot] = { niveau: 40, grade: GRADE_BY_CATEGORY[card.category] }
    const ids = card.techniques.map((t) => t.victorymodsId).filter((id): id is number => id !== null)
    if (ids.length > 0) techniques[slot] = ids
  }

  return {
    type: 'equipe',
    nom: opts.name,
    version: 1,
    equipe: {
      nom: opts.name,
      joueurs,
      formation: opts.formation ?? DEFAULT_FORMATION,
      embleme: opts.embleme ?? DEFAULT_EMBLEME,
      maillot: opts.maillot ?? DEFAULT_MAILLOT,
      capitaine: opts.captainSlot,
      niveaux,
      techniques,
      tactiques: opts.tactiques ?? [],
    },
  }
}

export function buildModDataJson(name: string) {
  return {
    Name: name,
    Kind: 'victorymods-equipe',
    ModVersion: '1.0',
    GameVersion: '1.7.2',
  }
}

/** Genera el .zip del mod y dispara la descarga en el navegador. */
export function exportAndDownload(opts: ExportOptions) {
  const victorymods = buildVictoryModsJson(opts)
  const modData = buildModDataJson(opts.name)

  const zipped = zipSync({
    [`${opts.name}/mod_data.json`]: strToU8(JSON.stringify(modData, null, 2)),
    [`${opts.name}/victorymods.json`]: strToU8(JSON.stringify(victorymods, null, 2)),
  })

  const blob = new Blob([zipped], { type: 'application/zip' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${opts.name}.zip`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
