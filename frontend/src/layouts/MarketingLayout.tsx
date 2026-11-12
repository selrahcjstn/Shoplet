import { Link, Outlet } from 'react-router-dom'
import Container from '../components/layout/Container'
import Logo from '../components/layout/Logo'
import { buttonStyles } from '../components/ui/button-styles'

const YEAR = new Date().getFullYear()

/** Header and footer for the landing page. Sections inside manage their own width and spacing. */
export default function MarketingLayout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <Container className="flex h-14 items-center justify-between md:h-16">
          <Logo />
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
            <a
              href="#how-it-works"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-content-secondary hover:text-content md:block"
            >
              How it works
            </a>
            <a
              href="#whats-included"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-content-secondary hover:text-content md:block"
            >
              What is included
            </a>
            <Link to="/login" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
              Log in
            </Link>
            <Link to="/register" className={buttonStyles({ size: 'sm' })}>
              Create your shop
            </Link>
          </nav>
        </Container>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-border bg-surface">
        <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo />
            <p className="mt-2 text-sm text-content-secondary">A simple storefront for small businesses.</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/login" className="text-content-secondary hover:text-content">
              Log in
            </Link>
            <Link to="/register" className="text-content-secondary hover:text-content">
              Create your shop
            </Link>
            <span className="text-content-muted">© {YEAR} Shoplet</span>
          </div>
        </Container>
      </footer>
    </div>
  )
}
