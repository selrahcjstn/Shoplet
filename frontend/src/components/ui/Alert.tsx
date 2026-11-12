import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type AlertTone = 'success' | 'warning' | 'error' | 'info'

const styles: Record<AlertTone, { box: string; Icon: typeof Info }> = {
  success: { box: 'bg-success-bg text-success', Icon: CheckCircle2 },
  warning: { box: 'bg-warning-bg text-warning', Icon: AlertTriangle },
  error: { box: 'bg-error-bg text-error', Icon: XCircle },
  info: { box: 'bg-info-bg text-info', Icon: Info },
}

interface AlertProps {
  tone?: AlertTone
  title?: string
  children?: ReactNode
  className?: string
}

export default function Alert({ tone = 'info', title, children, className }: AlertProps) {
  const { box, Icon } = styles[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-md p-3 text-sm', box, className)}
    >
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  )
}
