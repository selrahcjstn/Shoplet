import { formatDay, formatNumber } from '../format'
import type { Analytics } from '../types'

interface Fact {
  label: string
  value: string
  note: string
}

/** Plain-language facts worked out from the same numbers as the cards above. */
function factsFor({ totals, daily, range }: Analytics): Fact[] {
  const busiest = daily.reduce((best, day) => (day.storeViews > best.storeViews ? day : best), daily[0]!)
  const { storeViews, productViews, contactClicks } = totals

  return [
    {
      label: 'Daily average',
      value: formatNumber(storeViews / range.days),
      note: 'store visits a day',
    },
    {
      label: 'Busiest day',
      value: busiest.storeViews > 0 ? formatDay(busiest.date, 'short') : 'None yet',
      note: busiest.storeViews > 0 ? `${busiest.storeViews.toLocaleString('en')} visits` : 'no visits in this period',
    },
    {
      label: 'Products opened per visit',
      value: storeViews > 0 ? formatNumber(Math.round((productViews / storeViews) * 10) / 10) : '0',
      note: 'higher means customers browse more',
    },
    {
      label: 'Visits that led to contact',
      value: storeViews > 0 ? `${formatNumber(Math.round((contactClicks / storeViews) * 1000) / 10)}%` : '0%',
      note: `${contactClicks.toLocaleString('en')} contact clicks`,
    },
  ]
}

export default function InsightsStrip({ data }: { data: Analytics }) {
  return (
    <dl className="mt-6 grid divide-border rounded-lg border border-border bg-surface sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
      {factsFor(data).map((fact, index) => (
        <div
          key={fact.label}
          className={`p-5 ${index >= 2 ? 'border-t border-border sm:border-t lg:border-t-0' : ''} ${index === 1 ? 'border-t border-border sm:border-t-0' : ''}`}
        >
          <dt className="text-sm text-content-secondary">{fact.label}</dt>
          <dd className="mt-1 text-h4 font-semibold tracking-tight text-brand-ink">{fact.value}</dd>
          <dd className="text-xs text-content-secondary">{fact.note}</dd>
        </div>
      ))}
    </dl>
  )
}
