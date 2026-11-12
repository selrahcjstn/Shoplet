/** Formats a decimal price such as "199.00" for display. Currency defaults to Philippine peso. */
export function formatPrice(value: string | number, currency = 'PHP'): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency }).format(Number(value))
}
