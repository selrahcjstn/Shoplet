import { LogOut, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../../components/layout/Logo'
import Avatar from '../../../components/ui/Avatar'
import { cn } from '../../../lib/cn'
import { clearToken } from '../../../lib/token'
import type { User } from '../../auth/types'
import { NAV_GROUPS } from '../nav'

interface SidebarProps {
  open: boolean
  onClose: () => void
  user: User | null
}

const focus = 'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white'

/** 256px wide, deep green. Always visible on desktop; a slide-in drawer on smaller screens. */
export default function Sidebar({ open, onClose, user }: SidebarProps) {
  const navigate = useNavigate()

  function logout() {
    clearToken()
    navigate('/login')
  }

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          'fixed inset-0 z-30 bg-brand-ink/50 transition-opacity duration-200 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-brand-ink text-primary-light',
          'transition-[transform,visibility] duration-200 lg:visible lg:translate-x-0',
          // Hidden drawers are also removed from the tab order.
          open ? 'visible translate-x-0' : 'invisible -translate-x-full',
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-5 lg:h-16">
          <Logo tone="light" className={focus} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className={cn('rounded-md p-2 text-primary-light/70 hover:bg-white/10 hover:text-white lg:hidden', focus)}
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>

        <nav aria-label="Dashboard" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group, index) => (
            <div key={group.label ?? index}>
              {group.label && <p className="mb-2 px-3 text-xs font-medium text-primary-light/55">{group.label}</p>}
              <div className="space-y-1">
                {group.items.map(({ to, label, Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150',
                        focus,
                        isActive
                          ? 'bg-white/10 text-white before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-accent'
                          : 'text-primary-light/75 hover:bg-white/5 hover:text-white',
                      )
                    }
                  >
                    <Icon aria-hidden className="size-5 shrink-0" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="flex items-center gap-3 rounded-lg p-2">
            {user ? (
              <>
                <Avatar firstName={user.firstName} lastName={user.lastName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-primary-light/60">{user.email}</p>
                </div>
              </>
            ) : (
              <div aria-hidden className="h-10 flex-1 animate-pulse rounded-lg bg-white/5" />
            )}
            <button
              type="button"
              onClick={logout}
              aria-label="Log out"
              title="Log out"
              className={cn(
                'rounded-md p-2 text-primary-light/70 transition-colors hover:bg-white/10 hover:text-white',
                focus,
              )}
            >
              <LogOut aria-hidden className="size-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
