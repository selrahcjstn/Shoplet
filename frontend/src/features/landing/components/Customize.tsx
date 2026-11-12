import Container from '../../../components/layout/Container'
import HeroStall from '../../../components/illustrations/HeroStall'
import Reveal from '../../../components/ui/Reveal'

export default function Customize() {
  return (
    <section className="border-b border-border bg-primary-light">
      <Reveal>
        <Container className="grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
          <div
            role="img"
            aria-label="Illustration of a small market stall with an awning, baskets and a sign"
            className="mx-auto w-full max-w-md"
          >
            <HeroStall animate />
          </div>
          <div>
            <h2 className="rise text-h3 font-semibold tracking-tight text-brand-ink md:text-h2">
              It looks like your business, not ours
            </h2>
            <p className="mt-4 max-w-lg text-lg text-content-secondary">
              Add your logo, a cover photo, and an accent color so the page feels like your shop. Customers see your
              name first.
            </p>
            <p className="mt-3 max-w-lg text-content-secondary">
              Put your opening hours, address, and social links on the page so people know where to find you.
            </p>
          </div>
        </Container>
      </Reveal>
    </section>
  )
}
