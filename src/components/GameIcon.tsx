import type { Element, Position } from '../types'

// Iconos copiados de ale-dm/inazuma-draft (rama app, public/icons/).
const BASE = `${import.meta.env.BASE_URL}icons/`

const POSITION: Record<Position, string> = { GK: 'pos-gk', DF: 'pos-df', MF: 'pos-mf', FW: 'pos-fw' }
const ELEMENT: Record<Element, string> = { fire: 'el-fire', air: 'el-air', wood: 'el-wood', earth: 'el-earth' }

function Icon({ file, alt, className = '' }: { file: string; alt: string; className?: string }) {
  return <img src={`${BASE}${file}.png`} alt={alt} title={alt} className={`game-icon ${className}`} draggable={false} />
}

export function PositionIcon({ position, className }: { position: Position; className?: string }) {
  return <Icon file={POSITION[position]} alt={position} className={className} />
}

export function ElementIcon({ element, className }: { element: Element; className?: string }) {
  return <Icon file={ELEMENT[element]} alt={element} className={className} />
}
