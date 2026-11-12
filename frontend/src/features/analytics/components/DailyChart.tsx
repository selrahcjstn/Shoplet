import { useState } from 'react'
import { cn } from '../../../lib/cn'
import { formatDay, niceCeil } from '../format'
import type { Day, Metric } from '../types'

interface DailyChartProps {
  days: Day[]
  metric: Metric
  /** "visits", "views" or "clicks". */
  unit: string
}

/** One bar per day. Hover or tap a bar to read that day; a hidden table carries the same data for screen readers. */
export default function DailyChart({ days, metric, unit }: DailyChartProps) {
  const [active, setActive] = useState<number | null>(null)

  const values = days.map((day) => day[metric])
  const total = values.reduce((sum, value) => sum + value, 0)
  const max = niceCeil(Math.max(...values, 0))
  const ticks = [max, max / 2, 0]
  const shown = active !== null ? days[active] : undefined

  return (
    <div>
      <p className="h-6 text-sm text-content-secondary" aria-hidden>
        {shown ? (
          <>
            <span className="font-medium text-content">{formatDay(shown.date)}</span>
            {' · '}
            {shown[metric].toLocaleString('en')} {unit}
          </>
        ) : (
          <>
            <span className="font-medium text-content">{total.toLocaleString('en')}</span> {unit} in total
          </>
        )}
      </p>

      <div className="mt-3 flex gap-3">
        <div aria-hidden className="flex h-56 flex-col justify-between text-xs text-content-muted">
          {ticks.map((tick) => (
            <span key={tick} className="-translate-y-1/2 last:translate-y-1/2 text-right tabular-nums">
              {Number.isInteger(tick) ? tick : tick.toFixed(1)}
            </span>
          ))}
        </div>

        <div className="relative h-56 flex-1" onMouseLeave={() => setActive(null)}>
          <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {ticks.map((tick) => (
              <span key={tick} className="border-t border-border" />
            ))}
          </div>
          <div aria-hidden className="absolute inset-0 flex items-end gap-px sm:gap-0.5">
            {days.map((day, index) => {
              const value = day[metric]
              return (
                <div
                  key={day.date}
                  className="flex h-full flex-1 items-end"
                  onMouseEnter={() => setActive(index)}
                  onClick={() => setActive(index)}
                >
                  <div
                    className={cn(
                      'w-full rounded-t-sm transition-colors duration-150',
                      value === 0 ? 'h-0.5 bg-border-strong' : active === index ? 'bg-brand-ink' : 'bg-primary',
                    )}
                    style={value > 0 ? { height: `${(value / max) * 100}%` } : undefined}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div aria-hidden className="mt-2 flex justify-between pl-9 text-xs text-content-muted">
        <span>{formatDay(days[0]!.date, 'short')}</span>
        <span>{formatDay(days[Math.floor(days.length / 2)]!.date, 'short')}</span>
        <span>{formatDay(days[days.length - 1]!.date, 'short')}</span>
      </div>

      <table className="sr-only">
        <caption>Daily {unit}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">{unit}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <th scope="row">{formatDay(day.date)}</th>
              <td>{day[metric]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
