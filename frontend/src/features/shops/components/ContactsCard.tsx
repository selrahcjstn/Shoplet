import { Phone, Trash2 } from 'lucide-react'
import { useState, type SyntheticEvent } from 'react'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import SectionCard from '../../../components/ui/SectionCard'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import { errorMessages } from '../../../lib/api-client'
import { createShopContact, deleteShopContact } from '../api'
import type { ShopContact } from '../types'

const CONTACT_TYPES = [
  { value: 'phone', label: 'Phone', placeholder: '+63 917 123 4567' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: '+63 917 123 4567' },
  { value: 'messenger', label: 'Messenger', placeholder: 'm.me/yourshop' },
  { value: 'instagram', label: 'Instagram', placeholder: '@yourshop' },
  { value: 'facebook', label: 'Facebook', placeholder: 'facebook.com/yourshop' },
  { value: 'email', label: 'Email', placeholder: 'hello@yourshop.com' },
]

const labelFor = (type: string) => CONTACT_TYPES.find((t) => t.value === type)?.label ?? type

interface ContactsCardProps {
  shopId: string
  contacts: ShopContact[]
  onChange: (contacts: ShopContact[]) => void
}

export default function ContactsCard({ shopId, contacts, onChange }: ContactsCardProps) {
  const [type, setType] = useState(CONTACT_TYPES[0]!.value)
  const [value, setValue] = useState('')
  const [valueError, setValueError] = useState('')
  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleAdd(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (!value.trim()) {
      setValueError('Enter where customers can reach you.')
      return
    }
    setValueError('')
    setAdding(true)
    try {
      const created = await createShopContact({ shopId, contactType: type, contactValue: value.trim() })
      onChange([...contacts, created])
      setValue('')
    } catch (err) {
      setError(errorMessages(err)[0] ?? '')
    } finally {
      setAdding(false)
    }
  }

  async function handleRemove(contact: ShopContact) {
    setError('')
    setRemovingId(contact.id)
    try {
      await deleteShopContact(contact.id)
      onChange(contacts.filter((c) => c.id !== contact.id))
    } catch (err) {
      setError(errorMessages(err)[0] ?? '')
    } finally {
      setRemovingId(null)
    }
  }

  const placeholder = CONTACT_TYPES.find((t) => t.value === type)?.placeholder

  return (
    <SectionCard Icon={Phone} title="Contact details" description="Shown on your page so customers can message you.">
      {contacts.length === 0 ? (
        <p className="text-sm text-content-secondary">No contact details yet. Add at least one below.</p>
      ) : (
        <ul className="divide-y divide-border">
          {contacts.map((contact) => (
            <li key={contact.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-content">{labelFor(contact.contactType)}</p>
                <p className="truncate text-sm text-content-secondary">{contact.contactValue}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                loading={removingId === contact.id}
                onClick={() => handleRemove(contact)}
                aria-label={`Remove ${labelFor(contact.contactType)} ${contact.contactValue}`}
              >
                <Trash2 aria-hidden className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} noValidate className="mt-4 space-y-3 border-t border-border pt-4">
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
          {CONTACT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
        <Input
          label="Details"
          value={value}
          placeholder={placeholder}
          error={valueError}
          onChange={(e) => setValue(e.target.value)}
          maxLength={255}
        />
        {error && <Alert tone="error">{error}</Alert>}
        <Button type="submit" variant="secondary" loading={adding}>
          Add contact
        </Button>
      </form>
    </SectionCard>
  )
}
