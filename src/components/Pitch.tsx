import type { FormationSlot, LineupMap, SlotId } from '../lib/lineup'
import type { Card } from '../types'
import InaCard from './InaCard'

interface Props {
  slots: FormationSlot[]
  lineup: LineupMap
  captain?: SlotId | null
  selected?: SlotId | null
  onTapPlaced?: (id: SlotId) => void
  onTapEmpty?: (id: SlotId) => void
  onLongPress?: (card: Card) => void
}

export const fieldY = (y: number) => (y >= 85 ? 92 : 6 + y * 0.9)

/** Campo con la formacion — copiado de ale-dm/inazuma-draft (rama app, Pitch.tsx), sin quimica. */
export default function Pitch({ slots, lineup, captain, selected, onTapPlaced, onTapEmpty, onLongPress }: Props) {
  return (
    <div className="fd-pitch">
      {slots.map((s) => {
        const card = lineup[s.id]
        return (
          <div key={s.id} className="fd-slot" style={{ left: `${s.x}%`, top: `${fieldY(s.y)}%` }}>
            {card ? (
              <span className={selected === s.id ? 'fd-selected' : undefined}>
                <InaCard
                  card={card}
                  size="xs"
                  onClick={onTapPlaced ? () => onTapPlaced(s.id) : undefined}
                  onLongPress={onLongPress ? () => onLongPress(card) : undefined}
                />
              </span>
            ) : (
              <button type="button" className="fd-empty" onClick={onTapEmpty ? () => onTapEmpty(s.id) : undefined}>
                +
              </button>
            )}
            <span className="slot-tag">
              {s.id === captain && <b>C</b>}
              {s.role}
            </span>
          </div>
        )
      })}
    </div>
  )
}
