import { MousePointerClick } from 'lucide-react'
import SectionCard from '../../../components/ui/SectionCard'
import type { ContactType } from '../types'

const LABELS: Record<string, string> = {
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  messenger: 'Messenger',
  instagram: 'Instagram',
  facebook: 'Facebook',
  email: 'Email',
}

const labelFor = (type: string) => LABELS[type] ?? type

/** Which contact method customers chose, as a share of all clicks. */
export default function ContactBreakdown({ contacts }: { contacts: ContactType[] }) {
  const total = contacts.reduce((sum, c) => sum + c.clicks, 0)

  return (
    <SectionCard
      className="h-full"
      Icon={MousePointerClick}
      title="How customers reach you"
      description="Contact clicks by method."
    >
      {contacts.length === 0 ? (
        <p className="text-sm text-content-secondary">
          No contact clicks yet. Make sure your contact details are filled in on My shop.
        </p>
      ) : (
        <ul className="space-y-4">
          {contacts.map((contact) => {
            const share = Math.round((contact.clicks / total) * 100)
            return (
              <li key={contact.contactType}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium text-content">{labelFor(contact.contactType)}</p>
                  <p className="text-sm text-content-secondary">
                    <span className="font-medium text-content">{contact.clicks.toLocaleString('en')}</span> · {share}%
                  </p>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${share}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </SectionCard>
  )
}
