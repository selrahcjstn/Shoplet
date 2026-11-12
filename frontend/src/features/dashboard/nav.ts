import { BarChart3, LayoutDashboard, Package, Store, Tags, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  Icon: LucideIcon
  /** Match the exact path only (so "Overview" is not active on every dashboard page). */
  end?: boolean
}

export interface NavGroup {
  /** Small heading above the group. Omit for the first group. */
  label?: string
  items: NavItem[]
}

/** Dashboard sidebar entries. Add a line here when a new dashboard page exists. */
export const NAV_GROUPS: NavGroup[] = [
  {
    items: [{ to: '/dashboard', label: 'Overview', Icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Your shop',
    items: [
      { to: '/dashboard/shop', label: 'My shop', Icon: Store },
      { to: '/dashboard/products', label: 'Products', Icon: Package },
      { to: '/dashboard/categories', label: 'Categories', Icon: Tags },
    ],
  },
  {
    label: 'Insights',
    items: [{ to: '/dashboard/analytics', label: 'Analytics', Icon: BarChart3 }],
  },
]

const ALL_ITEMS = NAV_GROUPS.flatMap((group) => group.items)

/** The page title for the current URL, used by the header. */
export function titleForPath(pathname: string): string {
  const match = ALL_ITEMS.find((item) => (item.end ? pathname === item.to : pathname.startsWith(item.to)))
  return match?.label ?? 'Dashboard'
}
