export interface Shop {
  id: string
  ownerId: string
  businessCategoryId: string | null
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  coverImageUrl: string | null
  accentColor: string | null
  announcement: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

/** Fields a seller can set. On update, `null` clears an optional field. */
export interface ShopInput {
  name: string
  slug: string
  businessCategoryId?: string | null
  description?: string | null
  logoUrl?: string | null
  coverImageUrl?: string | null
  accentColor?: string | null
  announcement?: string | null
}

export interface BusinessCategory {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface ShopContact {
  id: string
  shopId: string
  contactType: string
  contactValue: string
}
