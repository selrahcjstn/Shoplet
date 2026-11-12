import { ChevronDown } from 'lucide-react'
import Container from '../../../components/layout/Container'
import Reveal from '../../../components/ui/Reveal'

const QUESTIONS = [
  {
    q: 'Do I need my own website?',
    a: 'No. Your shop gets its own link. Put it in your bio, send it in a message, or print it on a flyer.',
  },
  {
    q: 'How do customers order?',
    a: 'They open a product and tap a contact button for Messenger, WhatsApp, phone, or email. You agree on payment and delivery with them directly.',
  },
  {
    q: 'Can I hide a product without deleting it?',
    a: 'Yes. Hide it while it is out of season or being restocked, and show it again with one tap.',
  },
  {
    q: 'Can I see who visits my shop?',
    a: 'You see how many people viewed your shop and each product, which contact buttons they tapped, and which days are busiest.',
  },
  {
    q: 'Can I make the page look like my brand?',
    a: 'Add your logo, a cover photo, an accent color and an announcement, such as holiday opening hours.',
  },
]

/** Native <details>, so it works with the keyboard and without any script. */
export default function Faq() {
  return (
    <section className="border-b border-border">
      <Reveal>
        <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <h2 className="rise text-h3 font-semibold tracking-tight text-brand-ink md:text-h2">
              Questions sellers ask
            </h2>
            <p className="mt-4 max-w-sm text-content-secondary">Short answers before you sign up.</p>
          </div>
          <div className="divide-y divide-border-strong border-y border-border-strong">
            {QUESTIONS.map(({ q, a }) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-ink [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown
                    aria-hidden
                    className="size-5 shrink-0 text-content-secondary transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 max-w-xl text-content-secondary">{a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Reveal>
    </section>
  )
}
