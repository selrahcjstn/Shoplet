import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { compare } from '../format'

interface MetricCardProps {
  label: string
  value: number
  previous: number
  /** "previous 30 days", used in the comparison line. */
  periodLabel: string
  Icon: LucideIcon
  selected: boolean
  onSelect: () => void
}

/** A headline number. It is also the tab that picks what the chart below shows. */
export default function MetricCard({ label, value, previous, periodLabel, Icon, selected, onSelect }: MetricCardProps) {
  const change = compare(value, previous)
  const ChangeIcon = change.direction === 'up' ? ArrowUpRight : change.direction === 'down' ? ArrowDownRight : Minus

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onSelect}
      className={cn(
        'rounded-lg border bg-surface p-5 text-left transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        selected ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border-strong',
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-content-secondary">{label}</span>
        <span
          aria-hidden
          className={cn(
            'flex size-9 items-center justify-center rounded-lg',
            selected ? 'bg-primary text-content-inverse' : 'bg-primary-light text-primary',
          )}
        >
          <Icon className="size-5" />
        </span>
      </span>
      <span className="mt-2 block text-h2 font-bold leading-tight tracking-tight text-brand-ink">
        {value.toLocaleString('en')}
      </span>
      <span className="mt-2 flex items-center gap-1.5 text-sm text-content-secondary">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 font-medium',
            change.direction === 'up' && 'text-success',
            change.direction === 'down' && 'text-error',
          )}
        >
          <ChangeIcon aria-hidden className="size-4" />
          {change.label}
        </span>
        vs {periodLabel}
      </span>
    </button>
  )
}
