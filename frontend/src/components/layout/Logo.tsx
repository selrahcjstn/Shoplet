import { Link } from 'react-router-dom'
import logoMark from '../../assets/logo-mark.svg'
import { cn } from '../../lib/cn'

interface LogoProps {
  className?: string
  /** "light" is for dark backgrounds such as the dashboard sidebar. */
  tone?: 'dark' | 'light'
}

/** Shoplet mark + wordmark. Always links home. */
export default function Logo({ className, tone = 'dark' }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center gap-2 rounded-md text-lg font-bold tracking-tight',
        tone === 'light' ? 'text-content-inverse focus-visible:outline-white' : 'text-brand-ink',
        className,
      )}
    >
      <img src={logoMark} alt="" className="size-8" />
      Shoplet
    </Link>
  )
}
