import { useEffect, useState } from 'react'
import type { Card } from './types'
import { loadCatalog } from './lib/catalog'
import SquadBuilder from './components/SquadBuilder'
import FutDraft from './components/FutDraft'

type Mode = 'draft' | 'builder' | 'presets'

export default function App() {
  const [catalog, setCatalog] = useState<Card[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>('draft')

  useEffect(() => {
    loadCatalog()
      .then(setCatalog)
      .catch((e) => setLoadError(e instanceof Error ? e.message : String(e)))
  }, [])

  return (
    <div className="hub" style={{ position: 'static', minHeight: '100vh' }}>
      <header className="hub-top safe-top">
        <div className="hub-top__row">
          <span className="hub-logo">IE Ultimate Team — Futdraft</span>
        </div>
        <div className="hub-bar">
          <button className={`hub-icon-btn ${mode === 'draft' ? '' : ''}`} style={{ width: 'auto', padding: '0 .9rem', borderRadius: 12 }} onClick={() => setMode('draft')}>Draft normal</button>
          <button className="hub-icon-btn" style={{ width: 'auto', padding: '0 .9rem', borderRadius: 12 }} onClick={() => setMode('builder')}>Creador de equipo</button>
          <button className="hub-icon-btn" style={{ width: 'auto', padding: '0 .9rem', borderRadius: 12 }} onClick={() => setMode('presets')}>Presets</button>
        </div>
      </header>

      <main className="fd-main">
        {loadError && <p className="text-red-400">Error cargando el catalogo: {loadError}</p>}
        {!catalog && !loadError && <p className="text-iz-muted">Cargando catalogo...</p>}
        {catalog && mode === 'draft' && <FutDraft catalog={catalog} />}
        {catalog && mode === 'builder' && <SquadBuilder catalog={catalog} />}
        {catalog && mode === 'presets' && (
          <div className="iz-panel">
            <div className="iz-panel-head">Presets</div>
            <div className="iz-panel-body">
              <p className="text-sm text-iz-muted">Proximamente: plantillas predefinidas listas para exportar en un click.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
