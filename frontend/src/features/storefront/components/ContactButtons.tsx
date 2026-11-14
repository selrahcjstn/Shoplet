import { cn } from '../../../lib/cn'
import { contactLink, type ContactLink } from '../contact-links'
import type { StoreContact } from '../types'

interface ContactButtonsProps {
  contacts: StoreContact[]
  /** Pre-typed message for apps that support it, such as WhatsApp. */
  message?: string
  onContact: (link: ContactLink) => void
  /** "full" stretches the buttons across a narrow column, as in the product sheet. */
  layout?: 'row' | 'full'
}

/**
 * The first contact is the main call to action, filled with the shop's accent color.
 * The rest are quieter outline buttons.
 */
export default function ContactButtons({ contacts, message, onContact, layout = 'row' }: ContactButtonsProps) {
  if (contacts.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-2', layout === 'full' && 'flex-col')}>
      {contacts.map((contact, index) => {
        const link = contactLink(contact, message)
        const primary = index === 0
        return (
          <a
            key={contact.id}
            href={link.href}
            onClick={() => onContact(link)}
            {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className={cn(
              'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[filter,background-color] duration-150',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
              primary
                ? 'bg-[var(--shop-accent)] text-[var(--shop-on-accent)] hover:brightness-110'
                : 'border border-border-strong bg-surface text-content hover:bg-surface-muted',
            )}
          >
            <link.Icon aria-hidden className="size-4" />
            {primary ? link.action : link.label}
          </a>
        )
      })}
    </div>
  )
}
