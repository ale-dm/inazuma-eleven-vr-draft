import { supabase } from './supabase'
import type { Card, Category, Element, GameId, Position } from '../types'

const PAGE = 1000

interface Row {
  id: string
  character_id: string
  name: string
  game: string
  version: string
  team: string | null
  position: string
  element: string | null
  category: string
  image_url: string | null
  card_techniques: { slot: number; technique_id: string; techniques: { id: string; name: string; victorymods_id: number | null } | null }[]
  card_victorymods_map: { character_code: string | null }[] | { character_code: string | null } | null
}

function toCard(r: Row): Card {
  const mapRow = Array.isArray(r.card_victorymods_map) ? r.card_victorymods_map[0] : r.card_victorymods_map
  return {
    id: r.id,
    characterId: r.character_id,
    name: r.name,
    game: r.game as GameId,
    version: r.version,
    team: r.team,
    position: r.position as Position,
    element: (r.element as Element) ?? null,
    category: r.category as Category,
    image: r.image_url,
    victorymodsCharacterCode: mapRow?.character_code ?? null,
    techniques: (r.card_techniques ?? [])
      .filter((ct) => ct.techniques)
      .sort((a, b) => a.slot - b.slot)
      .map((ct) => ({
        slot: ct.slot,
        id: ct.technique_id,
        name: ct.techniques!.name,
        victorymodsId: ct.techniques!.victorymods_id,
      })),
  }
}

let cache: Card[] | null = null

/** Carga el catalogo completo (paginado) — solo cartas ya resueltas a un codigo
 * real de Victory Road, que son las unicas exportables a VictoryMods. */
export async function loadCatalog(): Promise<Card[]> {
  if (cache) return cache
  const rows: Row[] = []
  let from = 0
  for (;;) {
    const { data, error } = await supabase
      .from('cards')
      .select(
        `id, character_id, name, game, version, team, position, element, category, image_url,
         card_techniques ( slot, technique_id, techniques ( id, name, victorymods_id ) ),
         card_victorymods_map!inner ( character_code )`
      )
      .not('card_victorymods_map.character_code', 'is', null)
      .range(from, from + PAGE - 1)
    if (error) throw error
    rows.push(...((data as unknown as Row[]) ?? []))
    if (!data || data.length < PAGE) break
    from += PAGE
  }
  cache = rows.map(toCard)
  return cache
}
