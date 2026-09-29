import { useState } from 'react'
import type { Card } from '../types'
import { raritySlug } from '../lib/rarity'
import { PositionIcon, ElementIcon } from './GameIcon'

interface Props {
  card: Card
  size?: 'xs' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

/**
 * Carta de Inazuma copiada del diseño de ale-dm/inazuma-draft (rama app,
 * InaCard.tsx): distribución MADFUT/FC, esquinas cortadas, color por
 * rareza. Sin media ni números de duelo (aquí no se muestran stats) — solo
 * imagen, nombre, técnicas, posición, afinidad y juego/versión.
 */
export default function InaCard({ card, size = 'md', onClick }: Props) {
  const [failed, setFailed] = useState(false)
  const Tag = onClick ? 'button' : 'div'
  const small = size === 'xs'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`ic ic--${raritySlug(card.category)} ic--${size}`}
      aria-label={`${card.name} · ${card.position}`}
    >
      <span className="ic__glow" aria-hidden />
      {card.image && !failed ? (
        <img className="ic__photo" src={card.image} alt="" loading={small ? 'lazy' : 'eager'} onError={() => setFailed(true)} />
      ) : (
        <span className="ic__initials" aria-hidden>
          {card.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
        </span>
      )}
      <span className="ic__side">
        <PositionIcon position={card.position} className="ic__pos" />
        {card.element && <ElementIcon element={card.element} className="ic__el" />}
      </span>
      {!small && <span className="ic__chip">{card.game}</span>}
      <span className="ic__foot">
        <span className="ic__name">{small ? card.name.split(' ').slice(-1)[0] : card.name}</span>
        {!small && <span className="ic__team">{card.version || card.team || card.game}</span>}
      </span>
    </Tag>
  )
}
