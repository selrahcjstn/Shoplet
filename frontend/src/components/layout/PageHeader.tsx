import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-h3 font-semibold text-brand-ink md:text-h2">{title}</h1>
        {description && <p className="mt-1 text-content-secondary">{description}</p>}
      </div>
      {actions}
    </div>
  )
}
