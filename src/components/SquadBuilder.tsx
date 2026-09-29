import { useMemo, useState } from 'react'
import type { Card, Formation } from '../types'
import InaCard from './InaCard'
import formationsData from '../data/formations.json'
import { exportAndDownload } from '../lib/exportVictoryMods'

const formations = formationsData as Formation[]
const STARTER_SLOTS = 11
const SUB_SLOTS = 5
const TOTAL_SLOTS = STARTER_SLOTS + SUB_SLOTS

interface Props {
  catalog: Card[]
}

/** Creador de equipo libre: buscar y añadir jugadores hasta completar 11+5. */
export default function SquadBuilder({ catalog }: Props) {
  const [squad, setSquad] = useState<(Card | null)[]>(Array(TOTAL_SLOTS).fill(null))
  const [captainSlot, setCaptainSlot] = useState(0)
  const [teamName, setTeamName] = useState('Mi Equipo')
  const [formationId, setFormationId] = useState<number>(formations[0]?.id ?? 0)
  const [search, setSearch] = useState('')
  const [positionFilter, setPositionFilter] = useState<string>('ALL')
  const [error, setError] = useState<string | null>(null)

  const usedIds = useMemo(() => new Set(squad.filter((c): c is Card => !!c).map((c) => c.id)), [squad])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return catalog
      .filter((c) => !usedIds.has(c.id))
      .filter((c) => positionFilter === 'ALL' || c.position === positionFilter)
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.game.toLowerCase().includes(q) || (c.team ?? '').toLowerCase().includes(q))
      .slice(0, 40)
  }, [catalog, usedIds, search, positionFilter])

  function addToFirstEmpty(card: Card) {
    setError(null)
    const idx = squad.findIndex((c) => c === null)
    if (idx === -1) return
    const next = [...squad]
    next[idx] = card
    setSquad(next)
  }

  function removeFromSlot(slot: number) {
    const next = [...squad]
    next[slot] = null
    setSquad(next)
  }

  const filledCount = squad.filter((c) => !!c).length
  const canExport = squad[captainSlot] != null && filledCount >= STARTER_SLOTS

  function handleExport() {
    setError(null)
    const slots = squad
      .map((card, slot) => (card ? { slot, card } : null))
      .filter((s): s is { slot: number; card: Card } => s !== null)
    try {
      exportAndDownload({ name: teamName.trim() || 'Mi Equipo', slots, captainSlot, formation: formationId })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="grid md:grid-cols-[1fr_20rem] gap-4">
      <div className="iz-panel">
        <div className="iz-panel-head">Buscar jugadores</div>
        <div className="iz-panel-body">
          <div className="flex flex-wrap gap-2 mb-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre, juego, equipo..." className="search-input flex-1 min-w-[10rem]" />
            <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="search-input w-auto">
              <option value="ALL">Todas</option>
              <option value="GK">GK</option>
              <option value="DF">DF</option>
              <option value="MF">MF</option>
              <option value="FW">FW</option>
            </select>
          </div>
          <div className="fd-options max-h-[70vh] overflow-y-auto">
            {filtered.map((card) => (
              <InaCard key={card.id} card={card} size="sm" onClick={filledCount < TOTAL_SLOTS ? () => addToFirstEmpty(card) : undefined} />
            ))}
            {filtered.length === 0 && <p className="text-sm text-iz-muted">Sin resultados.</p>}
          </div>
        </div>
      </div>

      <div className="iz-panel h-fit">
        <div className="iz-panel-head">Tu equipo ({filledCount}/{TOTAL_SLOTS})</div>
        <div className="iz-panel-body space-y-3">
          <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="search-input font-heading font-bold" />

          <select value={formationId} onChange={(e) => setFormationId(Number(e.target.value))} className="search-input">
            {formations.map((f) => (
              <option key={f.id} value={f.id}>Formacion {f.id} — Ataque {f.powerOffense}/5 · Defensa {f.powerDefense}/5</option>
            ))}
          </select>

          <div>
            <p className="sheet-label mb-1">Titulares</p>
            <div className="grid grid-cols-2 gap-1.5">
              {squad.slice(0, STARTER_SLOTS).map((card, slot) => (
                <SlotCell key={slot} slot={slot} card={card} isCaptain={captainSlot === slot} onRemove={() => removeFromSlot(slot)} onMakeCaptain={() => setCaptainSlot(slot)} />
              ))}
            </div>
          </div>

          <div>
            <p className="sheet-label mb-1">Suplentes</p>
            <div className="grid grid-cols-2 gap-1.5">
              {squad.slice(STARTER_SLOTS).map((card, i) => {
                const slot = STARTER_SLOTS + i
                return <SlotCell key={slot} slot={slot} card={card} isCaptain={captainSlot === slot} onRemove={() => removeFromSlot(slot)} onMakeCaptain={() => setCaptainSlot(slot)} />
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button type="button" className="sheet-cta" disabled={!canExport} onClick={handleExport}>
            Exportar a VictoryMods
          </button>
          {!canExport && <p className="text-[0.7rem] text-iz-muted">Completa los 11 titulares y marca un capitan.</p>}
        </div>
      </div>
    </div>
  )
}

function SlotCell({ slot, card, isCaptain, onRemove, onMakeCaptain }: { slot: number; card: Card | null; isCaptain: boolean; onRemove: () => void; onMakeCaptain: () => void }) {
  if (!card) {
    return <div className="fd-empty" style={{ position: 'static', width: '100%', aspectRatio: '3/1.4' }}><small>Hueco {slot + 1}</small></div>
  }
  return (
    <div className="sheet-choice">
      <div className="flex items-center justify-between gap-1">
        <b className="text-sm truncate">{card.name}</b>
        {isCaptain && <span title="Capitan">🎖️</span>}
      </div>
      <small className="truncate">{card.game} · {card.version || card.team}</small>
      <div className="flex gap-1 w-full mt-1">
        <button type="button" onClick={onMakeCaptain} className="btn-secondary text-[0.6rem] px-1.5 py-0.5 flex-1">Capitan</button>
        <button type="button" onClick={onRemove} className="btn-secondary text-[0.6rem] px-1.5 py-0.5">✕</button>
      </div>
    </div>
  )
}
