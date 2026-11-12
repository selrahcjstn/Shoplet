import { Link } from 'react-router-dom'
import Container from '../../../components/layout/Container'
import { buttonStyles } from '../../../components/ui/button-styles'

export default function FinalCta() {
  return (
    <section className="bg-primary-dark text-content-inverse">
      <Container className="flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center md:py-20">
        <div>
          <h2 className="text-h3 font-semibold tracking-tight md:text-h2">Ready to open your shop?</h2>
          <p className="mt-2 max-w-lg text-primary-light">Create your account and add your first product today.</p>
        </div>
        <Link
          to="/register"
          className={buttonStyles({
            size: 'lg',
            className: 'bg-surface !text-primary-dark hover:bg-primary-light active:bg-primary-light',
          })}
        >
          Create your shop
        </Link>
      </Container>
    </section>
  )
}
