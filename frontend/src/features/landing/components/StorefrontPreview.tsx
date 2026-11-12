import { MessageCircle } from 'lucide-react'
import mug from '../../../assets/product-mug.svg'
import plant from '../../../assets/product-plant.svg'
import tote from '../../../assets/product-tote.svg'
import Button from '../../../components/ui/Button'
import ProductCard from '../../products/components/ProductCard'
import type { Product } from '../../products/types'

const base = { shopId: 'demo', slug: '', description: null, isVisible: true, createdAt: '', updatedAt: '' }

// Sample items for the hero preview only.
const SAMPLE: Array<{ product: Product; imageUrl: string; categoryName: string }> = [
  {
    product: {
      ...base,
      id: '1',
      categoryId: null,
      name: 'Stoneware mug',
      price: '480',
      availability: 'AVAILABLE',
      isFeatured: false,
    },
    imageUrl: mug,
    categoryName: 'Kitchen',
  },
  {
    product: {
      ...base,
      id: '2',
      categoryId: null,
      name: 'Canvas tote',
      price: '650',
      availability: 'MADE_TO_ORDER',
      isFeatured: true,
    },
    imageUrl: tote,
    categoryName: 'Bags',
  },
  {
    product: {
      ...base,
      id: '3',
      categoryId: null,
      name: 'Pothos in clay pot',
      price: '350',
      availability: 'OUT_OF_STOCK',
      isFeatured: false,
    },
    imageUrl: plant,
    categoryName: 'Home',
  },
]

/** A sample storefront inside a browser frame. The one memorable element of the landing page. */
export default function StorefrontPreview() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-border-strong bg-background shadow-md"
      role="img"
      aria-label="Example of a Shoplet storefront with three products"
    >
      <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </div>
        <div className="flex-1 truncate rounded-md bg-surface-muted px-3 py-1 text-sm text-content-secondary">
          shoplet/<span className="font-medium text-content">maple-and-co</span>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6" aria-hidden>
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-bold text-content-inverse">
              M
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-brand-ink">Maple &amp; Co.</p>
              <p className="truncate text-sm text-content-secondary">Small-batch home goods, made by hand.</p>
            </div>
          </div>
          <Button size="sm" tabIndex={-1} className="shrink-0">
            <MessageCircle aria-hidden className="size-4" />
            <span className="hidden sm:inline">Message seller</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {SAMPLE.map((item, index) => (
            <div
              key={item.product.id}
              className={index === 2 ? 'rise hidden sm:block [&>*]:h-full' : 'rise [&>*]:h-full'}
              style={{ '--delay': `${200 + index * 90}ms` } as React.CSSProperties}
            >
              <ProductCard {...item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
