import { useEffect, useState } from 'react'
import { getMe } from '../api/auth'
import type { User } from '../types'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getMe().then(setUser).catch(() => setUser(null))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && <p className="mt-2 text-gray-600">Welcome, {user.firstName}.</p>}
    </div>
  )
}
