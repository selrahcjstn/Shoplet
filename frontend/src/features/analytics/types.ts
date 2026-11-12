export interface Totals {
  storeViews: number
  productViews: number
  contactClicks: number
}

export interface Day extends Totals {
  /** Local date, YYYY-MM-DD. */
  date: string
}

export interface TopProduct {
  productId: string
  name: string
  views: number
  contactClicks: number
}

export interface LeastViewedProduct {
  productId: string
  name: string
  views: number
}

export interface ContactType {
  contactType: string
  clicks: number
}

export interface Analytics {
  range: { days: number; from: string; to: string; timezone: string }
  totals: Totals
  /** The same counts for the period just before this one. */
  previous: Totals
  daily: Day[]
  topProducts: TopProduct[]
  /** Visible products with the fewest views, apart from the top ones. */
  leastViewed: LeastViewedProduct[]
  contactsByType: ContactType[]
}

export type Metric = keyof Totals
