import { Eye, EyeOff, Pencil, Star, Trash2 } from 'lucide-react'
import { cn } from '../../../lib/cn'
import { formatPrice } from '../../../lib/format'
import type { Product } from '../types'
import AvailabilityBadge from './AvailabilityBadge'

interface ProductTileProps {
  product: Product
  imageUrl?: string
  categoryName?: string
  busy: boolean
  onEdit: () => void
  onToggleVisible: () => void
  onDelete: () => void
}

const iconButton =
  'rounded-md p-2 text-content-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-content disabled:opacity-50'

/** A product as the seller sees it: the photo, the key facts, and quick actions. */
export default function ProductTile({
  product,
  imageUrl,
  categoryName,
  busy,
  onEdit,
  onToggleVisible,
  onDelete,
}: ProductTileProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface">
      <div className="relative aspect-square bg-surface-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className={cn('size-full object-cover', !product.isVisible && 'opacity-60')}
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              'flex size-full items-center justify-center bg-primary-light text-6xl font-bold text-primary/40',
              !product.isVisible && 'opacity-60',
            )}
          >
            {product.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {product.isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-brand-ink">
              <Star aria-hidden className="size-3.5" />
              Featured
            </span>
          ) : (
            <span />
          )}
          {!product.isVisible && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-ink/85 px-2.5 py-0.5 text-xs font-medium text-content-inverse">
              <EyeOff aria-hidden className="size-3.5" />
              Hidden
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {categoryName && <p className="truncate text-xs font-medium text-content-secondary">{categoryName}</p>}
        <h3 className="mt-0.5 truncate font-semibold text-content">{product.name}</h3>
        <p className="mt-1 text-lg font-semibold text-primary-dark">{formatPrice(product.price)}</p>
        <div className="mt-2">
          <AvailabilityBadge availability={product.availability} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 border-t border-border px-2 py-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-content transition-colors duration-150 hover:bg-surface-muted"
        >
          <Pencil aria-hidden className="size-4" />
          Edit
        </button>
        <div className="flex items-center">
          <button
            type="button"
            onClick={onToggleVisible}
            disabled={busy}
            aria-label={product.isVisible ? `Hide ${product.name}` : `Show ${product.name}`}
            title={product.isVisible ? 'Hide from customers' : 'Show to customers'}
            className={iconButton}
          >
            {product.isVisible ? <Eye aria-hidden className="size-4" /> : <EyeOff aria-hidden className="size-4" />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            aria-label={`Delete ${product.name}`}
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
