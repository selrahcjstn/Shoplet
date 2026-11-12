import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border-strong px-6 py-12 text-center">
      {icon && <div className="mb-3 text-content-muted">{icon}</div>}
      <h3 className="text-h4 font-semibold text-brand-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-content-secondary">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
