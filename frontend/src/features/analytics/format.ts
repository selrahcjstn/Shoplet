/** Formats a YYYY-MM-DD date. Parsed and printed in UTC so it never shifts a day. */
export function formatDay(date: string, style: 'long' | 'short' = 'long'): string {
  return new Intl.DateTimeFormat(
    'en',
    style === 'long'
      ? { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }
      : { month: 'short', day: 'numeric', timeZone: 'UTC' },
  ).format(new Date(`${date}T00:00:00Z`))
}

/** Rounds a chart ceiling up to 1, 2, 5 or 10 times a power of ten, with a floor of 4. */
export function niceCeil(value: number): number {
  if (value <= 4) return 4
  const power = 10 ** Math.floor(Math.log10(value))
  return [1, 2, 5, 10].map((step) => step * power).find((step) => step >= value) ?? value
}

export interface Change {
  /** Short text such as "+25%". */
  label: string
  direction: 'up' | 'down' | 'flat'
}

/** Compares this period with the one before it. A rise from zero has no percentage. */
export function compare(current: number, previous: number): Change {
  if (current === previous) return { label: 'No change', direction: 'flat' }
  if (previous === 0) return { label: 'New', direction: 'up' }
  const percent = Math.round(((current - previous) / previous) * 100)
  return { label: `${percent > 0 ? '+' : ''}${percent}%`, direction: percent >= 0 ? 'up' : 'down' }
}

/** "12", "12.5" or "0.4": whole numbers stay whole, everything else gets one decimal. */
export function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toLocaleString('en') : value.toFixed(1)
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export interface WeekdayAverage {
  name: string
  /** Average per day, so a range with five Mondays and four Fridays stays fair. */
  average: number
}

/** Average of one counter for each day of the week, Monday first. */
export function weekdayAverages(days: { date: string; value: number }[]): WeekdayAverage[] {
  const sums = new Array<number>(7).fill(0)
  const counts = new Array<number>(7).fill(0)
  for (const day of days) {
    const index = new Date(`${day.date}T00:00:00Z`).getUTCDay()
    sums[index]! += day.value
    counts[index]! += 1
  }
  return [1, 2, 3, 4, 5, 6, 0].map((index) => ({
    name: WEEKDAYS[index]!,
    average: counts[index]! === 0 ? 0 : sums[index]! / counts[index]!,
  }))
}
