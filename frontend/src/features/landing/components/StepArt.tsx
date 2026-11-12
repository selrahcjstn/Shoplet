import type { CSSProperties } from 'react'

/** Delay for one piece of an entrance (see .build in index.css). */
const at = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** Small flat illustrations for the three "how it works" steps. Decorative, so hidden from screen readers. */

const frame = 'w-full rounded-xl bg-primary-light'

export function SignUpArt() {
  return (
    <svg viewBox="0 0 280 170" fill="none" aria-hidden className={frame}>
      <g className="build build-rise" style={at(0)}>
        <rect x="62" y="22" width="156" height="126" rx="12" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <circle cx="140" cy="52" r="15" fill="#176B5B" />
        <path d="M132 52l5 5 9-10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="82" y="78" width="116" height="12" rx="6" fill="#F1F3EE" />
        <rect x="82" y="98" width="116" height="12" rx="6" fill="#F1F3EE" />
        <rect x="82" y="118" width="116" height="18" rx="9" fill="#176B5B" />
        <rect x="112" y="124" width="56" height="6" rx="3" fill="#FFFFFF" fillOpacity=".85" />
      </g>
      <circle cx="40" cy="40" r="8" fill="#E9A23B" className="build build-pop" style={at(500)} />
      <circle cx="244" cy="126" r="12" fill="#183B35" fillOpacity=".12" className="build build-pop" style={at(650)} />
    </svg>
  )
}

export function ProductsArt() {
  const tiles = [
    { x: 50, y: 24, fill: '#176B5B' },
    { x: 146, y: 24, fill: '#E9A23B' },
    { x: 50, y: 92, fill: '#B94A45' },
    { x: 146, y: 92, fill: '#237A50' },
  ]
  return (
    <svg viewBox="0 0 280 170" fill="none" aria-hidden className={frame}>
      {tiles.map((tile, index) => (
        <g key={`${tile.x}-${tile.y}`} className="build build-pop" style={at(index * 140)}>
          <rect x={tile.x} y={tile.y} width="84" height="60" rx="10" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
          <rect x={tile.x + 8} y={tile.y + 8} width="68" height="30" rx="6" fill="#F1F3EE" />
          <circle cx={tile.x + 42} cy={tile.y + 23} r="9" fill={tile.fill} />
          <rect x={tile.x + 8} y={tile.y + 44} width="34" height="6" rx="3" fill="#183B35" fillOpacity=".7" />
          <rect x={tile.x + 50} y={tile.y + 44} width="26" height="6" rx="3" fill="#176B5B" />
        </g>
      ))}
      <g className="build build-pop" style={at(620)}>
        <rect x="226" y="20" width="40" height="18" rx="9" fill="#FFF2D9" stroke="#E9A23B" strokeWidth="2" />
        <rect x="234" y="27" width="24" height="4" rx="2" fill="#183B35" />
      </g>
    </svg>
  )
}

export function ShareArt() {
  return (
    <svg viewBox="0 0 280 170" fill="none" aria-hidden className={frame}>
      <g className="build build-rise" style={at(0)}>
        <rect x="104" y="14" width="72" height="142" rx="12" fill="#183B35" />
        <rect x="110" y="26" width="60" height="118" rx="6" fill="#FFFFFF" />
        <rect x="110" y="26" width="60" height="26" rx="6" fill="#176B5B" />
        <rect x="116" y="60" width="22" height="22" rx="4" fill="#E8F2EC" />
        <rect x="142" y="60" width="22" height="22" rx="4" fill="#FFF2D9" />
        <rect x="116" y="88" width="22" height="22" rx="4" fill="#FFF2D9" />
        <rect x="142" y="88" width="22" height="22" rx="4" fill="#E8F2EC" />
        <rect x="116" y="120" width="48" height="14" rx="7" fill="#176B5B" />
      </g>
      <g className="build build-pop" style={at(500)}>
        <rect x="22" y="38" width="64" height="26" rx="13" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <rect x="34" y="48" width="40" height="6" rx="3" fill="#176B5B" />
        <path d="M86 56l14 8" stroke="#176B5B" strokeWidth="2" strokeDasharray="3 4" />
      </g>
      <g className="build build-pop" style={at(750)}>
        <rect x="194" y="92" width="64" height="26" rx="13" fill="#E9A23B" />
        <rect x="206" y="102" width="40" height="6" rx="3" fill="#183B35" fillOpacity=".8" />
        <path d="M194 108l-14-4" stroke="#E9A23B" strokeWidth="2" strokeDasharray="3 4" />
      </g>
    </svg>
  )
}
