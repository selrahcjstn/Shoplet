import { Share2 } from 'lucide-react'
import type { ContactLink } from '../contact-links'
import type { StoreContact, StoreShop } from '../types'
import ContactButtons from './ContactButtons'

interface StoreHeaderProps {
  shop: StoreShop
  productCount: number
  contacts: StoreContact[]
  onContact: (link: ContactLink) => void
  onShare: () => void
}

/** The shop's front: cover, logo, name, what it sells, and the ways to get in touch. */
export default function StoreHeader({ shop, productCount, contacts, onContact, onShare }: StoreHeaderProps) {
  return (
    <header className="rise">
      <div className="relative h-40 overflow-hidden rounded-3xl bg-[var(--shop-accent)] sm:h-56 lg:h-64">
        {shop.coverImageUrl ? (
          <img src={shop.coverImageUrl} alt="" className="size-full object-cover" />
        ) : (
          <>
            {/* No cover photo: the accent color with a soft dot texture and two flat shapes */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
            <div aria-hidden className="absolute -right-16 -top-20 size-72 rounded-full bg-white/10" />
            <div aria-hidden className="absolute -bottom-24 left-1/3 size-56 rounded-full bg-black/10" />
          </>
        )}
      </div>

      <div className="px-1 sm:px-6">
        <div className="-mt-12 flex items-end justify-between gap-4 sm:-mt-14">
          {shop.logoUrl ? (
            <img
              src={shop.logoUrl}
              alt={`${shop.name} logo`}
              className="relative size-24 rounded-3xl border-4 border-background bg-surface object-cover sm:size-28"
            />
          ) : (
            <span
              aria-hidden
              className="relative flex size-24 items-center justify-center rounded-3xl border-4 border-background bg-surface text-4xl font-bold text-[var(--shop-accent)] sm:size-28 sm:text-5xl"
            >
              {shop.name.charAt(0).toUpperCase()}
            </span>
          )}
          <button
            type="button"
            onClick={onShare}
            className="mb-1 inline-flex h-10 items-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-sm font-medium text-content transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Share2 aria-hidden className="size-4" />
            Share
          </button>
        </div>

        <h1 className="mt-4 text-h2 font-bold tracking-tight text-brand-ink md:text-h1">{shop.name}</h1>
        <p className="mt-1 text-sm text-content-secondary">
          {[shop.businessCategory, `${productCount} ${productCount === 1 ? 'product' : 'products'}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
        {shop.description && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-content-secondary">{shop.description}</p>
        )}

        <div className="mt-6">
          <ContactButtons contacts={contacts} onContact={onContact} />
        </div>
      </div>
    </header>
  )
}
