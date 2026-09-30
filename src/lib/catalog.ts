import { supabase } from './supabase'
import type { Card, Category, Element, GameId, Position } from '../types'
import nicknames from '../data/nicknames.json'

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
  card_techniques: {
    slot: number
    technique_id: string
    techniques: {
      id: string; name: string; victorymods_id: number | null; element: string | null; cost: number | null
      vr_tp: number | null; vr_power_min: number | null; vr_power_max: number | null
      balance_tp: number | null; balance_power_min: number | null; balance_power_max: number | null
    } | null
  }[]
  card_victorymods_map: { character_code: string | null }[] | { character_code: string | null } | null
}

interface TeamRow {
  name: string
  logo_url: string | null
  logos: Partial<Record<GameId, string>> | null
}

function resolveTeamLogo(team: string | null, game: GameId): string | null {
  if (!team) return null
  const t = teamsByName.get(team)
  if (!t) return null
  return t.logos?.[game] ?? t.logo_url ?? null
}

let teamsByName = new Map<string, TeamRow>()

function toCard(r: Row): Card {
  const mapRow = Array.isArray(r.card_victorymods_map) ? r.card_victorymods_map[0] : r.card_victorymods_map
  const game = r.game as GameId
  return {
    id: r.id,
    characterId: r.character_id,
    name: r.name,
    nickname: (nicknames as Record<string, string>)[r.character_id] ?? null,
    game,
    version: r.version,
    team: r.team,
    position: r.position as Position,
    element: (r.element as Element) ?? null,
    category: r.category as Category,
    image: r.image_url,
    teamLogo: resolveTeamLogo(r.team, game),
    victorymodsCharacterCode: mapRow?.character_code ?? null,
    techniques: (r.card_techniques ?? [])
      .filter((ct) => ct.techniques)
      .sort((a, b) => a.slot - b.slot)
      .map((ct) => {
        const t = ct.techniques!
        const powerMin = t.balance_power_min ?? t.vr_power_min
        const powerMax = t.balance_power_max ?? t.vr_power_max
        return {
          slot: ct.slot,
          id: ct.technique_id,
          name: t.name,
          victorymodsId: t.victorymods_id,
          element: (t.element as Element) ?? null,
          tp: t.balance_tp ?? t.vr_tp ?? t.cost ?? null,
          power: powerMin != null && powerMax != null ? { min: powerMin, max: powerMax } : null,
        }
      }),
  }
}

let cache: Card[] | null = null

/** Carga el catalogo completo (paginado) — solo cartas ya resueltas a un codigo
 * real de Victory Road, que son las unicas exportables a VictoryMods. */
export async function loadCatalog(): Promise<Card[]> {
  if (cache) return cache

  const { data: teamRows, error: teamError } = await supabase.from('teams').select('name, logo_url, logos')
  if (teamError) throw teamError
  teamsByName = new Map((teamRows as TeamRow[]).map((t) => [t.name, t]))

  const rows: Row[] = []
  let from = 0
  for (;;) {
    const { data, error } = await supabase
      .from('cards')
      .select(
        `id, character_id, name, game, version, team, position, element, category, image_url,
         card_techniques ( slot, technique_id, techniques ( id, name, victorymods_id, element, cost, vr_tp, vr_power_min, vr_power_max, balance_tp, balance_power_min, balance_power_max ) ),
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
