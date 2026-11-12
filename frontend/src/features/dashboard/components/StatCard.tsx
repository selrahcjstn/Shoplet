import type { LucideIcon } from 'lucide-react'
import Card from '../../../components/ui/Card'
import { cn } from '../../../lib/cn'

type Tone = 'primary' | 'neutral' | 'accent' | 'error'

// The chip color carries meaning: green is healthy, amber is highlighted, red needs attention.
const chip: Record<Tone, string> = {
  primary: 'bg-primary-light text-primary',
  neutral: 'bg-surface-muted text-content-secondary',
  accent: 'bg-accent-light text-warning',
  error: 'bg-error-bg text-error',
}

interface StatCardProps {
  label: string
  value: number
  hint?: string
  Icon: LucideIcon
  tone?: Tone
}

export default function StatCard({ label, value, hint, Icon, tone = 'primary' }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 transition-colors duration-150 hover:border-border-strong">
      <span aria-hidden className={cn('flex size-12 shrink-0 items-center justify-center rounded-lg', chip[tone])}>
        <Icon className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-content-secondary">{label}</p>
        <p className="text-h2 font-bold leading-tight tracking-tight text-brand-ink">{value}</p>
        {hint && <p className="truncate text-xs text-content-secondary">{hint}</p>}
      </div>
    </Card>
  )
}
