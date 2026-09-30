import { useMemo, useState } from 'react'
import type { Card, Category, GameId } from '../types'
import { filterCatalog, presetAvailability } from '../lib/presets'
import { GAME_LABEL } from '../data/games'
import { RARITY_ORDER, rarityLabel } from '../lib/rarity'
import FutDraft from './FutDraft'

interface Props {
  catalog: Card[]
}

/** Presets: filtra el catalogo por una o mas sagas y una rareza minima, y luego es el mismo draft de siempre (6 cartas, eliges) pero solo con esos jugadores. */
export default function Presets({ catalog }: Props) {
  const [games, setGames] = useState<Set<GameId>>(new Set())
  const [minRarity, setMinRarity] = useState<Category>('Common Player')
  const [started, setStarted] = useState(false)

  const availableGames = useMemo(() => {
    const present = new Set(catalog.map((c) => c.game))
    return (Object.keys(GAME_LABEL) as GameId[]).filter((g) => present.has(g))
  }, [catalog])

  const availability = useMemo(() => presetAvailability(catalog, games, minRarity), [catalog, games, minRarity])
  const filtered = useMemo(() => filterCatalog(catalog, games, minRarity), [catalog, games, minRarity])

  function toggleGame(g: GameId) {
    setGames((prev) => {
      const next = new Set(prev)
      if (next.has(g)) next.delete(g)
      else next.add(g)
      return next
    })
  }

  if (started) {
    return <FutDraft key={[...games].sort().join(',') + minRarity} catalog={filtered} onExit={() => setStarted(false)} />
  }

  return (
    <section className="fd-step">
      <h2 className="fd-title">Presets</h2>

      <div className="iz-panel">
        <div className="iz-panel-head">Filtro</div>
        <div className="iz-panel-body space-y-3">
          <div>
            <p className="sheet-label mb-1">Sagas (elige una o varias)</p>
            <div className="chip-row">
              {availableGames.map((g) => (
                <button key={g} type="button" className={`chip ${games.has(g) ? 'on' : ''}`} onClick={() => toggleGame(g)}>
                  {g} · {GAME_LABEL[g]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="sheet-label mb-1">Rareza minima</p>
            <div className="chip-row">
              {RARITY_ORDER.map((r) => (
                <button key={r} type="button" className={`chip ${minRarity === r ? 'on' : ''}`} onClick={() => setMinRarity(r)}>
                  {rarityLabel(r)}
                </button>
              ))}
            </div>
          </div>

          {games.size > 0 && (
            <p className="fd-hint" style={{ minHeight: 'auto' }}>
              Disponibles con ese filtro: {availability.total} jugadores — {availability.GK} PT · {availability.DF} DF · {availability.MF} MF · {availability.FW} DL
            </p>
          )}

          <button type="button" className="sheet-cta fd-cta" disabled={games.size === 0} onClick={() => setStarted(true)}>
            {games.size === 0 ? 'Elige al menos una saga' : 'Empezar draft'}
          </button>
        </div>
      </div>
    </section>
  )
}
