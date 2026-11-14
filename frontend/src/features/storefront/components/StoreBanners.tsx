import { EyeOff, Megaphone, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

/** The shop's own notice, shown across the very top in its accent color. */
export function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="bg-[var(--shop-accent)] text-[var(--shop-on-accent)]">
      <p className="mx-auto flex max-w-[1120px] items-center justify-center gap-2 px-4 py-2.5 text-center text-sm font-medium">
        <Megaphone aria-hidden className="size-4 shrink-0" />
        {text}
      </p>
    </div>
  )
}

/** Shown only to the owner, so they know what customers can and cannot see. */
export function OwnerBar({ isPreview }: { isPreview: boolean }) {
  return (
    <div className={isPreview ? 'bg-warning-bg text-warning' : 'bg-brand-ink text-primary-light'}>
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-2.5 text-sm">
        <p className="flex items-center gap-2 font-medium">
          {isPreview ? <EyeOff aria-hidden className="size-4" /> : <Store aria-hidden className="size-4" />}
          {isPreview
            ? 'Only you can see this page. Publish your shop to share it.'
            : 'This is your shop as customers see it. Your own visits are not counted.'}
        </p>
        <Link
          to="/dashboard/shop"
          className={
            isPreview
              ? 'font-semibold underline underline-offset-2'
              : 'font-semibold text-white underline underline-offset-2'
          }
        >
          {isPreview ? 'Go to My shop' : 'Back to dashboard'}
        </Link>
      </div>
    </div>
  )
}
