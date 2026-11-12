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

/** Fields a seller can set. On update, `null` clears an optional field. */
export interface ProductInput {
  shopId?: string
  categoryId?: string | null
  name: string
  slug: string
  description?: string | null
  price: string
  availability: string
  isVisible: boolean
  isFeatured: boolean
}

export interface ProductImage {
  id: string
  productId: string
  imageUrl: string
  altText: string | null
  displayOrder: number
}

export interface ProductCategory {
  id: string
  shopId: string
  name: string
  slug: string
  description: string | null
}
