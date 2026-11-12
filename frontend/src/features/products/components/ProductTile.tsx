import { Eye, EyeOff, Pencil, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
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

// Small round buttons over the photo. Shown on hover or keyboard focus; always shown on touch screens.
const actionButton = cn(
  'flex size-8 items-center justify-center rounded-full bg-surface/95 text-content-secondary',
  'transition-colors duration-150 hover:bg-surface hover:text-content disabled:opacity-50',
  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary',
)

/** A compact product card: photo first, with the details and quick actions kept small. */
export default function ProductTile({
  product,
  imageUrl,
  categoryName,
  busy,
  onEdit,
  onToggleVisible,
  onDelete,
}: ProductTileProps) {
  // A broken photo link falls back to the letter tile instead of an empty box.
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showImage = Boolean(imageUrl) && imageUrl !== failedUrl

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-surface transition-colors duration-150 hover:border-border-strong">
      <div className="relative aspect-[4/3] bg-primary-light">
        {showImage ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            onError={() => setFailedUrl(imageUrl ?? null)}
            className={cn('size-full object-cover', !product.isVisible && 'opacity-50 grayscale')}
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              'flex size-full items-center justify-center text-5xl font-bold text-primary/35',
              !product.isVisible && 'opacity-50',
            )}
          >
            {product.name.charAt(0).toUpperCase()}
          </div>
        )}

        {product.isFeatured && (
          <span
            title="Featured"
            className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full bg-accent text-brand-ink"
          >
            <Star aria-hidden className="size-3.5 fill-current" />
            <span className="sr-only">Featured</span>
          </span>
        )}

        <div
          className={cn(
            'absolute z-10 right-2 top-2 flex gap-1.5 transition-opacity duration-150',
            'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100',
          )}
        >
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${product.name}`}
            title="Edit"
            className={actionButton}
          >
            <Pencil aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            onClick={onToggleVisible}
            disabled={busy}
            aria-label={product.isVisible ? `Hide ${product.name}` : `Show ${product.name}`}
            title={product.isVisible ? 'Hide from customers' : 'Show to customers'}
            className={actionButton}
          >
            {product.isVisible ? <Eye aria-hidden className="size-4" /> : <EyeOff aria-hidden className="size-4" />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            aria-label={`Delete ${product.name}`}
            title="Delete"
            className={cn(actionButton, 'hover:text-error')}
          >
            <Trash2 aria-hidden className="size-4" />
          </button>
        </div>

        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
          <AvailabilityBadge availability={product.availability} />
          {!product.isVisible && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-ink/85 px-2.5 py-0.5 text-xs font-medium text-content-inverse">
              <EyeOff aria-hidden className="size-3.5" />
              Hidden
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start justify-between gap-3 px-3.5 py-3">
        <div className="min-w-0">
          {/* The name is the main click target: it stretches over the whole card and opens the editor. */}
          <button
            type="button"
            onClick={onEdit}
            className="block max-w-full truncate text-left text-sm font-semibold text-content after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {product.name}
          </button>
          <p className="truncate text-xs text-content-secondary">{categoryName ?? 'No category'}</p>
        </div>
        <p className="shrink-0 text-sm font-semibold text-primary-dark">{formatPrice(product.price)}</p>
      </div>
    </article>
  )
}
