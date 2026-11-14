import { Star } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../../lib/cn'
import { formatPrice } from '../../../lib/format'
import { isOutOfStock } from '../../products/availability'
import AvailabilityBadge from '../../products/components/AvailabilityBadge'
import type { StoreProduct } from '../types'

interface StoreProductCardProps {
  product: StoreProduct
  onOpen: () => void
  /** Wide layout for the featured row: photo on the left, details on the right. */
  wide?: boolean
}

/** A product photo with a soft letter tile behind it, used when the photo is missing or fails to load. */
export function ProductImage({ product, className }: { product: StoreProduct; className?: string }) {
  const [failed, setFailed] = useState(false)
  const image = product.images[0]

  return (
    <div className={cn('relative overflow-hidden bg-[color-mix(in_srgb,var(--shop-accent)_12%,white)]', className)}>
      {/* The letter sits underneath, so it also shows while a photo is still loading */}
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-[color-mix(in_srgb,var(--shop-accent)_45%,white)]"
      >
        {product.name.charAt(0).toUpperCase()}
      </span>
      {image && !failed && (
        <img
          src={image.imageUrl}
          alt={image.altText ?? product.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="relative size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
    </div>
  )
}

export default function StoreProductCard({ product, onOpen, wide = false }: StoreProductCardProps) {
  const soldOut = isOutOfStock(product.availability)
  const showStatus = product.availability.toUpperCase() !== 'AVAILABLE'

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        'group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
        wide && 'flex items-stretch gap-4 rounded-2xl border border-border bg-surface p-3 sm:gap-5',
      )}
    >
      <div className={cn('relative shrink-0', wide ? 'w-24 sm:w-28' : 'w-full')}>
        <ProductImage
          product={product}
          className={cn('aspect-square rounded-2xl', soldOut && 'opacity-60 grayscale')}
        />
        {product.isFeatured && !wide && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-brand-ink">
            <Star aria-hidden className="size-3 fill-current" />
            Featured
          </span>
        )}
      </div>

      <div className={cn('min-w-0', wide ? 'flex flex-1 flex-col justify-center py-1' : 'mt-3')}>
        <p className={cn('font-semibold text-content group-hover:text-brand-ink', wide ? 'line-clamp-2' : 'truncate')}>
          {product.name}
        </p>
        {wide && product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-content-secondary">{product.description}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="font-semibold text-brand-ink">{formatPrice(product.price)}</span>
          {showStatus && <AvailabilityBadge availability={product.availability} />}
        </div>
      </div>
    </button>
  )
}
