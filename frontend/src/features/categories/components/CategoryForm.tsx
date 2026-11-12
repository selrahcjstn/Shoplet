import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Textarea from '../../../components/ui/Textarea'
import { ApiError, errorMessages } from '../../../lib/api-client'
import { isSlug, slugify } from '../../../lib/slug'
import { splitFieldErrors } from '../../auth/field-errors'
import type { ProductCategory } from '../../products/types'
import { createCategory, updateCategory } from '../api'

type Field = 'name' | 'slug' | 'description'

interface CategoryFormProps {
  shopId: string
  /** Present when editing; absent when adding a new category. */
  category?: ProductCategory
  onSaved: (category: ProductCategory) => void
  onCancel: () => void
}

export default function CategoryForm({ shopId, category, onSaved, onCancel }: CategoryFormProps) {
  const editing = Boolean(category)
  const [form, setForm] = useState({
    name: category?.name ?? '',
    slug: category?.slug ?? '',
    description: category?.description ?? '',
  })
  // While adding, the link follows the name until the seller edits it by hand.
  const [slugTouched, setSlugTouched] = useState(editing)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((current) => ({ ...current, name, slug: slugTouched ? current.slug : slugify(name, 120) }))
  }

  function validate(): Partial<Record<Field, string>> {
    const next: Partial<Record<Field, string>> = {}
    if (!form.name.trim()) next.name = 'Enter a name for your category.'
    if (!form.slug) next.slug = 'Enter a link for your category.'
    else if (!isSlug(form.slug)) next.slug = 'Use lowercase letters, numbers and single hyphens, like home-decor.'
    return next
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')

    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const description = form.description.trim()
    const input = {
      name: form.name.trim(),
      slug: form.slug,
      description: description || (editing ? null : undefined),
    }

    setLoading(true)
    try {
      onSaved(category ? await updateCategory(category.id, input) : await createCategory({ ...input, shopId }))
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors({ slug: 'That link is already used by another category. Try a different one.' })
      } else if (err instanceof ApiError && err.status === 400) {
        const { fields, general } = splitFieldErrors<Field>(err.messages, {
          name: ['name'],
          slug: ['slug'],
          description: ['description'],
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
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input label="Category name" value={form.name} error={errors.name} onChange={handleNameChange} maxLength={100} />

      <Textarea
        label="Description"
        hint="Optional. One line about what belongs here."
        rows={3}
        value={form.description}
        error={errors.description}
        onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
      />

      <Input
        label="Category link"
        hint={`Used in the address of the category page: ${form.slug || 'your-category'}`}
        value={form.slug}
        error={errors.slug}
        onChange={(e) => {
          setSlugTouched(true)
          setForm((current) => ({ ...current, slug: e.target.value.toLowerCase() }))
        }}
        maxLength={120}
      />

      {formError && <Alert tone="error">{formError}</Alert>}

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {loading ? 'Saving' : editing ? 'Save changes' : 'Add category'}
        </Button>
      </div>
    </form>
  )
}
