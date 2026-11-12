import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface SectionCardProps {
  title: string
  description?: string
  Icon?: LucideIcon
  /** Content aligned to the right of the header, such as a badge. */
  aside?: ReactNode
  children: ReactNode
  className?: string
}

/** A card with a consistent header: icon chip, title, optional description. */
export default function SectionCard({ title, description, Icon, aside, children, className }: SectionCardProps) {
  return (
    <section className={cn('rounded-lg border border-border bg-surface', className)}>
      <header className="flex items-start gap-3 px-6 pt-6">
        {Icon && (
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary"
          >
            <Icon className="size-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-h4 font-semibold tracking-tight text-brand-ink">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-content-secondary">{description}</p>}
        </div>
        {aside}
      </header>
      <div className="px-6 pb-6 pt-5">{children}</div>
    </section>
  )
}
