import type { Card } from '../types'
import Sheet from './Sheet'
import InaCard from './InaCard'
import { ElementIcon } from './GameIcon'

interface Props {
  card: Card | null
  onClose: () => void
}

/** Ficha de una carta: se abre al mantener pulsada en el draft — info y sus tecnicas. */
export default function CardDetail({ card, onClose }: Props) {
  return (
    <Sheet open={!!card} title={card?.name ?? ''} onClose={onClose}>
      {card && (
        <>
          <div className="fd-options" style={{ marginBottom: '1rem' }}>
            <InaCard card={card} size="sm" />
          </div>

          <h3 className="sheet-label">Tecnicas</h3>
          {card.techniques.length === 0 ? (
            <p className="fd-hint">Sin tecnicas registradas</p>
          ) : (
            <ul className="card-info__techs">
              {card.techniques.map((t) => (
                <li key={t.slot}>
                  {t.element && <ElementIcon element={t.element} className="card-info__tech-icon" />}
                  <b title={t.name}>{t.name}</b>
                  {t.power != null && <small>Pot. {t.power.min}-{t.power.max}</small>}
                  {t.tp != null && <small>TP {t.tp}</small>}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Sheet>
  )
}
