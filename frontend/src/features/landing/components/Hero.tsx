import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Container from '../../../components/layout/Container'
import { buttonStyles } from '../../../components/ui/button-styles'
import StorefrontPreview from './StorefrontPreview'

export default function Hero() {
  return (
    <section className="border-b border-border">
      <Container className="grid items-center gap-12 py-12 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <h1 className="rise text-h2 font-bold tracking-tight text-brand-ink md:text-h1 lg:text-display">
            Open your shop online and share it with one link.
          </h1>
          <p
            className="rise mt-5 max-w-xl text-lg text-content-secondary"
            style={{ '--delay': '120ms' } as CSSProperties}
          >
            Shoplet gives your small business a clean storefront. Add your products, set your prices, and let customers
            message you when they are ready to buy.
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ '--delay': '240ms' } as CSSProperties}>
            <Link to="/register" className={buttonStyles({ size: 'lg' })}>
              Create your shop
            </Link>
            <a href="#how-it-works" className={buttonStyles({ size: 'lg', variant: 'outline' })}>
              See how it works
            </a>
          </div>
          <p className="rise mt-6 text-sm text-content-secondary" style={{ '--delay': '360ms' } as CSSProperties}>
            Made for bakers, makers, and sellers who run the shop themselves.
          </p>
        </div>

        <StorefrontPreview />
      </Container>
    </section>
  )
}
