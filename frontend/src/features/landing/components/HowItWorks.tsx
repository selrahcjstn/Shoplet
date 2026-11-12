import Container from '../../../components/layout/Container'
import Reveal from '../../../components/ui/Reveal'
import { ProductsArt, ShareArt, SignUpArt } from './StepArt'

const STEPS = [
  {
    title: 'Create your account',
    text: 'Sign up with your email and name your shop. Your storefront gets its own link right away.',
    Art: SignUpArt,
  },
  {
    title: 'Add your products',
    text: 'Upload photos, set prices, and mark each item as available, made to order, or out of stock.',
    Art: ProductsArt,
  },
  {
    title: 'Share your link',
    text: 'Send it to customers on Messenger, WhatsApp, or Instagram. They browse and message you from the same page.',
    Art: ShareArt,
  },
]

/** A real sequence, so the numbers carry meaning. */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-b border-border">
      <Reveal>
        <Container className="py-16 md:py-24">
          <h2 className="rise max-w-xl text-h3 font-semibold tracking-tight text-brand-ink md:text-h2">
            From sign-up to sharing in three steps
          </h2>
          <ol className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map(({ title, text, Art }, index) => (
              <li key={title}>
                <Art />
                <div className="mt-6 border-t-2 border-brand-ink pt-5">
                  <span className="text-h3 font-bold text-primary">{index + 1}</span>
                  <h3 className="mt-3 text-h4 font-semibold text-brand-ink">{title}</h3>
                  <p className="mt-2 max-w-sm text-content-secondary">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Reveal>
    </section>
  )
}
