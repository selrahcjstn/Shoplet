import { Menu } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { titleForPath } from '../nav'

interface DashboardHeaderProps {
  menuOpen: boolean
  onMenuClick: () => void
}

const formatToday = () =>
  new Intl.DateTimeFormat('en-PH', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())

/** 64px tall on desktop, 56px on mobile. Current page on the left, today's date on the right. */
export default function DashboardHeader({ menuOpen, onMenuClick }: DashboardHeaderProps) {
  const { pathname } = useLocation()
  const [today] = useState(formatToday)

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur sm:px-6 lg:h-16 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="dashboard-sidebar"
        className="-ml-2 rounded-md p-2 text-content-secondary hover:bg-surface-muted lg:hidden"
      >
        <Menu aria-hidden className="size-6" />
      </button>

      <p className="text-sm font-semibold text-brand-ink">{titleForPath(pathname)}</p>
      <p className="ml-auto text-sm text-content-secondary">{today}</p>
    </header>
  )
}
