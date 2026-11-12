import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'

interface HeroStallProps {
  className?: string
  /** Plays the build-up: posts grow, the counter rises, the awning drops in, goods pop onto the shelves. */
  animate?: boolean
}

/** Delay for one piece of the build-up, read by the .build classes in index.css. */
const at = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

const STRIPES = [60, 115, 170, 225, 280, 335, 390, 445]

/** The market stall, drawn inline so each part can animate on its own. The same picture as assets/hero-stall.svg. */
export default function HeroStall({ className, animate = false }: HeroStallProps) {
  const part = (kind: string) => (animate ? cn('build', kind) : undefined)

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 440" fill="none" aria-hidden className={className}>
      <ellipse
        cx="280"
        cy="410"
        rx="236"
        ry="14"
        fill="#183B35"
        fillOpacity=".08"
        className={part('build-fade')}
        style={at(0)}
      />

      {/* posts grow up from the ground */}
      <rect
        x="72"
        y="110"
        width="10"
        height="300"
        rx="3"
        fill="#183B35"
        className={part('build-grow')}
        style={at(150)}
      />
      <rect
        x="478"
        y="110"
        width="10"
        height="300"
        rx="3"
        fill="#183B35"
        className={part('build-grow')}
        style={at(250)}
      />

      {/* counter */}
      <g className={part('build-rise')} style={at(600)}>
        <rect x="88" y="300" width="384" height="110" rx="6" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <rect x="88" y="290" width="384" height="22" rx="5" fill="#F1F3EE" stroke="#D5DDD5" strokeWidth="2" />
        <path d="M120 330h320M120 356h320M120 382h320" stroke="#D5DDD5" strokeWidth="2" />
      </g>

      {/* back shelf slides in */}
      <rect
        x="96"
        y="214"
        width="368"
        height="8"
        rx="2"
        fill="#183B35"
        className={part('build-wipe')}
        style={at(850)}
      />

      {/* awning drops in, stripe by stripe */}
      <path d="M50 56h460l-16-34H66z" fill="#124F45" className={part('build-drop')} style={at(950)} />
      {STRIPES.map((x, index) => (
        <path
          key={x}
          d={`M${x}.0 56h55.0v62a27.50 27.50 0 0 1 -55.0 0z`}
          fill={index % 2 === 0 ? '#176B5B' : '#F1F3EE'}
          className={part('build-drop')}
          style={at(1020 + index * 70)}
        />
      ))}

      {/* goods pop onto the shelf and counter */}
      <g className={part('build-pop')} style={at(1650)}>
        <rect x="116" y="170" width="34" height="44" rx="5" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <rect x="120" y="186" width="26" height="24" rx="3" fill="#E9A23B" />
      </g>
      <g className={part('build-pop')} style={at(1730)}>
        <rect x="158" y="180" width="30" height="34" rx="5" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <rect x="162" y="194" width="22" height="16" rx="3" fill="#B94A45" fillOpacity=".85" />
      </g>
      <g className={part('build-pop')} style={at(1810)}>
        <rect x="396" y="176" width="32" height="38" rx="5" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <rect x="400" y="190" width="24" height="20" rx="3" fill="#237A50" fillOpacity=".8" />
      </g>
      <g className={part('build-pop')} style={at(1890)}>
        <rect x="436" y="190" width="18" height="24" rx="4" fill="#176B5B" />
      </g>

      <g className={part('build-pop')} style={at(1950)}>
        <path d="M120 290l8-46h64l8 46z" fill="#E9A23B" fillOpacity=".9" />
        <path d="M130 266h54M126 280h62" stroke="#FFF2D9" strokeWidth="3" />
        <circle cx="146" cy="236" r="11" fill="#B94A45" />
        <circle cx="168" cy="232" r="11" fill="#E9A23B" />
        <circle cx="186" cy="238" r="9" fill="#237A50" />
      </g>
      <g className={part('build-pop')} style={at(2030)}>
        <rect x="262" y="246" width="56" height="44" rx="4" fill="#E8F2EC" stroke="#176B5B" strokeWidth="2" />
        <path d="M276 246c0-16 28-16 28 0" stroke="#183B35" strokeWidth="3" fill="none" />
      </g>
      <g className={part('build-pop')} style={at(2110)}>
        <rect x="326" y="256" width="48" height="34" rx="4" fill="#FFF2D9" stroke="#E9A23B" strokeWidth="2" />
        <path d="M338 256c0-12 24-12 24 0" stroke="#183B35" strokeWidth="3" fill="none" />
      </g>
      <g className={part('build-pop')} style={at(2190)}>
        <path d="M410 290l-6-34h40l-6 34z" fill="#B94A45" />
        <path
          d="M424 256c-18-8-22-30-14-42 12 6 18 24 14 42zM424 256c14-10 30-12 38-24-14-4-34 8-38 24zM424 256c-2-18 6-38 20-44 4 16-4 36-20 44z"
          fill="#237A50"
        />
      </g>

      {/* the sign swings into place last */}
      <g className={part('build-swing')} style={{ ...at(2350), transformOrigin: '50% 0' }}>
        <path d="M236 118v22M324 118v22" stroke="#183B35" strokeWidth="2" />
        <rect x="216" y="140" width="128" height="44" rx="6" fill="#FFF2D9" stroke="#E9A23B" strokeWidth="2" />
        <text
          x="280"
          y="169"
          textAnchor="middle"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="700"
          fontSize="20"
          fill="#183B35"
          letterSpacing="1"
        >
          Open today
        </text>
      </g>
    </svg>
  )
}
