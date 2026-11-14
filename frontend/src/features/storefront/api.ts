import { api, API_URL } from '../../lib/api-client'
import type { Storefront } from './types'

/** The token, when present, lets an owner preview a draft. Customers have none, which is fine. */
export const getStorefront = (slug: string) => api<Storefront>(`/storefront/${encodeURIComponent(slug)}`)

/**
 * Counting is best-effort and must never get in the customer's way: no token, no error handling,
 * and `keepalive` so a click that leaves the page for WhatsApp is still recorded.
 */
function track(path: string, body: Record<string, string | undefined>) {
  fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {})
}

/** Counts each visitor once per browser session, so refreshing the page does not inflate the numbers. */
function oncePerSession(key: string, action: () => void) {
  try {
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
  } catch {
    // Storage can be blocked (private mode). Count anyway.
  }
  action()
}

export const trackStoreView = (shopId: string) =>
  oncePerSession(`shoplet_sv_${shopId}`, () => track('/store-views', { shopId }))

export const trackProductView = (productId: string) =>
  oncePerSession(`shoplet_pv_${productId}`, () => track('/product-views', { productId }))

export const trackContactClick = (shopId: string, contactType: string, productId?: string) =>
  track('/contact-clicks', { shopId, contactType, productId })
