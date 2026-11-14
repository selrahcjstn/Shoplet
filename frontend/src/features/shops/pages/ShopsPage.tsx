import { Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../../components/layout/PageHeader'
import Alert from '../../../components/ui/Alert'
import Card from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import Spinner from '../../../components/ui/Spinner'
import { errorMessages } from '../../../lib/api-client'
import { shopPath } from '../../../lib/shop-url'
import { getShops } from '../api'
import type { Shop } from '../types'

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getShops()
      .then((all) => setShops(all.filter((shop) => shop.isPublished)))
      .catch((e) => setError(errorMessages(e)[0] ?? ''))
  }, [])

  return (
    <>
      <PageHeader title="Discover shops" description="Browse independent stores on Shoplet." />
      {error && <Alert tone="error">{error}</Alert>}
      {!shops && !error && <Spinner label="Loading shops" />}
      {shops?.length === 0 && (
        <EmptyState
          icon={<Store aria-hidden className="size-8" />}
          title="No shops yet"
          description="Be the first to open a store."
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {shops?.map((shop) => (
          <Link key={shop.id} to={shopPath(shop.slug)} className="block rounded-lg transition-colors">
            <Card className="h-full hover:border-border-strong">
              <h2 className="text-h4 font-semibold text-brand-ink">{shop.name}</h2>
              {shop.description && (
                <p className="mt-1 line-clamp-2 text-sm text-content-secondary">{shop.description}</p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
