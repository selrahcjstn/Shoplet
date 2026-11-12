import { api } from '../../lib/api-client'
import type { Analytics } from './types'

/** Days start and end in the seller's own timezone, so the counts match their calendar. */
export const getShopAnalytics = (shopId: string, days: number) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  const query = new URLSearchParams({ days: String(days), timezone })
  return api<Analytics>(`/analytics/shops/${shopId}?${query}`)
}
