export interface StoreShop {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  coverImageUrl: string | null
  accentColor: string | null
  announcement: string | null
  businessCategory: string | null
  isPublished: boolean
}

export interface StoreCategory {
  id: string
  name: string
  slug: string
}

export interface StoreImage {
  id: string
  imageUrl: string
  altText: string | null
}

export interface StoreProduct {
  id: string
  categoryId: string | null
  name: string
  slug: string
  description: string | null
  price: string
  availability: string
  isFeatured: boolean
  images: StoreImage[]
}

export interface StoreContact {
  id: string
  contactType: string
  contactValue: string
}

export interface Storefront {
  shop: StoreShop
  /** The shop is a draft and the viewer is its owner. */
  isPreview: boolean
  /** The viewer owns the shop, so their visits are not counted. */
  isOwner: boolean
  categories: StoreCategory[]
  products: StoreProduct[]
  contacts: StoreContact[]
}
