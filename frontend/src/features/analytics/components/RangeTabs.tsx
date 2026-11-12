import { cn } from '../../../lib/cn'

const RANGES = [7, 30, 90]

interface RangeTabsProps {
  value: number
  onChange: (days: number) => void
}

/** Segmented control for the length of the period. */
export default function RangeTabs({ value, onChange }: RangeTabsProps) {
  return (
    <div
      role="group"
      aria-label="Time period"
      className="inline-flex rounded-lg border border-border-strong bg-surface p-1"
    >
      {RANGES.map((days) => (
        <button
          key={days}
          type="button"
          aria-pressed={value === days}
          onClick={() => onChange(days)}
          className={cn(
            'rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors duration-150',
            value === days ? 'bg-brand-ink text-content-inverse' : 'text-content-secondary hover:bg-surface-muted',
          )}
        >
          {days} days
        </button>
      ))}
    </div>
  )
}
