import { Check, Eye } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import productMug from '../../../assets/product-mug.svg'
import HeroStall from '../../../components/illustrations/HeroStall'
import Logo from '../../../components/layout/Logo'
import Sparkline from '../../analytics/components/Sparkline'

interface AuthShellProps {
  title: string
  description: string
  /** Heading and text shown on the illustrated side panel (desktop). */
  panelTitle: string
  panelText: string
  children: ReactNode
  footer: ReactNode
}

/** Delay for one step of the panel's entrance (see .build in index.css). */
const at = (ms: number) => ({ '--d': `${ms}ms`, '--delay': `${ms}ms` }) as CSSProperties

// Sample numbers for the decorative stats card. They are not real data.
const SAMPLE_TREND = [4, 6, 5, 8, 7, 11, 9, 13, 12, 16, 15, 19]

const POINTS = ['Your own shop link', 'Products with photos and prices', 'Visits and contact clicks at a glance']

/** Two-column frame: the form on the left, a dark panel on the right showing what the dashboard gives you. */
export default function AuthShell({ title, description, panelTitle, panelText, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-8 lg:px-12">
        <Logo />
        <main className="flex flex-1 items-center py-10">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-h3 font-semibold tracking-tight text-brand-ink">{title}</h1>
            <p className="mt-2 text-content-secondary">{description}</p>
            <div className="mt-8">{children}</div>
            <p className="mt-8 text-sm text-content-secondary">{footer}</p>
          </div>
        </main>
      </div>

      <aside
        className="relative hidden flex-col justify-between overflow-hidden bg-brand-ink p-12 text-primary-light lg:flex"
        aria-hidden
      >
        {/* Flat shapes and a dot texture, kept behind everything else */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)',
            backgroundSize: '26px 26px',
          }}
        />
        <div
          className="build build-scale pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/40"
          style={at(0)}
        />
        <div
          className="build build-scale pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-primary-dark"
          style={at(150)}
        />
        <div
          className="build build-pop pointer-events-none absolute right-16 top-[46%] size-5 rounded-full bg-accent"
          style={at(2600)}
        />

        <div className="rise relative max-w-md" style={at(100)}>
          <h2 className="text-h2 font-semibold tracking-tight text-white">{panelTitle}</h2>
          <p className="mt-3 text-lg text-primary-light/75">{panelText}</p>
        </div>

        {/* The stall in an arched window, with two small cards from the dashboard floating over it */}
        <div className="relative mx-auto my-8 w-full max-w-md">
          <div
            className="build build-rise overflow-hidden rounded-t-[12rem] bg-primary-light px-10 pt-14"
            style={at(0)}
          >
            <HeroStall animate className="w-full translate-y-1" />
          </div>

          <div
            className="build build-slide-left absolute -left-10 bottom-10 flex w-52 items-center gap-3 rounded-xl bg-surface p-3 shadow-lg"
            style={at(2500)}
          >
            <img src={productMug} alt="" className="size-14 shrink-0 rounded-lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-content">Stoneware mug</p>
              <p className="text-sm font-semibold text-primary-dark">₱520.00</p>
              <p className="flex items-center gap-1 text-xs font-medium text-success">
                <Check className="size-3.5" />
                Available
              </p>
            </div>
          </div>

          <div
            className="build build-slide-right absolute -right-8 top-20 w-48 rounded-xl bg-surface p-3 shadow-lg"
            style={at(2750)}
          >
            <p className="flex items-center gap-1.5 text-xs text-content-secondary">
              <Eye className="size-3.5" />
              Visits this month
            </p>
            <p className="mt-0.5 flex items-baseline gap-2">
              <span className="text-h4 font-bold text-brand-ink">503</span>
              <span className="text-xs font-medium text-success">+33%</span>
            </p>
            <Sparkline values={SAMPLE_TREND} className="mt-1 h-8 w-full" />
          </div>
        </div>

        <ul className="relative flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-light/80">
          {POINTS.map((point, index) => (
            <li key={point} className="rise flex items-center gap-2" style={at(2900 + index * 120)}>
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
                <Check className="size-3" />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
