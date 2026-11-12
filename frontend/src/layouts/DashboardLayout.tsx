import { LayoutDashboard, LogOut, Menu, Store, X, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cn } from '../lib/cn'
import { clearToken } from '../lib/token'

// Add an entry here when a new dashboard page exists.
const NAV: Array<{ to: string; label: string; Icon: LucideIcon }> = [
  { to: '/dashboard', label: 'Overview', Icon: LayoutDashboard },
]

/** 256px sidebar on desktop, drawer on mobile. Header is 64px (56px on mobile). */
export default function DashboardLayout() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function logout() {
    clearToken()
    navigate('/login')
  }

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150',
      isActive
        ? 'bg-primary-light text-primary-dark'
        : 'text-content-secondary hover:bg-surface-muted hover:text-content',
    )

  return (
    <div className="min-h-screen">
      {open && (
        <div className="fixed inset-0 z-30 bg-brand-ink/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface p-4',
          'transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-6 flex h-10 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-brand-ink">
            <Store aria-hidden className="size-6 text-primary" />
            Shoplet
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-md p-2 text-content-secondary hover:bg-surface-muted lg:hidden"
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1" aria-label="Dashboard">
          {NAV.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={linkClasses} onClick={() => setOpen(false)}>
              <Icon aria-hidden className="size-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-border pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-content-secondary hover:bg-surface-muted hover:text-content"
          >
            <Store aria-hidden className="size-5" />
            View storefront
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-content-secondary hover:bg-surface-muted hover:text-content"
          >
            <LogOut aria-hidden className="size-5" />
            Log out
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-surface px-4 sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="-ml-2 rounded-md p-2 text-content-secondary hover:bg-surface-muted"
          >
            <Menu aria-hidden className="size-6" />
          </button>
          <span className="ml-2 font-bold text-brand-ink">Shoplet</span>
        </header>
        <main className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
