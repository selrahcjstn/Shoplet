import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../../components/ui/Badge'
import { buttonStyles } from '../../../components/ui/button-styles'
import type { Shop } from '../../shops/types'

/** Shop card with a color band: the seller's accent color when set, brand green otherwise. */
export default function ShopStatus({ shop }: { shop: Shop }) {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <div
        className="h-16 bg-primary-dark"
        style={shop.accentColor ? { backgroundColor: shop.accentColor } : undefined}
      />
      <div className="px-6 pb-6">
        <div className="-mt-7 flex items-end justify-between gap-3">
          {shop.logoUrl ? (
            <img
              src={shop.logoUrl}
              alt={`${shop.name} logo`}
              className="size-14 rounded-xl border-4 border-surface bg-surface object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="flex size-14 items-center justify-center rounded-xl border-4 border-surface bg-primary-light text-xl font-bold text-primary-dark"
            >
              {shop.name.charAt(0).toUpperCase()}
            </span>
          )}
          {shop.isPublished ? (
            <Badge tone="success" icon={<Eye aria-hidden className="size-3.5" />}>
              Published
            </Badge>
          ) : (
            <Badge tone="warning" icon={<EyeOff aria-hidden className="size-3.5" />}>
              Draft
            </Badge>
          )}
        </div>

        <h2 className="mt-3 truncate text-h4 font-semibold tracking-tight text-brand-ink">{shop.name}</h2>
        <p className="truncate text-sm text-content-secondary">
          shoplet/<span className="font-medium text-content">{shop.slug}</span>
        </p>
        <p className="mt-3 text-sm text-content-secondary">
          {shop.isPublished
            ? 'Customers can see your shop.'
            : 'Only you can see your shop. Publish it when you are ready.'}
        </p>
        <Link to="/dashboard/shop" className={buttonStyles({ variant: 'outline', size: 'sm', className: 'mt-4' })}>
          Manage shop
        </Link>
      </div>
    </section>
  )
}
