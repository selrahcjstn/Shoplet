import { Camera, Check, Copy, ExternalLink, Eye, EyeOff, Megaphone, Phone, Trash2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import Badge from '../../../components/ui/Badge'
import { errorMessages } from '../../../lib/api-client'
import { cn } from '../../../lib/cn'
import { shopPath, shopUrl, shopUrlLabel } from '../../../lib/shop-url'
import { checkImage, uploadImage } from '../../../lib/upload'
import { updateShop } from '../api'
import type { Shop } from '../types'

interface ShopPreviewProps {
  shop: Shop
  contactCount: number
  /** Called with the saved shop after the cover or logo changes. */
  onChange: (shop: Shop) => void
}

type Photo = 'cover' | 'logo'

// Hidden until hover or keyboard focus; always shown on touch screens, which have no hover.
const revealOnHover =
  'opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100'

const pillButton =
  'inline-flex h-10 items-center gap-2 rounded-full bg-surface/95 px-4 text-sm font-semibold text-brand-ink shadow-md transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/**
 * The shop header as customers see it. Like a social profile, the cover and logo are edited right
 * here: hover to darken them, then change or remove the photo. Changes save straight away.
 */
export default function ShopPreview({ shop, contactCount, onChange }: ShopPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState<{ photo: Photo; progress: number } | null>(null)
  const [error, setError] = useState('')
  const coverInput = useRef<HTMLInputElement>(null)
  const logoInput = useRef<HTMLInputElement>(null)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shopUrl(shop.slug))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked; the link is still shown on screen.
    }
  }

  async function save(photo: Photo, url: string | null) {
    onChange(await updateShop(shop.id, photo === 'cover' ? { coverImageUrl: url } : { logoUrl: url }))
  }

  async function handleFile(photo: Photo, file: File | undefined) {
    if (!file) return
    const problem = checkImage(file)
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setBusy({ photo, progress: 0 })
    try {
      const url = await uploadImage(file, photo, (progress) => setBusy({ photo, progress }))
      await save(photo, url)
    } catch (err) {
      setError(err instanceof Error && !('status' in err) ? err.message : (errorMessages(err)[0] ?? ''))
    } finally {
      setBusy(null)
      const input = photo === 'cover' ? coverInput.current : logoInput.current
      if (input) input.value = ''
    }
  }

  async function remove(photo: Photo) {
    setError('')
    setBusy({ photo, progress: 100 })
    try {
      await save(photo, null)
    } catch (err) {
      setError(errorMessages(err)[0] ?? '')
    } finally {
      setBusy(null)
    }
  }

  const coverBusy = busy?.photo === 'cover'
  const logoBusy = busy?.photo === 'logo'

  return (
    <section aria-label="Shop preview" className="overflow-hidden rounded-lg border border-border bg-surface">
      {(['cover', 'logo'] as const).map((photo) => (
        <input
          key={photo}
          ref={photo === 'cover' ? coverInput : logoInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => handleFile(photo, e.target.files?.[0])}
        />
      ))}

      {/* Cover: the seller's photo, or their accent color with a soft dotted texture */}
      <div
        className="group relative h-36 bg-primary-dark sm:h-52"
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

        <div
          className={cn(
            'absolute inset-0 flex items-end justify-end p-3 transition-colors duration-200 sm:p-4',
            coverBusy ? 'bg-black/50' : 'bg-black/0 group-hover:bg-black/40 group-focus-within:bg-black/40',
          )}
        >
          {coverBusy ? (
            <UploadProgress progress={busy.progress} />
          ) : (
            <div className={cn('flex gap-2', revealOnHover)}>
              {shop.coverImageUrl && (
                <button
                  type="button"
                  onClick={() => remove('cover')}
                  aria-label="Remove cover photo"
                  className={cn(pillButton, 'px-3')}
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              )}
              <button type="button" onClick={() => coverInput.current?.click()} className={pillButton}>
                <Camera aria-hidden className="size-4" />
                {shop.coverImageUrl ? 'Change cover photo' : 'Add cover photo'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative px-6 pb-6 sm:px-8">
        <div className="-mt-10 flex flex-wrap items-end justify-between gap-3 sm:-mt-12">
          {/* Logo: the whole tile is the button, darkening on hover with a camera in the middle */}
          <div className="group relative">
            <button
              type="button"
              onClick={() => logoInput.current?.click()}
              aria-label={shop.logoUrl ? 'Change logo' : 'Add logo'}
              className="relative block size-20 overflow-hidden rounded-2xl border-4 border-surface bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-24"
            >
              {shop.logoUrl ? (
                <img src={shop.logoUrl} alt={`${shop.name} logo`} className="size-full object-cover" />
              ) : (
                <span
                  aria-hidden
                  className="flex size-full items-center justify-center bg-primary-light text-3xl font-bold text-primary-dark sm:text-4xl"
                >
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span
                aria-hidden
                className={cn(
                  'absolute inset-0 flex items-center justify-center text-white transition-colors duration-200',
                  logoBusy ? 'bg-black/55' : 'bg-black/0 group-hover:bg-black/45 group-focus-within:bg-black/45',
                )}
              >
                {logoBusy ? (
                  <span className="text-xs font-semibold">{busy.progress}%</span>
                ) : (
                  <Camera className={cn('size-6', revealOnHover)} />
                )}
              </span>
            </button>
            {shop.logoUrl && !logoBusy && (
              <button
                type="button"
                onClick={() => remove('logo')}
                aria-label="Remove logo"
                className={cn(
                  'absolute -right-1.5 -top-1.5 flex size-7 items-center justify-center rounded-full border border-border bg-surface text-content-secondary shadow-sm hover:text-error',
                  revealOnHover,
                )}
              >
                <X aria-hidden className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pb-1">
            <a
              href={shopPath(shop.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 text-sm font-medium text-content transition-colors hover:bg-surface-muted"
            >
              <ExternalLink aria-hidden className="size-3.5" />
              {shop.isPublished ? 'View shop' : 'Preview'}
            </a>
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

        {error && (
          <p role="alert" className="mt-3 text-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <h2 className="truncate text-h3 font-semibold tracking-tight text-brand-ink">{shop.name}</h2>
            <div className="mt-1 flex items-center gap-1">
              <p className="truncate text-sm text-content-secondary">{shopUrlLabel(shop.slug)}</p>
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
          <p className="mt-5 flex items-start gap-3 rounded-lg bg-warning-bg px-4 py-3 text-sm text-content">
            <Megaphone aria-hidden className="mt-0.5 size-4 shrink-0 text-warning" />
            {shop.announcement}
          </p>
        )}
      </div>
    </section>
  )
}

function UploadProgress({ progress }: { progress: number }) {
  return (
    <div role="status" aria-live="polite" className="m-auto w-48 rounded-full bg-surface/95 px-4 py-2 shadow-md">
      <p className="text-center text-sm font-semibold text-brand-ink">
        {progress < 100 ? `Uploading ${progress}%` : 'Saving'}
      </p>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
