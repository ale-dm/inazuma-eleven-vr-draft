import { useState } from 'react'
import type { Card } from '../types'
import { getFormation, nextEmptySlot, type FormationId, type LineupMap, type SlotId } from '../lib/lineup'
import { BENCH, benchOptions, captainOptions, formationOptions, slotOptions } from '../lib/futDraft'
import InaCard from './InaCard'
import Sheet from './Sheet'
import Pitch, { fieldY } from './Pitch'
import { exportAndDownload } from '../lib/exportVictoryMods'

interface Props {
  catalog: Card[]
}

type Spot = SlotId | `bench-${number}`
const benchSpot = (i: number): Spot => `bench-${i}`
const benchIndex = (s: Spot) => (s.startsWith('bench-') ? Number(s.slice(6)) : -1)

/** Draft estilo FIFA/FC — copiado de ale-dm/inazuma-draft (rama app, FutDraft.tsx):
 * formacion, capitan y cada hueco 1 de 6, sin rondas. Sin quimica (no aplica aqui). */
export default function FutDraft({ catalog }: Props) {
  const [formations] = useState(() => formationOptions())
  const [captains] = useState(() => captainOptions(catalog))
  const [formation, setFormation] = useState<FormationId | null>(null)
  const [captain, setCaptain] = useState<SlotId | null>(null)
  const [lineup, setLineup] = useState<LineupMap>({})
  const [bench, setBench] = useState<(Card | null)[]>(Array(BENCH).fill(null))
  const [picking, setPicking] = useState<Spot | null>(null)
  const [options, setOptions] = useState<Partial<Record<Spot, Card[]>>>({})
  const [teamName, setTeamName] = useState('Mi Equipo')
  const [error, setError] = useState<string | null>(null)

  const def = formation ? getFormation(formation) : null
  const placed = Object.values(lineup).filter((c): c is Card => !!c)
  const full = !!def && placed.length === def.slots.length
  const benchFull = bench.every((c) => c !== null)
  const taken = () => new Set([...placed, ...bench].filter((c): c is Card => !!c).map((c) => c.characterId))

  const roleAt = (s: Spot) => (benchIndex(s) >= 0 ? null : def!.slots.find((x) => x.id === s)!.role)

  function put(spot: Spot, card: Card) {
    if (benchIndex(spot) >= 0) {
      setBench((b) => { const next = [...b]; next[benchIndex(spot)] = card; return next })
    } else {
      setLineup((l) => ({ ...l, [spot as SlotId]: card }))
    }
  }

  function chooseCaptain(card: Card) {
    const slot = nextEmptySlot({}, card, formation!)
    if (!slot) return
    setLineup({ [slot]: card })
    setCaptain(slot)
  }

  function openSpot(spot: Spot) {
    if (!options[spot]) {
      const role = roleAt(spot)
      setOptions((o) => ({ ...o, [spot]: role ? slotOptions(catalog, role, taken()) : benchOptions(catalog, taken()) }))
    }
    setPicking(spot)
  }

  function pick(card: Card) {
    put(picking!, card)
    setPicking(null)
  }

  function handleExport() {
    setError(null)
    const slots = [
      ...Object.entries(lineup).map(([, card], i) => ({ slot: i, card: card! })),
      ...bench.filter((c): c is Card => !!c).map((card, i) => ({ slot: 11 + i, card })),
    ]
    const captainSlot = Object.keys(lineup).indexOf(captain ?? '')
    try {
      exportAndDownload({ name: teamName.trim() || 'Mi Equipo', slots, captainSlot: captainSlot >= 0 ? captainSlot : 0 })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="hub fd" style={{ position: 'relative', minHeight: '70vh' }}>
      <main className="fd-main">
        {!formation && (
          <section className="fd-step">
            <h2 className="fd-title">Formacion</h2>
            <div className="fd-formations">
              {formations.map((id) => {
                const f = getFormation(id)
                return (
                  <button key={id} type="button" className="tile fd-formation" onClick={() => setFormation(id)}>
                    <span className="fd-mini">
                      {f.slots.map((s) => <i key={s.id} style={{ left: `${s.x}%`, top: `${fieldY(s.y)}%` }} />)}
                    </span>
                    <span className="tile__label">{f.name}</span>
                    <small>{f.layout}</small>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {formation && !captain && (
          <section className="fd-step">
            <h2 className="fd-title">Capitan</h2>
            <div className="fd-options">
              {captains.map((c) => <InaCard key={c.id} card={c} onClick={() => chooseCaptain(c)} />)}
            </div>
          </section>
        )}

        {def && captain && (
          <section className="fd-step">
            <p className="fd-hint">{full ? 'Completa el banquillo' : 'Toca un hueco vacio'}</p>
            <Pitch slots={def.slots} lineup={lineup} captain={captain} onTapEmpty={openSpot} />

            {full && (
              <>
                <h3 className="sheet-label">Suplentes</h3>
                <div className="fd-bench">
                  {bench.map((card, i) => (
                    <div key={i} className="fd-bench__spot">
                      {card ? <InaCard card={card} size="xs" /> : (
                        <button type="button" className="fd-empty" onClick={() => openSpot(benchSpot(i))}>+</button>
                      )}
                    </div>
                  ))}
                </div>

                {benchFull && (
                  <div className="iz-panel">
                    <div className="iz-panel-head">Exportar</div>
                    <div className="iz-panel-body space-y-3">
                      <input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="search-input"
                        placeholder="Nombre del equipo"
                      />
                      {error && <p className="text-sm text-red-400">{error}</p>}
                      <button type="button" className="sheet-cta fd-cta" onClick={handleExport}>
                        Exportar a VictoryMods
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>

      <Sheet open={!!picking} title={picking ? `Elige ${roleAt(picking) ?? 'suplente'}` : ''} onClose={() => setPicking(null)}>
        <div className="fd-options">
          {(picking && options[picking] || []).map((c) => <InaCard key={c.id} card={c} onClick={() => pick(c)} />)}
        </div>
      </Sheet>
    </div>
  )
}
