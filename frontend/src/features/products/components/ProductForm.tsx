import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Textarea from '../../../components/ui/Textarea'
import { ApiError, errorMessages } from '../../../lib/api-client'
import { isSlug, slugify } from '../../../lib/slug'
import { splitFieldErrors } from '../../auth/field-errors'
import {
  createProduct,
  createProductImage,
  deleteProductImage,
  updateProduct,
  updateProductImage,
} from '../api'
import { AVAILABILITY_OPTIONS, normalizeAvailability } from '../availability'
import type { Product, ProductCategory, ProductImage, ProductInput } from '../types'

type Field = 'name' | 'slug' | 'price' | 'description' | 'imageUrl'

interface FormState {
  name: string
  slug: string
  price: string
  availability: string
  categoryId: string
  description: string
  imageUrl: string
  isVisible: boolean
  isFeatured: boolean
}

interface ProductFormProps {
  shopId: string
  /** Present when editing; absent when adding a new product. */
  product?: Product
  /** The product's current main picture, if it has one. */
  image?: ProductImage
  categories: ProductCategory[]
  onSaved: (product: Product, image: ProductImage | null) => void
  onCancel: () => void
}

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value)
const isPrice = (value: string) => /^\d{1,10}(\.\d{1,2})?$/.test(value)

function initialState(product?: Product, image?: ProductImage): FormState {
  return {
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    price: product ? String(Number(product.price)) : '',
    availability: product ? normalizeAvailability(product.availability) : 'AVAILABLE',
    categoryId: product?.categoryId ?? '',
    description: product?.description ?? '',
    imageUrl: image?.imageUrl ?? '',
    isVisible: product?.isVisible ?? true,
    isFeatured: product?.isFeatured ?? false,
  }
}

interface ToggleProps {
  label: string
  hint: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Toggle({ label, hint, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-muted has-[:checked]:border-primary has-[:checked]:bg-primary-light/40">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-primary"
      />
      <span>
        <span className="block text-sm font-medium text-content">{label}</span>
        <span className="block text-sm text-content-secondary">{hint}</span>
      </span>
    </label>
  )
}

export default function ProductForm({ shopId, product, image, categories, onSaved, onCancel }: ProductFormProps) {
  const editing = Boolean(product)
  const [form, setForm] = useState<FormState>(() => initialState(product, image))
  // While adding, the link follows the name until the seller edits it by hand.
  const [slugTouched, setSlugTouched] = useState(editing)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }))

  const bind = (field: Field) => ({
    value: form[field],
    error: errors[field],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(field, e.target.value),
  })

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm((current) => ({ ...current, name, slug: slugTouched ? current.slug : slugify(name, 200) }))
  }

  function validate(): Partial<Record<Field, string>> {
    const next: Partial<Record<Field, string>> = {}
    if (!form.name.trim()) next.name = 'Enter a name for your product.'
    if (!form.slug) next.slug = 'Enter a link for your product.'
    else if (!isSlug(form.slug)) next.slug = 'Use lowercase letters, numbers and single hyphens, like soy-candle.'
    if (!form.price.trim()) next.price = 'Enter a price.'
    else if (!isPrice(form.price.trim())) next.price = 'Use numbers only, with up to 2 decimals, like 199.00.'
    if (form.imageUrl && !isHttpUrl(form.imageUrl)) next.imageUrl = 'Enter a full link that starts with http:// or https://.'
    return next
  }

  function toInput(): ProductInput {
    const description = form.description.trim()
    return {
      ...(editing ? {} : { shopId }),
      name: form.name.trim(),
      slug: form.slug,
      price: form.price.trim(),
      availability: form.availability,
      categoryId: form.categoryId || (editing ? null : undefined),
      description: description || (editing ? null : undefined),
      isVisible: form.isVisible,
      isFeatured: form.isFeatured,
    }
  }

  /** Keeps the product's main picture in step with the link field. */
  async function syncImage(productId: string): Promise<ProductImage | null> {
    const url = form.imageUrl.trim()
    if (!url) {
      if (image) await deleteProductImage(image.id)
      return null
    }
    if (!image) return createProductImage({ productId, imageUrl: url })
    if (image.imageUrl === url) return image
    return updateProductImage(image.id, { imageUrl: url })
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')

    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    try {
      const saved = product ? await updateProduct(product.id, toInput()) : await createProduct(toInput() as ProductInput)
      const savedImage = await syncImage(saved.id)
      onSaved(saved, savedImage)
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors({ slug: 'That link is already used by another product. Try a different one.' })
      } else if (err instanceof ApiError && err.status === 400) {
        const { fields, general } = splitFieldErrors<Field>(err.messages, {
          name: ['name'],
          slug: ['slug'],
          price: ['price'],
          description: ['description'],
          imageUrl: ['image url'],
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
      <Input label="Product name" value={form.name} error={errors.name} onChange={handleNameChange} maxLength={180} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Price (PHP)"
          inputMode="decimal"
          placeholder="199.00"
          {...bind('price')}
        />
        <Select label="Availability" value={form.availability} onChange={(e) => set('availability', e.target.value)}>
          {AVAILABILITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {categories.length > 0 && (
        <Select label="Category" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      )}

      <Textarea label="Description" hint="What it is, what it is made of, its size." rows={3} {...bind('description')} />

      <Input
        label="Photo link"
        type="url"
        placeholder="https://"
        hint="Optional. A square photo works best."
        {...bind('imageUrl')}
      />

      <Input
        label="Product link"
        hint={`Used in the address of the product page: ${form.slug || 'your-product'}`}
        value={form.slug}
        error={errors.slug}
        onChange={(e) => {
          setSlugTouched(true)
          set('slug', e.target.value.toLowerCase())
        }}
        maxLength={200}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label="Show in my shop"
          hint="Turn off to hide it from customers."
          checked={form.isVisible}
          onChange={(checked) => set('isVisible', checked)}
        />
        <Toggle
          label="Feature this product"
          hint="Highlights it on your page."
          checked={form.isFeatured}
          onChange={(checked) => set('isFeatured', checked)}
        />
      </div>

      {formError && <Alert tone="error">{formError}</Alert>}

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {loading ? 'Saving' : editing ? 'Save changes' : 'Add product'}
        </Button>
      </div>
    </form>
  )
}
