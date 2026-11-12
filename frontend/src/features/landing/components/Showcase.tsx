import type { CSSProperties } from 'react'
import { Check } from 'lucide-react'
import Container from '../../../components/layout/Container'
import Reveal from '../../../components/ui/Reveal'

/** Delay for one piece of an entrance (see .build in index.css). */
const at = (ms: number) => ({ '--d': `${ms}ms`, '--delay': `${ms}ms` }) as CSSProperties

const POINTS = [
  'Add, edit, hide or remove a product in a few taps',
  'See visits, product views and contact clicks for the last week, month or three months',
  'Know which products people open most, and which ones need a better photo',
]

/** A drawn picture of the seller dashboard, so visitors see what they get before signing up. */
function DashboardArt() {
  const bars = [34, 46, 30, 52, 44, 66, 58, 74, 62, 86, 78, 96]
  return (
    <svg viewBox="0 0 640 400" fill="none" aria-hidden className="w-full">
      <rect
        x="2"
        y="2"
        width="636"
        height="396"
        rx="16"
        fill="#FFFFFF"
        stroke="#D5DDD5"
        strokeWidth="2"
        className="build build-fade"
        style={at(0)}
      />
      {/* sidebar */}
      <g className="build build-slide-left" style={at(150)}>
        <path d="M18 2h130v396H18a16 16 0 0 1-16-16V18A16 16 0 0 1 18 2z" fill="#183B35" />
        <rect x="22" y="22" width="22" height="22" rx="6" fill="#176B5B" />
        <rect x="52" y="29" width="54" height="8" rx="4" fill="#FFFFFF" fillOpacity=".9" />
        {[78, 112, 146, 180].map((y, index) => (
          <g key={y}>
            <rect
              x="18"
              y={y}
              width="114"
              height="28"
              rx="8"
              fill={index === 0 ? '#FFFFFF' : 'none'}
              fillOpacity=".12"
            />
            <rect x="30" y={y + 8} width="12" height="12" rx="3" fill="#E8F2EC" fillOpacity={index === 0 ? 1 : 0.55} />
            <rect x="50" y={y + 11} width="52" height="6" rx="3" fill="#E8F2EC" fillOpacity={index === 0 ? 1 : 0.55} />
          </g>
        ))}
      </g>
      {/* welcome banner */}
      <g className="build build-rise" style={at(400)}>
        <rect x="166" y="22" width="452" height="76" rx="12" fill="#E8F2EC" />
        <rect x="184" y="40" width="130" height="12" rx="6" fill="#183B35" />
        <rect x="184" y="62" width="190" height="8" rx="4" fill="#183B35" fillOpacity=".35" />
        <rect x="184" y="78" width="72" height="12" rx="6" fill="#176B5B" />
        <circle cx="560" cy="60" r="36" fill="#E9A23B" fillOpacity=".3" />
        <path d="M530 92V70h60v22" fill="#124F45" />
        <path d="M526 70h68l-6-14h-56z" fill="#176B5B" />
      </g>
      {/* stat tiles */}
      {[166, 322, 478].map((x, index) => (
        <g key={x} className="build build-rise" style={at(600 + index * 130)}>
          <rect x={x} y="114" width="140" height="86" rx="10" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
          <rect x={x + 14} y="128" width="50" height="7" rx="3.5" fill="#183B35" fillOpacity=".4" />
          <rect x={x + 14} y="144" width="42" height="14" rx="4" fill="#183B35" />
          <rect x={x + 62} y="146" width="26" height="10" rx="5" fill="#E8F2EC" />
          <path
            d={`M${x + 14} 186l18-8 16 4 18-14 18 6 18-10 18 4`}
            stroke="#176B5B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={1 - index * 0.12}
          />
        </g>
      ))}
      {/* chart */}
      <g className="build build-rise" style={at(1000)}>
        <rect x="166" y="216" width="290" height="166" rx="10" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <rect x="182" y="230" width="92" height="9" rx="4.5" fill="#183B35" />
      </g>
      {bars.map((height, index) => (
        <rect
          key={index}
          x={186 + index * 22}
          y={366 - height}
          width="14"
          height={height}
          rx="3"
          fill={index === 11 ? '#183B35' : '#176B5B'}
          className="build build-grow"
          style={at(1250 + index * 60)}
        />
      ))}
      {/* product list */}
      <g className="build build-rise" style={at(1150)}>
        <rect x="472" y="216" width="146" height="166" rx="10" fill="#FFFFFF" stroke="#D5DDD5" strokeWidth="2" />
        <rect x="486" y="230" width="70" height="9" rx="4.5" fill="#183B35" />
        {[0, 1, 2].map((row) => (
          <g key={row}>
            <rect x="486" y={256 + row * 40} width="30" height="30" rx="8" fill="#E8F2EC" />
            <rect x="524" y={262 + row * 40} width="64" height="7" rx="3.5" fill="#183B35" fillOpacity=".75" />
            <rect x="524" y={276 + row * 40} width="38" height="6" rx="3" fill="#176B5B" />
          </g>
        ))}
      </g>
    </svg>
  )
}

export default function Showcase() {
  return (
    <section className="border-b border-border">
      <Reveal>
        <Container className="grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <div>
            <h2 className="rise text-h3 font-semibold tracking-tight text-brand-ink md:text-h2">
              One dashboard for the whole shop
            </h2>
            <p className="mt-4 max-w-lg text-lg text-content-secondary">
              Everything you manage sits in one place, built to be quick on a phone between customers.
            </p>
            <ul className="mt-8 space-y-4">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-content-secondary">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary"
                  >
                    <Check className="size-4" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <DashboardArt />
        </Container>
      </Reveal>
    </section>
  )
}
