import type { ReactNode } from 'react'
import heroStall from '../../../assets/hero-stall.svg'

interface WelcomeBannerProps {
  greeting: string
  name: string
  summary: string
  actions: ReactNode
  /** Short live facts shown as pills, such as "12 visits today". */
  highlights?: string[]
}

/** The one big moment on the Overview: greeting, a one-line status and the next actions. */
export default function WelcomeBanner({ greeting, name, summary, actions, highlights = [] }: WelcomeBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary-light px-6 py-8 md:px-10 md:py-10">
      {/* Soft flat shapes behind the illustration give the banner depth without decoration on top of text */}
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/10" />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-48 hidden size-56 rounded-full bg-accent/25 lg:block"
      />
      <div className="relative z-10 max-w-lg">
        <h1 className="text-h3 font-bold tracking-tight text-brand-ink md:text-h2">
          {greeting}, {name}
        </h1>
        <p className="mt-2 text-lg text-content-secondary">{summary}</p>
        {highlights.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {highlights.map((text) => (
              <li
                key={text}
                className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1 text-sm font-medium text-brand-ink"
              >
                <span aria-hidden className="size-2 rounded-full bg-primary" />
                {text}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
      </div>
      <img
        src={heroStall}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-4 hidden w-72 md:block lg:right-10 lg:w-80"
      />
    </section>
  )
}
