export type Position = 'GK' | 'DF' | 'MF' | 'FW'
export type Element = 'fire' | 'wood' | 'air' | 'earth'
export type Category = 'Legendary Player' | 'Top Player' | 'Advanced Player' | 'Growing Player' | 'Common Player'
export type GameId = 'IE1' | 'IE2' | 'IE3' | 'GO1' | 'GO2' | 'GO3' | 'ARES' | 'ORION' | 'VR'

export interface CardTechnique {
  slot: number
  id: string
  name: string
  victorymodsId: number | null
  element: Element | null
  /** Coste en TP: el real de Victory Road si lo tenemos, si no el historico de la wiki. */
  tp: number | null
}

export interface Card {
  id: string
  characterId: string
  name: string
  /** Apodo real del juego (zukan), p.ej. "Axel" para Axel Blaze — el que se ve en la carta */
  nickname: string | null
  game: GameId
  version: string
  team: string | null
  position: Position
  element: Element | null
  category: Category
  image: string | null
  /** Escudo del equipo (de Supabase `teams`), null si no hay. */
  teamLogo: string | null
  techniques: CardTechnique[]
  /** Codigo de personaje real de Victory Road (c0XXXXXXX), null si no resuelto todavia. */
  victorymodsCharacterCode: string | null
}

/** Un jugador colocado en un hueco del equipo (titular 0-10, suplente 11-15). */
export interface SquadSlot {
  slot: number
  card: Card | null
}

export interface Formation {
  id: number
  powerOffense: number
  powerDefense: number
}
