import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-h3 font-bold tracking-tight text-brand-ink md:text-h2">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-content-secondary">{description}</p>}
      </div>
      {actions}
    </div>
  )
}
