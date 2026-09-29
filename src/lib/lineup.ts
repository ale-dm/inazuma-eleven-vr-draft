import type { Card, Position } from '../types'
import formationMap from '../data/formationMap.json'

// Formaciones copiadas de ale-dm/inazuma-draft (rama app, lib/lineup.ts) —
// mismo layout visual del campo (11 puestos con su x/y). Cada una tiene su
// id real de Victory Road en formationMap.json (mismo reparto DF/MF/FW,
// sacado de m_SoccerFormationInfoList + m_SoccerFormPlacementInfoList).
export type SlotId =
  | 'GK'
  | 'LB' | 'CB1' | 'CB2' | 'CB3' | 'RB'
  | 'CM1' | 'CM2' | 'CM3' | 'CM4' | 'CM5'
  | 'LW' | 'ST' | 'RW'

export type FormationId =
  | 'basic' | 'three_top' | 'butterfly' | 'phoenix' | 'neo'
  | 'death_zone' | 'wild_park' | 'ghost_dance' | 'mugen' | 'phalanx'

export interface FormationSlot { id: SlotId; role: Position; x: number; y: number }
export interface FormationDef { id: FormationId; name: string; layout: string; slots: FormationSlot[] }

function s(id: SlotId, x: number, y: number, role: Position): FormationSlot {
  return { id, role, x, y }
}

const DF4 = [s('LB', 10, 62, 'DF'), s('CB1', 33, 67, 'DF'), s('CB2', 67, 67, 'DF'), s('RB', 90, 62, 'DF')] as const
const DF5 = [s('LB', 8, 70, 'DF'), s('CB1', 25, 74, 'DF'), s('CB2', 50, 76, 'DF'), s('CB3', 75, 74, 'DF'), s('RB', 92, 70, 'DF')] as const

export const FORMATIONS: FormationDef[] = [
  { id: 'basic', name: 'F-Basic', layout: '4-4-2', slots: [s('LW', 36, 8, 'FW'), s('RW', 64, 8, 'FW'), s('CM1', 18, 40, 'MF'), s('CM2', 38, 40, 'MF'), s('CM3', 62, 40, 'MF'), s('CM4', 82, 40, 'MF'), ...DF4, s('GK', 50, 86, 'GK')] },
  { id: 'three_top', name: 'F-Three Top', layout: '4-3-3', slots: [s('LW', 14, 7, 'FW'), s('ST', 50, 5, 'FW'), s('RW', 86, 7, 'FW'), s('CM1', 28, 32, 'MF'), s('CM2', 50, 27, 'MF'), s('CM3', 72, 32, 'MF'), ...DF4, s('GK', 50, 86, 'GK')] },
  { id: 'butterfly', name: 'F-Butterfly', layout: '4-3-3', slots: [s('LW', 10, 6, 'FW'), s('ST', 50, 8, 'FW'), s('RW', 90, 6, 'FW'), s('CM1', 30, 30, 'MF'), s('CM2', 50, 26, 'MF'), s('CM3', 70, 30, 'MF'), s('LB', 6, 48, 'DF'), s('CB1', 33, 66, 'DF'), s('CB2', 67, 66, 'DF'), s('RB', 94, 48, 'DF'), s('GK', 50, 86, 'GK')] },
  { id: 'phoenix', name: 'F-Phoenix', layout: '4-3-3', slots: [s('LW', 18, 10, 'FW'), s('ST', 50, 10, 'FW'), s('RW', 82, 10, 'FW'), s('CM1', 30, 34, 'MF'), s('CM2', 50, 30, 'MF'), s('CM3', 70, 34, 'MF'), ...DF4, s('GK', 50, 86, 'GK')] },
  { id: 'neo', name: 'F-Neo', layout: '4-3-3', slots: [s('LW', 12, 4, 'FW'), s('ST', 50, 3, 'FW'), s('RW', 88, 4, 'FW'), s('CM1', 26, 28, 'MF'), s('CM2', 50, 24, 'MF'), s('CM3', 74, 28, 'MF'), ...DF4, s('GK', 50, 86, 'GK')] },
  { id: 'death_zone', name: 'F-Death Zone 2', layout: '5-3-2', slots: [s('LW', 36, 10, 'FW'), s('RW', 64, 10, 'FW'), s('CM1', 30, 45, 'MF'), s('CM2', 50, 42, 'MF'), s('CM3', 70, 45, 'MF'), ...DF5, s('GK', 50, 86, 'GK')] },
  { id: 'wild_park', name: 'F-Wild Park', layout: '3-4-3', slots: [s('LW', 14, 7, 'FW'), s('ST', 50, 5, 'FW'), s('RW', 86, 7, 'FW'), s('CM1', 18, 38, 'MF'), s('CM2', 38, 36, 'MF'), s('CM3', 62, 36, 'MF'), s('CM4', 82, 38, 'MF'), s('CB1', 30, 70, 'DF'), s('CB2', 50, 72, 'DF'), s('CB3', 70, 70, 'DF'), s('GK', 50, 86, 'GK')] },
  { id: 'ghost_dance', name: 'F-Ghost Dance', layout: '4-5-1', slots: [s('ST', 50, 6, 'FW'), s('CM1', 8, 42, 'MF'), s('CM2', 28, 35, 'MF'), s('CM3', 50, 32, 'MF'), s('CM4', 72, 35, 'MF'), s('CM5', 92, 42, 'MF'), ...DF4, s('GK', 50, 86, 'GK')] },
  { id: 'mugen', name: 'F-Mugen', layout: '4-3-2-1', slots: [s('ST', 50, 5, 'FW'), s('LW', 16, 24, 'MF'), s('CM3', 50, 24, 'MF'), s('RW', 84, 24, 'MF'), s('CM1', 36, 48, 'MF'), s('CM2', 64, 48, 'MF'), ...DF4, s('GK', 50, 86, 'GK')] },
  { id: 'phalanx', name: 'F-Phalanx', layout: '5-4-1', slots: [s('ST', 50, 6, 'FW'), s('CM1', 15, 38, 'MF'), s('CM2', 38, 38, 'MF'), s('CM3', 62, 38, 'MF'), s('CM4', 85, 38, 'MF'), ...DF5, s('GK', 50, 86, 'GK')] },
]

