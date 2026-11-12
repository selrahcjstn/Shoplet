import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  Minus,
  MousePointerClick,
  Store,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard from '../../../components/ui/SectionCard'
import { cn } from '../../../lib/cn'
import Sparkline from '../../analytics/components/Sparkline'
import { compare } from '../../analytics/format'
import type { Analytics, Metric } from '../../analytics/types'

const METRICS: { key: Metric; label: string; Icon: LucideIcon }[] = [
  { key: 'storeViews', label: 'Store visits', Icon: Store },
  { key: 'productViews', label: 'Product views', Icon: Eye },
  { key: 'contactClicks', label: 'Contact clicks', Icon: MousePointerClick },
]

/** The last 30 days at a glance: three numbers, each with its trend and how it compares with before. */
export default function PerformanceCard({ analytics }: { analytics: Analytics }) {
  const { totals, previous, daily, range } = analytics

  return (
    <SectionCard
      Icon={TrendingUp}
      title="How your shop is doing"
      description={`Last ${range.days} days, compared with the ${range.days} before.`}
      aside={
        <Link
          to="/dashboard/analytics"
          className="shrink-0 rounded-md px-2 py-1 text-sm font-medium text-primary hover:bg-primary-light"
        >
          See analytics
        </Link>
      }
    >
      <dl className="grid gap-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
        {METRICS.map(({ key, label, Icon }, index) => {
          const change = compare(totals[key], previous[key])
          const ChangeIcon =
            change.direction === 'up' ? ArrowUpRight : change.direction === 'down' ? ArrowDownRight : Minus
          return (
            <div key={key} className={cn('min-w-0', index > 0 && 'sm:pl-6', index < 2 && 'sm:pr-6')}>
              <dt className="flex items-center gap-2 text-sm text-content-secondary">
                <Icon aria-hidden className="size-4" />
                {label}
              </dt>
              <dd className="mt-1 flex items-baseline gap-2">
                <span className="text-h2 font-bold leading-tight tracking-tight text-brand-ink">
                  {totals[key].toLocaleString('en')}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center text-sm font-medium text-content-secondary',
                    change.direction === 'up' && 'text-success',
                    change.direction === 'down' && 'text-error',
                  )}
                >
                  <ChangeIcon aria-hidden className="size-4" />
                  {change.label}
                </span>
              </dd>
              <Sparkline values={daily.map((day) => day[key])} className="mt-3 h-12 w-full" />
            </div>
          )
        })}
      </dl>
    </SectionCard>
  )
}
