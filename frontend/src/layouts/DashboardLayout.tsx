import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { getMe } from '../features/auth/api'
import type { User } from '../features/auth/types'
import DashboardHeader from '../features/dashboard/components/DashboardHeader'
import Sidebar from '../features/dashboard/components/Sidebar'

/** Sidebar (256px) + header + page content. */
export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
  }, [])

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} user={user} />
      <div className="lg:pl-64">
        <DashboardHeader menuOpen={menuOpen} onMenuClick={() => setMenuOpen(true)} />
        <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
