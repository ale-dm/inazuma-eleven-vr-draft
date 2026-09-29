import { useMemo, useState } from 'react'
import type { Card, Category, GameId } from '../types'
import { FORMATIONS, realFormationId, type FormationId } from '../lib/lineup'
import { generatePreset, presetAvailability, type PresetResult } from '../lib/presets'
import { GAME_LABEL } from '../data/games'
import { RARITY_ORDER, rarityLabel } from '../lib/rarity'
import { exportAndDownload } from '../lib/exportVictoryMods'
import Pitch from './Pitch'
import InaCard from './InaCard'
import CardDetail from './CardDetail'

interface Props {
  catalog: Card[]
}

/** Presets por saga: genera un equipo completo de un solo juego (IE1, GO2, VR...), con rareza minima y formacion a elegir. */
export default function Presets({ catalog }: Props) {
  const [game, setGame] = useState<GameId | null>(null)
  const [minRarity, setMinRarity] = useState<Category>('Common Player')
  const [formationId, setFormationId] = useState<FormationId>('basic')
  const [teamName, setTeamName] = useState('Mi Equipo')
  const [result, setResult] = useState<PresetResult | null>(null)
  const [genError, setGenError] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)
  const [inspecting, setInspecting] = useState<Card | null>(null)

  const games = useMemo(() => {
    const present = new Set(catalog.map((c) => c.game))
    return (Object.keys(GAME_LABEL) as GameId[]).filter((g) => present.has(g))
  }, [catalog])

  const availability = useMemo(() => (game ? presetAvailability(catalog, game, minRarity) : null), [catalog, game, minRarity])

  function generate() {
    if (!game) return
    setGenError(null)
    setExportError(null)
    const r = generatePreset(catalog, { game, minRarity, formation: formationId })
    if ('error' in r) { setGenError(r.error); setResult(null); return }
    setResult(r)
  }

  function handleExport() {
    if (!result) return
    setExportError(null)
    const slots = [
      ...Object.entries(result.lineup).map(([, card], i) => ({ slot: i, card: card! })),
      ...result.bench.filter((c): c is Card => !!c).map((card, i) => ({ slot: 11 + i, card })),
    ]
    const captainSlot = Object.keys(result.lineup).indexOf(result.captain)
    try {
      exportAndDownload({
        name: teamName.trim() || 'Mi Equipo',
        slots,
        captainSlot: captainSlot >= 0 ? captainSlot : 0,
        formation: realFormationId(formationId),
      })
    } catch (e) {
      setExportError(e instanceof Error ? e.message : String(e))
    }
  }

  if (!game) {
    return (
      <section className="fd-step">
        <h2 className="fd-title">Elige saga</h2>
        <div className="fd-formations">
          {games.map((g) => (
            <button key={g} type="button" className="tile fd-formation" onClick={() => setGame(g)}>
              <span className="tile__label">{g}</span>
              <small>{GAME_LABEL[g]}</small>
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="fd-step">
      <h2 className="fd-title">{GAME_LABEL[game]}</h2>

      <div className="iz-panel">
        <div className="iz-panel-head">Parametros</div>
        <div className="iz-panel-body space-y-3">
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

          <div>
            <p className="sheet-label mb-1">Formacion</p>
            <div className="chip-row">
              {FORMATIONS.map((f) => (
                <button key={f.id} type="button" className={`chip ${formationId === f.id ? 'on' : ''}`} onClick={() => setFormationId(f.id)}>
                  {f.name} · {f.layout}
                </button>
              ))}
            </div>
          </div>

          {availability && (
            <p className="fd-hint" style={{ minHeight: 'auto' }}>
              Disponibles en {GAME_LABEL[game]} con esa rareza: {availability.GK} PT · {availability.DF} DF · {availability.MF} MF · {availability.FW} DL
            </p>
          )}

          {genError && <p className="text-sm text-red-400">{genError}</p>}

          <div className="flex gap-2">
            <button type="button" className="btn-secondary text-sm px-3 py-1.5" onClick={() => { setGame(null); setResult(null) }}>
              Cambiar saga
            </button>
            <button type="button" className="sheet-cta fd-cta" style={{ flex: 1 }} onClick={generate}>
              {result ? 'Generar otra vez' : 'Generar equipo'}
            </button>
          </div>
        </div>
      </div>

      {result && (
        <>
          <Pitch
            slots={FORMATIONS.find((f) => f.id === formationId)!.slots}
            lineup={result.lineup}
            captain={result.captain}
            onLongPress={(c) => setInspecting(c)}
          />

          <h3 className="sheet-label">Banquillo</h3>
          <div className="fd-bench">
            {result.bench.map((c, i) => (
              <div key={i} className="fd-bench__spot">
                {c ? <InaCard card={c} size="xs" onLongPress={() => setInspecting(c)} /> : <div className="fd-empty" style={{ animation: 'none', opacity: 0.4 }}><small>Vacio</small></div>}
              </div>
            ))}
          </div>

          <div className="iz-panel">
            <div className="iz-panel-head">Exportar</div>
            <div className="iz-panel-body space-y-3">
              <input value={teamName} onChange={(e) => setTeamName(e.target.value)} className="search-input" placeholder="Nombre del equipo" />
              {exportError && <p className="text-sm text-red-400">{exportError}</p>}
              <button type="button" className="sheet-cta fd-cta" onClick={handleExport}>
                Exportar a VictoryMods
              </button>
            </div>
          </div>
        </>
      )}

      <CardDetail card={inspecting} onClose={() => setInspecting(null)} />
    </section>
  )
}
