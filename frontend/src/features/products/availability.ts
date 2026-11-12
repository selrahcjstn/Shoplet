/** "Made to order", "made-to-order" and "MADE_TO_ORDER" all map to the same status. */
export const normalizeAvailability = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

export const isOutOfStock = (availability: string) => normalizeAvailability(availability) === 'OUT_OF_STOCK'
