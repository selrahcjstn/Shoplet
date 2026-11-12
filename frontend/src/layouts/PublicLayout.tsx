import { Link, Outlet } from 'react-router-dom'
import Logo from '../components/layout/Logo'
import Container from '../components/layout/Container'
import { buttonStyles } from '../components/ui/button-styles'
import { isLoggedIn } from '../lib/token'

/** Minimal header for the public storefront and the auth screens. */
export default function PublicLayout() {
  const loggedIn = isLoggedIn()

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <Container className="flex h-14 items-center justify-between md:h-16">
          <Logo />
          <nav className="flex items-center gap-2">
            {loggedIn ? (
              <Link to="/dashboard" className={buttonStyles({ size: 'sm' })}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
                  Log in
                </Link>
                <Link to="/register" className={buttonStyles({ size: 'sm' })}>
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </Container>
      </header>
      <main>
        <Container className="py-8 md:py-12">
          <Outlet />
        </Container>
      </main>
    </div>
  )
}
