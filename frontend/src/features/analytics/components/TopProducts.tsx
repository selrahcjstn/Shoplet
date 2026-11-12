import { Package } from 'lucide-react'
import SectionCard from '../../../components/ui/SectionCard'
import type { TopProduct } from '../types'

/** The products people looked at most, with the contact clicks each one led to. */
export default function TopProducts({ products }: { products: TopProduct[] }) {
  const top = Math.max(...products.map((p) => p.views), 1)

  return (
    <SectionCard className="h-full" Icon={Package} title="Top products" description="Most viewed in this period.">
      {products.length === 0 ? (
        <p className="text-sm text-content-secondary">
          No product views yet. They appear here when customers open your products.
        </p>
      ) : (
        <ol className="space-y-4">
          {products.map((product) => (
            <li key={product.productId}>
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate text-sm font-medium text-content">{product.name}</p>
                <p className="shrink-0 text-sm text-content-secondary">
                  <span className="font-medium text-content">{product.views.toLocaleString('en')}</span>{' '}
                  {product.views === 1 ? 'view' : 'views'}
                </p>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(product.views / top) * 100}%` }} />
              </div>
              <p className="mt-1 text-xs text-content-secondary">
                {product.contactClicks} contact {product.contactClicks === 1 ? 'click' : 'clicks'}
              </p>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  )
}
