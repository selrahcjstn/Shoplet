import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getShops } from '../api/shops'
import type { Shop } from '../types'

export default function HomePage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    getShops()
      .then(setShops)
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Shops</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <Link
            key={shop.id}
            to={`/shops/${shop.id}`}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow"
          >
            <h2 className="font-semibold">{shop.name}</h2>
            <p className="text-sm text-gray-500">{shop.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
