import type { ReactNode } from 'react'
import heroStall from '../../../assets/hero-stall.svg'
import Logo from '../../../components/layout/Logo'

interface AuthShellProps {
  title: string
  description: string
  /** Heading and text shown on the illustrated side panel (desktop). */
  panelTitle: string
  panelText: string
  children: ReactNode
  footer: ReactNode
}

/** Two-column frame: form on the left, illustrated panel on the right. */
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

      <aside className="hidden flex-col justify-between bg-primary-light p-12 lg:flex" aria-hidden>
        <div className="max-w-md">
          <h2 className="text-h2 font-semibold tracking-tight text-brand-ink">{panelTitle}</h2>
          <p className="mt-3 text-lg text-content-secondary">{panelText}</p>
        </div>
        <img src={heroStall} alt="" className="mx-auto w-full max-w-md" />
      </aside>
    </div>
  )
}
