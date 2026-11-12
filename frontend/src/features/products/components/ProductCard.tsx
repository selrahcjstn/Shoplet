import { ImageOff, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge'
import type { Product } from '../types'
import AvailabilityBadge from './AvailabilityBadge'

interface ProductCardProps {
  product: Product
  imageUrl?: string
  categoryName?: string
  /** Makes the whole card a link to the product page. */
  to?: string
  currency?: string
}

export default function ProductCard({ product, imageUrl, categoryName, to, currency = 'PHP' }: ProductCardProps) {
  const price = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  }).format(Number(product.price))

  const content = (
    <>
      <div className="aspect-square overflow-hidden bg-surface-muted">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} loading="lazy" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-content-muted">
            <ImageOff aria-label="No image available" className="size-8" />
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {categoryName && <Badge>{categoryName}</Badge>}
          {product.isFeatured && (
            <Badge tone="accent" icon={<Star aria-hidden className="size-3.5" />}>
              Featured
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-content">{product.name}</h3>
        <p className="text-lg font-semibold text-primary-dark">{price}</p>
        <AvailabilityBadge availability={product.availability} />
      </div>
    </>
  )

  const classes = 'block overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-150'
  return to ? (
    <Link to={to} className={`${classes} hover:border-border-strong`}>
      {content}
    </Link>
  ) : (
    <article className={classes}>{content}</article>
  )
}
