import { Link } from 'react-router-dom'
import logoMark from '../../assets/logo-mark.svg'
import { cn } from '../../lib/cn'

/** Shoplet mark + wordmark. Always links home. */
export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('inline-flex items-center gap-2 text-lg font-bold tracking-tight text-brand-ink', className)}
    >
      <img src={logoMark} alt="" className="size-8" />
      Shoplet
    </Link>
  )
}
