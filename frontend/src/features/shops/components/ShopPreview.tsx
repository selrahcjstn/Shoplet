import { Check, Copy, Eye, EyeOff, Megaphone, Phone } from 'lucide-react'
import { useState } from 'react'
import Badge from '../../../components/ui/Badge'
import type { Shop } from '../types'

interface ShopPreviewProps {
  shop: Shop
  contactCount: number
}

/** The top of the page: how the shop header looks to customers, built from the saved details. */
export default function ShopPreview({ shop, contactCount }: ShopPreviewProps) {
  const [copied, setCopied] = useState(false)
  const link = `shoplet/${shop.slug}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the link is still shown on screen.
    }
  }

  return (
    <section aria-label="Shop preview" className="overflow-hidden rounded-lg border border-border bg-surface">
      {/* Cover: the seller's photo, or their accent color with a soft dotted texture */}
      <div
        className="relative h-36 bg-primary-dark sm:h-48"
        style={shop.accentColor ? { backgroundColor: shop.accentColor } : undefined}
      >
        {shop.coverImageUrl ? (
          <img src={shop.coverImageUrl} alt="" className="size-full object-cover" />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)',
              backgroundSize: '22px 22px',
            }}
          />
        )}
      </div>

      <div className="px-6 pb-6 sm:px-8">
        <div className="-mt-10 flex flex-wrap items-end justify-between gap-3 sm:-mt-12">
          {shop.logoUrl ? (
            <img
              src={shop.logoUrl}
              alt={`${shop.name} logo`}
              className="size-20 rounded-2xl border-4 border-surface bg-surface object-cover sm:size-24"
            />
          ) : (
            <span
              aria-hidden
              className="flex size-20 items-center justify-center rounded-2xl border-4 border-surface bg-primary-light text-3xl font-bold text-primary-dark sm:size-24 sm:text-4xl"
            >
              {shop.name.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="pb-1">
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
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <h2 className="truncate text-h3 font-semibold tracking-tight text-brand-ink">{shop.name}</h2>
            <div className="mt-1 flex items-center gap-1">
              <p className="truncate text-sm text-content-secondary">
                shoplet/<span className="font-medium text-content">{shop.slug}</span>
              </p>
              <button
                type="button"
                onClick={copyLink}
                aria-label={copied ? 'Link copied' : 'Copy shop link'}
                title={copied ? 'Copied' : 'Copy link'}
                className="rounded-md p-1.5 text-content-muted transition-colors hover:bg-surface-muted hover:text-content"
              >
                {copied ? (
                  <Check aria-hidden className="size-4 text-success" />
                ) : (
                  <Copy aria-hidden className="size-4" />
                )}
              </button>
            </div>
          </div>
          <p className="flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1.5 text-sm text-content-secondary">
            <Phone aria-hidden className="size-4 text-content-muted" />
            {contactCount === 0
              ? 'No contact details yet'
              : `${contactCount} contact ${contactCount === 1 ? 'detail' : 'details'}`}
          </p>
        </div>

        {shop.description ? (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-content-secondary">{shop.description}</p>
        ) : (
          <p className="mt-4 text-sm text-content-muted">Add a description so customers know what you sell.</p>
        )}

        {shop.announcement && (
          <p className="mt-5 flex items-start gap-3 rounded-lg bg-accent/10 px-4 py-3 text-sm text-content">
            <Megaphone aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-dark" />
            {shop.announcement}
          </p>
        )}
      </div>
    </section>
  )
}
