import { Link } from 'react-router-dom'
import logoMark from '../../../assets/logo-mark.svg'
import { contactLink, type ContactLink } from '../contact-links'
import type { StoreContact, StoreShop } from '../types'

interface StoreFooterProps {
  shop: StoreShop
  contacts: StoreContact[]
  onContact: (link: ContactLink) => void
}

export default function StoreFooter({ shop, contacts, onContact }: StoreFooterProps) {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1120px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div>
          <p className="text-h4 font-semibold text-brand-ink">{shop.name}</p>
          {shop.description && <p className="mt-2 max-w-sm text-sm text-content-secondary">{shop.description}</p>}
        </div>
        {contacts.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-brand-ink">Get in touch</p>
            <ul className="mt-3 space-y-2">
              {contacts.map((contact) => {
                const link = contactLink(contact)
                return (
                  <li key={contact.id}>
                    <a
                      href={link.href}
                      onClick={() => onContact(link)}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="inline-flex items-center gap-3 text-sm text-content-secondary hover:text-content"
                    >
                      <span className="flex size-8 items-center justify-center rounded-full bg-surface-muted">
                        <link.Icon aria-hidden className="size-4" />
                      </span>
                      <span>
                        <span className="font-medium text-content">{link.label}</span> · {contact.contactValue}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-content-secondary sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 hover:text-content">
            <img src={logoMark} alt="" className="size-5" />
            Made with Shoplet
          </Link>
          <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
            Open your own shop
          </Link>
        </div>
      </div>
    </footer>
  )
}
