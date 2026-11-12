import { BarChart3, Eye, MousePointerClick, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../../components/layout/PageHeader'
import Alert from '../../../components/ui/Alert'
import { buttonStyles } from '../../../components/ui/button-styles'
import EmptyState from '../../../components/ui/EmptyState'
import Spinner from '../../../components/ui/Spinner'
import { cn } from '../../../lib/cn'
import { errorMessages } from '../../../lib/api-client'
import { getMe } from '../../auth/api'
import { getShops } from '../../shops/api'
import { getShopAnalytics } from '../api'
import BestDays from '../components/BestDays'
import ContactBreakdown from '../components/ContactBreakdown'
import DailyChart from '../components/DailyChart'
import InsightsStrip from '../components/InsightsStrip'
import MetricCard from '../components/MetricCard'
import LeastViewed from '../components/LeastViewed'
import RangeTabs from '../components/RangeTabs'
import TopProducts from '../components/TopProducts'
import { formatDay } from '../format'
import type { Analytics, Metric } from '../types'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'no-shop' }
  | { status: 'ready'; data: Analytics }

const METRICS: { key: Metric; label: string; unit: string; Icon: typeof Eye }[] = [
  { key: 'storeViews', label: 'Store visits', unit: 'visits', Icon: Store },
  { key: 'productViews', label: 'Product views', unit: 'views', Icon: Eye },
  { key: 'contactClicks', label: 'Contact clicks', unit: 'clicks', Icon: MousePointerClick },
]

export default function AnalyticsPage() {
  const [days, setDays] = useState(30)
  const [metric, setMetric] = useState<Metric>('storeViews')
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    Promise.all([getMe(), getShops()])
      .then(async ([user, shops]) => {
        const shop = shops.find((s) => s.ownerId === user.id)
        if (!shop) return { status: 'no-shop' } as const
        return { status: 'ready', data: await getShopAnalytics(shop.id, days) } as const
      })
      .then((next) => {
        if (!cancelled) setState(next)
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', message: errorMessages(error)[0] ?? '' })
      })

    return () => {
      cancelled = true
    }
  }, [days])

  if (state.status === 'loading') {
    return (
      <>
        <PageHeader title="Analytics" />
        <Spinner label="Loading your analytics" />
      </>
    )
  }

  if (state.status === 'error') {
    return (
      <>
        <PageHeader title="Analytics" />
        <Alert tone="error" title="We could not load your analytics">
          {state.message} Refresh the page to try again.
        </Alert>
      </>
    )
  }

  if (state.status === 'no-shop') {
    return (
      <>
        <PageHeader title="Analytics" description="See how many people visit your shop." />
        <EmptyState
          icon={<BarChart3 aria-hidden className="size-10" />}
          title="Open your shop first"
          description="Analytics count visits to your shop. Create it, then share your link."
          action={
            <Link to="/dashboard/shop" className={buttonStyles()}>
              Open your shop
            </Link>
          }
        />
      </>
    )
  }

  const { data } = state
  // While a new period loads, the old numbers stay on screen, dimmed.
  const refreshing = data.range.days !== days
  const periodLabel = `previous ${data.range.days} days`
  const selected = METRICS.find((m) => m.key === metric)!
  const hasActivity = Object.values(data.totals).some((value) => value > 0)

  return (
    <>
      <PageHeader
        title="Analytics"
        description="See how many people visit your shop."
        actions={<RangeTabs value={days} onChange={setDays} />}
      />

      <div className={cn('transition-opacity duration-150', refreshing && 'opacity-60')} aria-busy={refreshing}>
        {!hasActivity && (
          <Alert tone="info" title="No activity in this period" className="mb-6">
            Visits and clicks show up here once customers open your shop. Publish your shop and share your link to get
            started.
          </Alert>
        )}

        <div role="tablist" aria-label="Choose what to chart" className="grid gap-4 sm:grid-cols-3">
          {METRICS.map(({ key, label, Icon }) => (
            <MetricCard
              key={key}
              label={label}
              value={data.totals[key]}
              previous={data.previous[key]}
              periodLabel={periodLabel}
              Icon={Icon}
              selected={metric === key}
              onSelect={() => setMetric(key)}
            />
          ))}
        </div>

        <InsightsStrip data={data} />

        <section
          aria-label={`${selected.label} by day`}
          className="mt-6 rounded-lg border border-border bg-surface p-6"
        >
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-h4 font-semibold tracking-tight text-brand-ink">{selected.label} by day</h2>
            <p className="text-sm text-content-secondary">
              {formatDay(data.range.from, 'short')} to {formatDay(data.range.to, 'short')} · {data.range.timezone}
            </p>
          </div>
          <DailyChart days={data.daily} metric={metric} unit={selected.unit} />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <TopProducts products={data.topProducts} />
          <LeastViewed products={data.leastViewed} />
          <BestDays days={data.daily} />
          <ContactBreakdown contacts={data.contactsByType} />
        </div>
      </div>
    </>
  )
}
