import { Store } from 'lucide-react'
import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import SectionCard from '../../../components/ui/SectionCard'
import Select from '../../../components/ui/Select'
import Textarea from '../../../components/ui/Textarea'
import { ApiError, errorMessages } from '../../../lib/api-client'
import { isSlug, slugify } from '../../../lib/slug'
import { splitFieldErrors } from '../../auth/field-errors'
import { createShop, updateShop } from '../api'
import type { BusinessCategory, Shop, ShopInput } from '../types'

type Field =
  'name' | 'slug' | 'businessCategoryId' | 'description' | 'logoUrl' | 'coverImageUrl' | 'accentColor' | 'announcement'

type FormState = Record<Field, string>

interface ShopFormProps {
  /** Present when editing; absent when creating a new shop. */
  shop?: Shop
  categories: BusinessCategory[]
  onSaved: (shop: Shop) => void
}

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value)

function initialState(shop?: Shop): FormState {
  return {
    name: shop?.name ?? '',
    slug: shop?.slug ?? '',
    businessCategoryId: shop?.businessCategoryId ?? '',
    description: shop?.description ?? '',
    logoUrl: shop?.logoUrl ?? '',
    coverImageUrl: shop?.coverImageUrl ?? '',
    accentColor: shop?.accentColor ?? '',
    announcement: shop?.announcement ?? '',
  }
}

export default function ShopForm({ shop, categories, onSaved }: ShopFormProps) {
  const editing = Boolean(shop)
  const [form, setForm] = useState<FormState>(() => initialState(shop))
  // While creating, the link follows the shop name until the seller edits it by hand.
  const [slugTouched, setSlugTouched] = useState(editing)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  const bind = (field: Field) => ({
    value: form[field],
    error: errors[field],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setSaved(false)
      setForm((current) => ({ ...current, [field]: e.target.value }))
    },
  })

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setSaved(false)
    setForm((current) => ({ ...current, name, slug: slugTouched ? current.slug : slugify(name) }))
  }

  function validate(): Partial<Record<Field, string>> {
    const next: Partial<Record<Field, string>> = {}
    if (!form.name.trim()) next.name = 'Enter a name for your shop.'
    if (!form.slug) next.slug = 'Enter a link for your shop.'
    else if (!isSlug(form.slug)) next.slug = 'Use lowercase letters, numbers and single hyphens, like maple-and-co.'
    if (form.logoUrl && !isHttpUrl(form.logoUrl))
      next.logoUrl = 'Enter a full link that starts with http:// or https://.'
    if (form.coverImageUrl && !isHttpUrl(form.coverImageUrl))
      next.coverImageUrl = 'Enter a full link that starts with http:// or https://.'
    if (form.accentColor && !/^#[0-9a-fA-F]{6}$/.test(form.accentColor))
      next.accentColor = 'Enter a color like #176B5B, or leave it empty.'
    return next
  }

  function toInput(): ShopInput {
    // Creating: leave empty fields out. Editing: send null so an emptied field is cleared.
    const optional = (value: string) => (value.trim() ? value.trim() : editing ? null : undefined)
    return {
      name: form.name.trim(),
      slug: form.slug,
      businessCategoryId: form.businessCategoryId || (editing ? null : undefined),
      description: optional(form.description),
      logoUrl: optional(form.logoUrl),
      coverImageUrl: optional(form.coverImageUrl),
      accentColor: optional(form.accentColor),
      announcement: optional(form.announcement),
    }
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')
    setSaved(false)

    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    try {
      const result = shop ? await updateShop(shop.id, toInput()) : await createShop(toInput())
      setSaved(true)
      onSaved(result)
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors({ slug: 'That link is already taken. Try another one.' })
      } else if (err instanceof ApiError && err.status === 400) {
        const { fields, general } = splitFieldErrors<Field>(err.messages, {
          name: ['name'],
          slug: ['slug'],
          description: ['description'],
          logoUrl: ['logo url'],
          coverImageUrl: ['cover image url'],
          accentColor: ['accent color'],
          announcement: ['announcement'],
          businessCategoryId: ['business category'],
        })
        setErrors(fields)
        setFormError(general.join(' '))
      } else {
        setFormError(errorMessages(err)[0] ?? '')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard
      Icon={Store}
      title={editing ? 'Shop details' : 'Create your shop'}
      description={
        editing
          ? 'This is what customers see on your page.'
          : 'Pick a name and a link. You can change everything later.'
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input label="Shop name" value={form.name} error={errors.name} onChange={handleNameChange} maxLength={150} />

        <Input
          label="Shop link"
          hint={`Customers will find you at shoplet/${form.slug || 'your-shop'}`}
          {...bind('slug')}
          onChange={(e) => {
            setSlugTouched(true)
            setSaved(false)
            setForm((current) => ({ ...current, slug: e.target.value.toLowerCase() }))
          }}
          maxLength={180}
        />

        {categories.length > 0 && (
          <Select label="Category" {...bind('businessCategoryId')}>
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        )}

        <Textarea label="Description" hint="A short introduction to your business." {...bind('description')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Logo link" type="url" placeholder="https://" {...bind('logoUrl')} />
          <Input label="Cover photo link" type="url" placeholder="https://" {...bind('coverImageUrl')} />
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input label="Accent color" placeholder="#176B5B" hint="Optional. A hex color." {...bind('accentColor')} />
          </div>
          <span
            aria-hidden
            className="mb-7 size-11 shrink-0 rounded-md border border-border-strong bg-surface-muted"
            style={/^#[0-9a-fA-F]{6}$/.test(form.accentColor) ? { backgroundColor: form.accentColor } : undefined}
          />
        </div>

        <Textarea
          label="Announcement"
          hint="Optional. A short notice shown at the top of your page, like a holiday closure."
          rows={2}
          {...bind('announcement')}
        />

        {formError && <Alert tone="error">{formError}</Alert>}
        {saved && <Alert tone="success">{editing ? 'Your changes are saved.' : 'Your shop is created.'}</Alert>}

        <Button type="submit" size="lg" loading={loading}>
          {loading ? 'Saving' : editing ? 'Save changes' : 'Create shop'}
        </Button>
      </form>
    </SectionCard>
  )
}