const ASSIGN_ORDER: Record<FormationId, SlotId[]> = {
  basic: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM1', 'CM2', 'CM3', 'CM4', 'LW', 'RW'],
  three_top: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  butterfly: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  phoenix: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  neo: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM2', 'CM1', 'CM3', 'ST', 'LW', 'RW'],
  death_zone: ['GK', 'LB', 'CB1', 'CB2', 'CB3', 'RB', 'CM2', 'CM1', 'CM3', 'LW', 'RW'],
  wild_park: ['GK', 'CB1', 'CB2', 'CB3', 'CM2', 'CM1', 'CM3', 'CM4', 'LW', 'ST', 'RW'],
  ghost_dance: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM3', 'CM2', 'CM1', 'CM4', 'CM5', 'ST'],
  mugen: ['GK', 'LB', 'CB1', 'CB2', 'RB', 'CM1', 'CM2', 'CM3', 'LW', 'RW', 'ST'],
  phalanx: ['GK', 'LB', 'CB1', 'CB2', 'CB3', 'RB', 'CM2', 'CM1', 'CM3', 'CM4', 'ST'],
}

export type LineupMap = Partial<Record<SlotId, Card>>

export function getFormation(id: FormationId): FormationDef {
  return FORMATIONS.find((f) => f.id === id) ?? FORMATIONS[0]
}

/** Id real de formacion de Victory Road para el dibujo elegido (mismo reparto DF/MF/FW) */
export function realFormationId(id: FormationId): number {
  return (formationMap as Record<FormationId, number>)[id]
}

function activeSlotIds(formationId: FormationId): SlotId[] {
  return getFormation(formationId).slots.map((s) => s.id)
}

export function getSlot(slotId: SlotId, formationId: FormationId): FormationSlot | undefined {
  return getFormation(formationId).slots.find((s) => s.id === slotId)
}

function canPlace(card: Card, slot: FormationSlot): boolean {
  return card.position === slot.role
}

export function nextEmptySlot(lineup: LineupMap, card: Card, formationId: FormationId): SlotId | null {
  const active = new Set(activeSlotIds(formationId))
  for (const slotId of ASSIGN_ORDER[formationId]) {
    if (!active.has(slotId) || lineup[slotId]) continue
    const slot = getSlot(slotId, formationId)!
    if (canPlace(card, slot)) return slotId
  }
  return null
}
