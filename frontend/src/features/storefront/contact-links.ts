import { AtSign, Mail, MessageCircle, MessageSquare, Phone, Users, type LucideIcon } from 'lucide-react'
import type { StoreContact } from './types'

export interface ContactLink {
  type: string
  label: string
  /** "Message on WhatsApp", used on buttons. */
  action: string
  href: string
  Icon: LucideIcon
  /** Opens another site, so it gets a new tab. Phone and email open an app instead. */
  external: boolean
}

const digits = (value: string) => value.replace(/[^\d+]/g, '')
const withProtocol = (value: string) => (/^https?:\/\//i.test(value) ? value : `https://${value}`)

/**
 * Turns a saved contact into a link that opens the right app. When a message is given, the apps that
 * support it (WhatsApp, email) open with that text already typed.
 */
export function contactLink(contact: StoreContact, message?: string): ContactLink {
  const value = contact.contactValue.trim()
  const text = message ? encodeURIComponent(message) : ''

  switch (contact.contactType) {
    case 'whatsapp':
      return {
        type: 'whatsapp',
        label: 'WhatsApp',
        action: 'Message on WhatsApp',
        href: `https://wa.me/${digits(value).replace(/^\+/, '')}${text ? `?text=${text}` : ''}`,
        Icon: MessageCircle,
        external: true,
      }
    case 'messenger':
      return {
        type: 'messenger',
        label: 'Messenger',
        action: 'Message on Messenger',
        href: /m\.me|messenger\.com|facebook\.com/i.test(value) ? withProtocol(value) : `https://m.me/${value}`,
        Icon: MessageSquare,
        external: true,
      }
    case 'instagram':
      return {
        type: 'instagram',
        label: 'Instagram',
        action: 'Message on Instagram',
        href: /instagram\.com/i.test(value) ? withProtocol(value) : `https://instagram.com/${value.replace(/^@/, '')}`,
        Icon: AtSign,
        external: true,
      }
    case 'facebook':
      return {
        type: 'facebook',
        label: 'Facebook',
        action: 'Open Facebook page',
        href: /facebook\.com|fb\.com/i.test(value) ? withProtocol(value) : `https://facebook.com/${value}`,
        Icon: Users,
        external: true,
      }
    case 'email':
      return {
        type: 'email',
        label: 'Email',
        action: 'Send an email',
        href: `mailto:${value}${text ? `?body=${text}` : ''}`,
        Icon: Mail,
        external: false,
      }
    case 'phone':
    default:
      return {
        type: contact.contactType,
        label: contact.contactType === 'phone' ? 'Phone' : contact.contactType,
        action: 'Call',
        href: `tel:${digits(value)}`,
        Icon: Phone,
        external: false,
      }
  }
}

// Chat apps first: they are how most customers in a small shop prefer to ask.
const PRIORITY = ['whatsapp', 'messenger', 'instagram', 'phone', 'email', 'facebook']

export const sortContacts = (contacts: StoreContact[]) =>
  [...contacts].sort((a, b) => {
    const rank = (type: string) => (PRIORITY.indexOf(type) === -1 ? PRIORITY.length : PRIORITY.indexOf(type))
    return rank(a.contactType) - rank(b.contactType)
  })
