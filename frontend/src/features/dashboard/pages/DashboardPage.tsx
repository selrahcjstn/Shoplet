import { EyeOff, Package, Star, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../../components/layout/PageHeader'
import Alert from '../../../components/ui/Alert'
import { buttonStyles } from '../../../components/ui/button-styles'
import Spinner from '../../../components/ui/Spinner'
import { errorMessages } from '../../../lib/api-client'
import { getShopAnalytics } from '../../analytics/api'
import type { Analytics } from '../../analytics/types'
import { getMe } from '../../auth/api'
import type { User } from '../../auth/types'
import { getProducts } from '../../products/api'
import { isOutOfStock } from '../../products/availability'
import type { Product } from '../../products/types'
import { getShops } from '../../shops/api'
import type { Shop } from '../../shops/types'
import GettingStarted, { type SetupStep } from '../components/GettingStarted'
import PerformanceCard from '../components/PerformanceCard'
import RecentProducts from '../components/RecentProducts'
import ShopStatus from '../components/ShopStatus'
import StatCard from '../components/StatCard'
import WelcomeBanner from '../components/WelcomeBanner'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; user: User; shop: Shop | null; products: Product[]; analytics: Analytics | null }

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function summarize(shop: Shop | null, productCount: number) {
  if (!shop) return 'Open your shop to start adding products and sharing your link.'
  const products = `${productCount} ${productCount === 1 ? 'product' : 'products'}`
  return shop.isPublished
    ? `${shop.name} is live with ${products}.`
    : `${shop.name} is a draft with ${products}. Publish it when you are ready.`
}

export default function DashboardPage() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [greeting] = useState(getGreeting)

  useEffect(() => {
    let cancelled = false

    Promise.all([getMe(), getShops(), getProducts()])
      .then(async ([user, shops, allProducts]) => {
        const shop = shops.find((s) => s.ownerId === user.id) ?? null
        const products = shop ? allProducts.filter((p) => p.shopId === shop.id) : []
        // The numbers are a bonus: if they fail to load, the rest of the Overview still shows.
        const analytics = shop ? await getShopAnalytics(shop.id, 30).catch(() => null) : null
        if (!cancelled) setState({ status: 'ready', user, shop, products, analytics })
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', message: errorMessages(error)[0] ?? '' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') {
    return (
      <>
        <PageHeader title="Overview" />
        <Spinner label="Loading your overview" />
      </>
    )
  }

  if (state.status === 'error') {
    return (
      <>
        <PageHeader title="Overview" />
        <Alert tone="error" title="We could not load your overview">
          {state.message} Refresh the page to try again.
        </Alert>
      </>
    )
  }

  const { user, shop, products, analytics } = state
  const today = analytics?.daily[analytics.daily.length - 1]
  const highlights = today
    ? [
        `${today.storeViews.toLocaleString('en')} ${today.storeViews === 1 ? 'visit' : 'visits'} today`,
        `${today.contactClicks.toLocaleString('en')} contact ${today.contactClicks === 1 ? 'click' : 'clicks'} today`,
      ]
    : []
  const steps: SetupStep[] = [
    { label: 'Create your shop', hint: 'Pick a name and your own link.', done: shop !== null, to: '/dashboard/shop' },
    {
      label: 'Add your first product',
      hint: 'A photo, a price and a short description.',
      done: products.length > 0,
      to: '/dashboard/products',
    },
    {
      label: 'Publish your shop',
      hint: 'Let customers open your link.',
      done: shop?.isPublished === true,
      to: '/dashboard/shop',
    },
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      <WelcomeBanner
        greeting={greeting}
        name={user.firstName}
        summary={summarize(shop, products.length)}
        highlights={highlights}
        actions={
          shop ? (
            <>
              <Link to="/dashboard/products" className={buttonStyles({ size: 'lg' })}>
                Add a product
              </Link>
              <Link to="/dashboard/shop" className={buttonStyles({ size: 'lg', variant: 'outline' })}>
                Manage shop
              </Link>
            </>
          ) : (
            <Link to="/dashboard/shop" className={buttonStyles({ size: 'lg' })}>
              Create your shop
            </Link>
          )
        }
      />

      {analytics && <PerformanceCard analytics={analytics} />}

      {shop && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <StatCard label="Products" value={products.length} Icon={Package} hint="In your shop" />
          <StatCard
            label="Hidden"
            value={products.filter((p) => !p.isVisible).length}
            Icon={EyeOff}
            tone="neutral"
            hint="Not shown to customers"
          />
          <StatCard
            label="Featured"
            value={products.filter((p) => p.isFeatured).length}
            Icon={Star}
            tone="accent"
            hint="Highlighted on your page"
          />
          <StatCard
            label="Out of stock"
            value={products.filter((p) => isOutOfStock(p.availability)).length}
            Icon={XCircle}
            tone="error"
            hint="Customers see a label"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <RecentProducts products={products} />
        </div>
        <div className="space-y-6">
          {shop && <ShopStatus shop={shop} />}
          <GettingStarted steps={steps} />
        </div>
      </div>
    </div>
  )
}
