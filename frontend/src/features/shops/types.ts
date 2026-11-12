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
