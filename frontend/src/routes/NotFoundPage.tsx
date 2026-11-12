import { Link } from 'react-router-dom'
import { buttonStyles } from '../components/ui/button-styles'

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="mt-2 text-h3 font-semibold text-brand-ink">Page not found</h1>
      <p className="mt-1 text-content-secondary">The page you are looking for does not exist.</p>
      <Link to="/" className={buttonStyles({ className: 'mt-6' })}>
        Back to home
      </Link>
    </div>
  )
}
