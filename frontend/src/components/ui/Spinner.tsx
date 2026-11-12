import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

export default function Spinner({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <span role="status" className={cn('inline-flex items-center gap-2 text-content-secondary', className)}>
      <Loader2 aria-hidden className="size-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </span>
  )
}
