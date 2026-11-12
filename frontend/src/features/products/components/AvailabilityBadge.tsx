import { CalendarClock, CheckCircle2, Clock, XCircle } from 'lucide-react'
import Badge, { type BadgeTone } from '../../../components/ui/Badge'

const STATUSES: Record<string, { label: string; tone: BadgeTone; Icon: typeof Clock }> = {
  AVAILABLE: { label: 'Available', tone: 'success', Icon: CheckCircle2 },
  OUT_OF_STOCK: { label: 'Out of stock', tone: 'error', Icon: XCircle },
  MADE_TO_ORDER: { label: 'Made to order', tone: 'warning', Icon: Clock },
  COMING_SOON: { label: 'Coming soon', tone: 'info', Icon: CalendarClock },
}

/** "Made to order", "made-to-order" and "MADE_TO_ORDER" all map to the same status. */
const normalize = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')

export default function AvailabilityBadge({ availability }: { availability: string }) {
  const status = STATUSES[normalize(availability)]
  if (!status) return <Badge>{availability}</Badge>
  return (
    <Badge tone={status.tone} icon={<status.Icon aria-hidden className="size-3.5" />}>
      {status.label}
    </Badge>
  )
}
