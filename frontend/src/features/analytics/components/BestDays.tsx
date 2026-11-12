import { CalendarDays } from 'lucide-react'
import SectionCard from '../../../components/ui/SectionCard'
import { cn } from '../../../lib/cn'
import { formatNumber, weekdayAverages } from '../format'
import type { Day } from '../types'

/** Which days of the week bring the most visitors, to help decide when to post or restock. */
export default function BestDays({ days }: { days: Day[] }) {
  const averages = weekdayAverages(days.map((day) => ({ date: day.date, value: day.storeViews })))
  const top = Math.max(...averages.map((a) => a.average))
  const best = top > 0 ? averages.find((a) => a.average === top) : undefined

  return (
    <SectionCard
      Icon={CalendarDays}
      title="Best days of the week"
      description={best ? `${best.name}s bring the most visitors.` : 'Average store visits for each weekday.'}
      className="h-full"
    >
      <ul className="space-y-3.5">
        {averages.map((day) => (
          <li key={day.name} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-3 text-sm">
            <span className={cn('text-content-secondary', day === best && 'font-medium text-content')}>{day.name}</span>
            <span className="h-2 overflow-hidden rounded-full bg-surface-muted">
              <span
                className={cn('block h-full rounded-full', day === best ? 'bg-brand-ink' : 'bg-primary')}
                style={{ width: top > 0 ? `${(day.average / top) * 100}%` : '0%' }}
              />
            </span>
            <span className="text-right tabular-nums text-content">
              {formatNumber(Math.round(day.average * 10) / 10)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-content-secondary">Average store visits per day, over this period.</p>
    </SectionCard>
  )
}
