import { EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard from '../../../components/ui/SectionCard'
import type { LeastViewedProduct } from '../types'

/** The visible products that got the fewest views: a nudge to improve the photo or name, or to feature them. */
export default function LeastViewed({ products }: { products: LeastViewedProduct[] }) {
  return (
    <SectionCard
      Icon={EyeOff}
      title="Needs attention"
      description="Visible products with the fewest views."
      className="h-full"
    >
      {products.length === 0 ? (
        <p className="text-sm text-content-secondary">
          Add a few more products to compare them. The least viewed ones will show up here.
        </p>
      ) : (
        <>
          <ul className="divide-y divide-border">
            {products.map((product) => (
              <li key={product.productId} className="flex items-center gap-3 py-3 first:pt-0">
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-sm font-semibold text-content-secondary"
                >
                  {product.name.charAt(0).toUpperCase()}
                </span>
                <p className="min-w-0 flex-1 truncate text-sm font-medium text-content">{product.name}</p>
                <span className="shrink-0 text-sm text-content-secondary">
                  <span className="font-medium text-content">{product.views.toLocaleString('en')}</span>{' '}
                  {product.views === 1 ? 'view' : 'views'}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-content-secondary">
            Try a clearer photo or name, or feature one on your page.{' '}
            <Link to="/dashboard/products" className="font-medium text-primary underline underline-offset-2">
              Edit products
            </Link>
          </p>
        </>
      )}
    </SectionCard>
  )
}
