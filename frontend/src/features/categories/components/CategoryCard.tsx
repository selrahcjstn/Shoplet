import { Pencil, Tag, Trash2 } from 'lucide-react'
import { cn } from '../../../lib/cn'
import type { ProductCategory } from '../../products/types'

interface CategoryCardProps {
  category: ProductCategory
  productCount: number
  /** A few product names, so the card shows what is inside. */
  sample: string[]
  onEdit: () => void
  onDelete: () => void
}

const iconButton =
  'rounded-md p-2 text-content-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-content'

/** A category as the seller sees it: its name, how many products it holds, and a peek inside. */
export default function CategoryCard({ category, productCount, sample, onEdit, onDelete }: CategoryCardProps) {
  const extra = productCount - sample.length

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-surface">
      <div className="flex-1 p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary"
          >
            <Tag className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-brand-ink">{category.name}</h3>
            <p className="truncate text-sm text-content-muted">/{category.slug}</p>
          </div>
        </div>

        <p
          className={cn(
            'mt-4 line-clamp-2 text-sm',
            category.description ? 'text-content-secondary' : 'text-content-muted',
          )}
        >
          {category.description ?? 'No description yet.'}
        </p>

        {sample.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {sample.map((name) => (
              <li
                key={name}
                className="max-w-full truncate rounded-md bg-surface-muted px-2 py-1 text-xs text-content-secondary"
              >
                {name}
              </li>
            ))}
            {extra > 0 && <li className="px-1 py-1 text-xs text-content-muted">+{extra} more</li>}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-2 py-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-content transition-colors duration-150 hover:bg-surface-muted"
        >
          <Pencil aria-hidden className="size-4" />
          Edit
        </button>
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-medium',
              productCount > 0 ? 'bg-primary-light text-primary-dark' : 'bg-surface-muted text-content-secondary',
            )}
          >
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </span>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${category.name}`}
            title="Delete"
            className={cn(iconButton, 'hover:text-error')}
          >
            <Trash2 aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
