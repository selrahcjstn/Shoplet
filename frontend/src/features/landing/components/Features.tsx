import type { CSSProperties } from 'react'
import { BarChart3, Camera, Link2, MessageCircle, Smartphone, Tags, type LucideIcon } from 'lucide-react'
import Container from '../../../components/layout/Container'
import Reveal from '../../../components/ui/Reveal'

const FEATURES: Array<{ Icon: LucideIcon; title: string; text: string }> = [
  {
    Icon: Link2,
    title: 'Your own link',
    text: 'A short, stable address you can put in your bio or print on a flyer.',
  },
  {
    Icon: Camera,
    title: 'Product pages',
    text: 'Photos, price, description, and a clear availability label on every item.',
  },
  {
    Icon: MessageCircle,
    title: 'Contact buttons',
    text: 'Customers reach you through the channels you already use: Messenger, WhatsApp, phone, or email.',
  },
  {
    Icon: Tags,
    title: 'Categories',
    text: 'Group your products so customers find what they want quickly.',
  },
  {
    Icon: Smartphone,
    title: 'A simple dashboard',
    text: 'Add, edit, hide, or remove a product in a few taps, from your phone or your laptop.',
  },
  {
    Icon: BarChart3,
    title: 'Visitor counts',
    text: 'See how many people viewed your shop and tapped your contact buttons.',
  },
]

export default function Features() {
  return (
    <section id="whats-included" className="scroll-mt-16 border-b border-border">
      <Reveal>
        <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <h2 className="rise text-h3 font-semibold tracking-tight text-brand-ink md:text-h2">
              What your storefront includes
            </h2>
            <p className="mt-4 max-w-sm text-content-secondary">
              Everything a small shop needs to show what it sells and hear from customers. Nothing you have to figure
              out.
            </p>
          </div>

          <dl className="grid sm:grid-cols-2 sm:gap-x-10">
            {FEATURES.map(({ Icon, title, text }, index) => (
              <div
                key={title}
                className="rise flex gap-4 border-t border-border-strong py-6"
                style={{ '--delay': `${index * 90}ms` } as CSSProperties}
              >
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <dt className="font-semibold text-brand-ink">{title}</dt>
                  <dd className="mt-1 text-content-secondary">{text}</dd>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </Reveal>
    </section>
  )
}
