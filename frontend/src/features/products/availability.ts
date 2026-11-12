/** "Made to order", "made-to-order" and "MADE_TO_ORDER" all map to the same status. */
export const normalizeAvailability = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

export const isOutOfStock = (availability: string) => normalizeAvailability(availability) === 'OUT_OF_STOCK'

/** The statuses a seller can pick from. `value` is what the API stores. */
export const AVAILABILITY_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OUT_OF_STOCK', label: 'Out of stock' },
  { value: 'MADE_TO_ORDER', label: 'Made to order' },
  { value: 'COMING_SOON', label: 'Coming soon' },
]
