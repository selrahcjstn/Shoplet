export interface Product {
  id: string
  shopId: string
  categoryId: string | null
  name: string
  slug: string
  description: string | null
  /** Decimal string from the API, e.g. "199.00". */
  price: string
  availability: string
  isVisible: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}
