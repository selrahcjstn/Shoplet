import { Link } from 'react-router-dom'
import HeroStall from '../../../components/illustrations/HeroStall'
import { buttonStyles } from '../../../components/ui/button-styles'

/** Same page for "no such shop" and "not published yet", so drafts stay private. */
export default function StoreNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <div className="w-64 opacity-60 grayscale">
        <HeroStall />
      </div>
      <h1 className="mt-8 text-h3 font-bold tracking-tight text-brand-ink">This shop is not open</h1>
      <p className="mt-3 text-content-secondary">
        The link may be mistyped, or the shop has not been published yet. Check the address with the seller.
      </p>
      <Link to="/" className={buttonStyles({ variant: 'outline', className: 'mt-8' })}>
        Go to Shoplet
      </Link>
    </main>
  )
}
