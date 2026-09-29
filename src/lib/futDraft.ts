import type { Card, Category, Position } from '../types'
import { FORMATIONS, type FormationId } from './lineup'

// Mecanica copiada de ale-dm/inazuma-draft (rama app, lib/fut-draft.ts):
// para cada hueco salen OPTIONS cartas para elegir 1, con la rareza
// sorteada por peso — igual que un draft de FIFA/FC.
export const OPTIONS = 6
export const BENCH = 5

const RARITY_WEIGHT: Record<Category, number> = {
  'Legendary Player': 8,
  'Top Player': 22,
  'Advanced Player': 35,
  'Growing Player': 25,
  'Common Player': 10,
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function formationOptions(): FormationId[] {
  return shuffle(FORMATIONS.map((f) => f.id)).slice(0, OPTIONS)
}

function pool(catalog: Card[], taken: Set<string>, filter: (c: Card) => boolean): Card[] {
  return catalog.filter((c) => c.image && !taken.has(c.characterId) && filter(c))
}

function draw(candidates: Card[], weights: Partial<Record<Category, number>>): Card[] {
  const byCat = new Map<Category, Card[]>()
  for (const c of candidates) {
    if (!weights[c.category]) continue
    const list = byCat.get(c.category)
    if (list) list.push(c)
    else byCat.set(c.category, [c])
  }
  const out: Card[] = []
  const chars = new Set<string>()
  for (let tries = 0; out.length < OPTIONS && tries < 200; tries++) {
    const cats = [...byCat.keys()].filter((c) => byCat.get(c)!.length)
    if (!cats.length) break
    const total = cats.reduce((sum, c) => sum + weights[c]!, 0)
    let r = Math.random() * total
    const cat = cats.find((c) => (r -= weights[c]!) < 0) ?? cats[cats.length - 1]
    const list = byCat.get(cat)!
    const c = list.splice(Math.floor(Math.random() * list.length), 1)[0]
    if (!chars.has(c.characterId)) {
      chars.add(c.characterId)
      out.push(c)
    }
  }
  return out
}

export function captainOptions(catalog: Card[]): Card[] {
  return draw(pool(catalog, new Set(), () => true), { 'Legendary Player': 1, 'Top Player': 2 })
}

export function benchOptions(catalog: Card[], taken: Set<string>): Card[] {
  return draw(pool(catalog, taken, () => true), RARITY_WEIGHT)
}

export function slotOptions(catalog: Card[], position: Position, taken: Set<string>): Card[] {
  return draw(pool(catalog, taken, (c) => c.position === position), RARITY_WEIGHT)
}
