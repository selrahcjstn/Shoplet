import type { CSSProperties } from 'react'
import candle from '../../../assets/product-candle.svg'
import mug from '../../../assets/product-mug.svg'
import plant from '../../../assets/product-plant.svg'
import tote from '../../../assets/product-tote.svg'
import Container from '../../../components/layout/Container'
import Reveal from '../../../components/ui/Reveal'

/** Delay for one piece of an entrance (see .build in index.css). */
const at = (ms: number) => ({ '--d': `${ms}ms`, '--delay': `${ms}ms` }) as CSSProperties

const SELLERS = [
  {
    image: candle,
    title: 'Candle and soap makers',
    text: 'Small batches, seasonal scents, and a line of regulars who reorder.',
  },
  {
    image: mug,
    title: 'Potters and ceramic artists',
    text: 'One-of-a-kind pieces with a clear "made to order" label when needed.',
  },
  {
    image: plant,
    title: 'Plant and flower sellers',
    text: 'Mark what is in stock today and what is coming next week.',
  },
  {
    image: tote,
    title: 'Sewists and bag makers',
    text: 'Show every color and size, and let people ask about custom orders.',
  },
]

export default function WhoFor() {
  return (
    <section className="border-b border-border">
      <Reveal>
        <Container className="py-16 md:py-24">
          <h2 className="rise max-w-xl text-h3 font-semibold tracking-tight text-brand-ink md:text-h2">
            Built for people who sell what they make
          </h2>
          <p className="mt-4 max-w-xl text-lg text-content-secondary">
            If you run the shop yourself, from the photos to the packing, Shoplet keeps the online part simple.
          </p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SELLERS.map(({ image, title, text }, index) => (
              <li
                key={title}
                className="build build-rise overflow-hidden rounded-xl border border-border bg-surface"
                style={at(index * 120)}
              >
                <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <h3 className="font-semibold text-brand-ink">{title}</h3>
                  <p className="mt-1.5 text-sm text-content-secondary">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Reveal>
    </section>
  )
}
