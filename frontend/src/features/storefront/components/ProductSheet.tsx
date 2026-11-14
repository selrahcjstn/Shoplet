import { Check, Link2 } from 'lucide-react'
import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import { cn } from '../../../lib/cn'
import { formatPrice } from '../../../lib/format'
import AvailabilityBadge from '../../products/components/AvailabilityBadge'
import type { ContactLink } from '../contact-links'
import type { StoreContact, StoreProduct } from '../types'
import ContactButtons from './ContactButtons'
import { ProductImage } from './StoreProductCard'

interface ProductSheetProps {
  product: StoreProduct | null
  categoryName?: string
  contacts: StoreContact[]
  onClose: () => void
  onContact: (link: ContactLink, product: StoreProduct) => void
  onCopyLink: (product: StoreProduct) => Promise<boolean>
}

/** One product up close: its photos, price, availability, details, and a way to ask about it. */
export default function ProductSheet({
  product,
  categoryName,
  contacts,
  onClose,
  onContact,
  onCopyLink,
}: ProductSheetProps) {
  return (
    <Modal open={product !== null} onClose={onClose} title={product?.name ?? ''} size="lg">
      {/* key resets the chosen photo when another product opens */}
      {product && (
        <SheetBody
          key={product.id}
          product={product}
          categoryName={categoryName}
          contacts={contacts}
          onContact={onContact}
          onCopyLink={onCopyLink}
        />
      )}
    </Modal>
  )
}

function SheetBody({
  product,
  categoryName,
  contacts,
  onContact,
  onCopyLink,
}: Omit<ProductSheetProps, 'product' | 'onClose'> & { product: StoreProduct }) {
  const [shown, setShown] = useState(0)
  const [copied, setCopied] = useState(false)
  const price = formatPrice(product.price)
  // Shown with the main photo; the others become thumbnails.
  const ordered = [product.images[shown], ...product.images.filter((_, index) => index !== shown)].filter(Boolean)
  const message = `Hi! I'm interested in "${product.name}" (${price}). Is it available?`

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <ProductImage
          product={{ ...product, images: ordered as StoreProduct['images'] }}
          className="aspect-square rounded-2xl"
        />
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setShown(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-pressed={index === shown}
                className={cn(
                  'size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors',
                  index === shown ? 'border-[var(--shop-accent)]' : 'border-transparent opacity-70 hover:opacity-100',
                )}
              >
                <img src={image.imageUrl} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {categoryName && <p className="text-sm font-medium text-content-secondary">{categoryName}</p>}
        <p className="mt-1 text-h3 font-bold tracking-tight text-brand-ink">{price}</p>
        <div className="mt-2">
          <AvailabilityBadge availability={product.availability} />
        </div>
        {product.description ? (
          <p className="mt-5 whitespace-pre-line leading-relaxed text-content-secondary">{product.description}</p>
        ) : (
          <p className="mt-5 text-content-muted">Ask the shop for more details about this product.</p>
        )}

        <div className="mt-auto pt-6">
          {contacts.length > 0 ? (
            <>
              <p className="mb-3 text-sm font-semibold text-brand-ink">Ask about this product</p>
              <ContactButtons
                contacts={contacts}
                message={message}
                onContact={(link) => onContact(link, product)}
                layout="full"
              />
            </>
          ) : (
            <p className="rounded-xl bg-surface-muted p-4 text-sm text-content-secondary">
              This shop has not added contact details yet.
            </p>
          )}
          <button
            type="button"
            onClick={async () => {
              if (await onCopyLink(product)) {
                setCopied(true)
                window.setTimeout(() => setCopied(false), 2000)
              }
            }}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-content-secondary hover:text-content"
          >
            {copied ? <Check aria-hidden className="size-4 text-success" /> : <Link2 aria-hidden className="size-4" />}
            {copied ? 'Link copied' : 'Copy link to this product'}
          </button>
        </div>
      </div>
    </div>
  )
}
