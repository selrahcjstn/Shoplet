import type { CSSProperties } from 'react'
import Container from '../../../components/layout/Container'
import Reveal from '../../../components/ui/Reveal'

/** Delay for one piece of an entrance (see .build in index.css). */
const at = (ms: number) => ({ '--d': `${ms}ms`, '--delay': `${ms}ms` }) as CSSProperties

const CHANNELS = ['Messenger', 'WhatsApp', 'Instagram', 'Phone', 'Email']

/** A phone showing a shop page, with the chat a customer would start from it. */
function PhoneArt() {
  const tiles = [
    { x: 150, y: 150, fill: '#176B5B' },
    { x: 226, y: 150, fill: '#E9A23B' },
    { x: 150, y: 226, fill: '#B94A45' },
    { x: 226, y: 226, fill: '#237A50' },
  ]
  return (
    <svg viewBox="0 0 440 460" fill="none" aria-hidden className="mx-auto w-full max-w-md">
      <circle cx="220" cy="230" r="196" fill="#176B5B" fillOpacity=".22" className="build build-scale" style={at(0)} />
      <g className="build build-rise" style={at(250)}>
        <rect
          x="128"
          y="24"
          width="184"
          height="404"
          rx="28"
          fill="#0F2A26"
          stroke="#E8F2EC"
          strokeOpacity=".35"
          strokeWidth="3"
        />
        <rect x="140" y="42" width="160" height="368" rx="16" fill="#FFFFFF" />
        {/* shop header */}
        <rect x="140" y="42" width="160" height="62" rx="16" fill="#176B5B" />
        <rect x="140" y="80" width="160" height="24" fill="#176B5B" />
        <rect x="152" y="86" width="32" height="32" rx="9" fill="#E8F2EC" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="192" y="112" width="70" height="8" rx="4" fill="#183B35" />
        <rect x="192" y="126" width="46" height="6" rx="3" fill="#183B35" fillOpacity=".4" />
        {tiles.map((tile) => (
          <g key={`${tile.x}-${tile.y}`}>
            <rect x={tile.x} y={tile.y} width="68" height="68" rx="9" fill="#F1F3EE" />
            <circle cx={tile.x + 34} cy={tile.y + 28} r="12" fill={tile.fill} />
            <rect x={tile.x + 10} y={tile.y + 50} width="30" height="5" rx="2.5" fill="#183B35" fillOpacity=".7" />
            <rect x={tile.x + 10} y={tile.y + 59} width="20" height="4" rx="2" fill="#176B5B" />
          </g>
        ))}
        <rect x="152" y="318" width="136" height="28" rx="14" fill="#176B5B" />
        <rect x="190" y="329" width="60" height="6" rx="3" fill="#FFFFFF" fillOpacity=".9" />
        <rect x="152" y="356" width="136" height="28" rx="14" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <rect x="196" y="367" width="48" height="6" rx="3" fill="#183B35" fillOpacity=".5" />
      </g>
      {/* the chat a customer starts */}
      <g className="build build-pop" style={at(900)}>
        <rect x="14" y="96" width="132" height="44" rx="16" fill="#FFFFFF" />
        <path d="M122 140l14 12v-12z" fill="#FFFFFF" />
        <text x="26" y="116" fontFamily="Inter, system-ui, sans-serif" fontSize="12" fontWeight="600" fill="#183B35">
          Is the mug still
        </text>
        <text x="26" y="131" fontFamily="Inter, system-ui, sans-serif" fontSize="12" fontWeight="600" fill="#183B35">
          available?
        </text>
      </g>
      <g className="build build-pop" style={at(1300)}>
        <rect x="302" y="276" width="124" height="44" rx="16" fill="#E9A23B" />
        <path d="M322 320l-14 12v-12z" fill="#E9A23B" />
        <text x="314" y="296" fontFamily="Inter, system-ui, sans-serif" fontSize="12" fontWeight="600" fill="#183B35">
          Yes! Sending you
        </text>
        <text x="314" y="311" fontFamily="Inter, system-ui, sans-serif" fontSize="12" fontWeight="600" fill="#183B35">
          the details.
        </text>
      </g>
    </svg>
  )
}

export default function ShareSection() {
  return (
    <section className="overflow-hidden bg-brand-ink text-primary-light">
      <Reveal>
        <Container className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
          <PhoneArt />
          <div>
            <h2 className="rise text-h3 font-semibold tracking-tight text-white md:text-h2">
              Customers message you where you already chat
            </h2>
            <p className="mt-4 max-w-lg text-lg text-primary-light/80">
              No checkout to set up. Each product has contact buttons, so a customer can ask a question or place an
              order in the app they use every day. You agree on payment and delivery yourself.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {CHANNELS.map((channel) => (
                <li
                  key={channel}
                  className="rounded-full border border-primary-light/25 px-4 py-1.5 text-sm font-medium text-primary-light"
                >
                  {channel}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Reveal>
    </section>
  )
}
