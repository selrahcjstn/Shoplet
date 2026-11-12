import { useEffect, useState } from 'react'
import PageHeader from '../../../components/layout/PageHeader'
import Card from '../../../components/ui/Card'
import Spinner from '../../../components/ui/Spinner'
import { getMe } from '../../auth/api'
import type { User } from '../../auth/types'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  return (
    <>
      <PageHeader
        title={user ? `Welcome, ${user.firstName}` : 'Dashboard'}
        description="Here is an overview of your store."
      />
      {!user && <Spinner />}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <Card>
          <p className="text-sm text-content-secondary">Account</p>
          <p className="mt-1 font-semibold text-content">{user?.email ?? '—'}</p>
        </Card>
        <Card>
          <p className="text-sm text-content-secondary">Role</p>
          <p className="mt-1 font-semibold text-content">{user?.role ?? '—'}</p>
        </Card>
      </div>
    </>
  )
}
