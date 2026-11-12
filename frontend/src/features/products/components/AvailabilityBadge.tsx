import { CalendarClock, CheckCircle2, Clock, XCircle } from 'lucide-react'
import Badge, { type BadgeTone } from '../../../components/ui/Badge'
import { normalizeAvailability } from '../availability'

const STATUSES: Record<string, { label: string; tone: BadgeTone; Icon: typeof Clock }> = {
  AVAILABLE: { label: 'Available', tone: 'success', Icon: CheckCircle2 },
  OUT_OF_STOCK: { label: 'Out of stock', tone: 'error', Icon: XCircle },
  MADE_TO_ORDER: { label: 'Made to order', tone: 'warning', Icon: Clock },
  COMING_SOON: { label: 'Coming soon', tone: 'info', Icon: CalendarClock },
}

export default function AvailabilityBadge({ availability }: { availability: string }) {
  const status = STATUSES[normalizeAvailability(availability)]
  if (!status) return <Badge>{availability}</Badge>
  return (
    <Badge tone={status.tone} icon={<status.Icon aria-hidden className="size-3.5" />}>
      {status.label}
    </Badge>
  )
}
