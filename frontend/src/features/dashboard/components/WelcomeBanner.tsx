import type { ReactNode } from 'react'
import heroStall from '../../../assets/hero-stall.svg'

interface WelcomeBannerProps {
  greeting: string
  name: string
  summary: string
  actions: ReactNode
}

/** The one big moment on the Overview: greeting, a one-line status and the next actions. */
export default function WelcomeBanner({ greeting, name, summary, actions }: WelcomeBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary-light px-6 py-8 md:px-10 md:py-10">
      <div className="relative z-10 max-w-lg">
        <h1 className="text-h3 font-bold tracking-tight text-brand-ink md:text-h2">
          {greeting}, {name}
        </h1>
        <p className="mt-2 text-lg text-content-secondary">{summary}</p>
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
