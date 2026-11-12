import { Check, Circle, Sparkles } from 'lucide-react'
import SectionCard from '../../../components/ui/SectionCard'
import type { Shop } from '../types'

/** What makes a shop page feel finished. Reads the saved shop, so it updates after each save. */
export default function ProfileChecklist({ shop, contactCount }: { shop: Shop; contactCount: number }) {
  const items = [
    { label: 'Add a logo', done: Boolean(shop.logoUrl) },
    { label: 'Add a cover photo', done: Boolean(shop.coverImageUrl) },
    { label: 'Write a description', done: Boolean(shop.description) },
    { label: 'Choose a category', done: Boolean(shop.businessCategoryId) },
    { label: 'Add a way to reach you', done: contactCount > 0 },
  ]
  const doneCount = items.filter((item) => item.done).length

  return (
    <SectionCard Icon={Sparkles} title="Page polish" description={`${doneCount} of ${items.length} done`}>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-sm">
            {item.done ? (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-content-inverse">
                <Check aria-hidden className="size-3.5" />
              </span>
            ) : (
              <Circle aria-hidden className="size-5 shrink-0 text-border-strong" />
            )}
            <span className={item.done ? 'text-content-secondary' : 'font-medium text-content'}>
              {item.label}
              {item.done && <span className="sr-only"> (done)</span>}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
