import type { GameId } from '../types'

// Copiado de ale-dm/inazuma-draft (rama app, data/games.ts) para nombrar las sagas en Presets.
export const GAME_LABEL: Record<GameId, string> = {
  IE1: 'Inazuma Eleven',
  IE2: 'Firestorm / Blizzard',
  IE3: 'Lightning Bolt',
  GO1: 'GO Light / Shadow',
  GO2: 'Chrono Stones',
  GO3: 'GO Galaxy',
  ARES: 'Ares no Tenbin',
  ORION: 'Orion no Kokuin',
  VR: 'Victory Road',
}
