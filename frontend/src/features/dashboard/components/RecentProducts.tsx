import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge'
import { buttonStyles } from '../../../components/ui/button-styles'
import EmptyState from '../../../components/ui/EmptyState'
import { formatPrice } from '../../../lib/format'
import AvailabilityBadge from '../../products/components/AvailabilityBadge'
import type { Product } from '../../products/types'

const MAX_ROWS = 5

export default function RecentProducts({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<Package aria-hidden className="size-8" />}
        title="No products yet"
        description="Add your first product so customers have something to see."
        action={
          <Link to="/dashboard/products" className={buttonStyles()}>
            Add a product
          </Link>
        }
      />
    )
  }

  const recent = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, MAX_ROWS)

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <header className="flex items-center justify-between gap-3 px-6 py-5">
        <div>
          <h2 className="text-h4 font-semibold tracking-tight text-brand-ink">Recent products</h2>
          <p className="text-sm text-content-secondary">
            Latest {recent.length} of {products.length}
          </p>
        </div>
        <Link to="/dashboard/products" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
          View all
        </Link>
      </header>
      <ul className="divide-y divide-border border-t border-border">
        {recent.map((product) => (
          <li
            key={product.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 transition-colors duration-150 hover:bg-surface-muted/60"
          >
            <span
              aria-hidden
              className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-base font-semibold text-primary-dark"
            >
              {product.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-content">{product.name}</p>
              <p className="text-sm text-content-secondary">{formatPrice(product.price)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {!product.isVisible && <Badge>Hidden</Badge>}
              <AvailabilityBadge availability={product.availability} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
