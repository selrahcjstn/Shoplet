// Shapes returned by the backend API (mirror the backend response DTOs).

export type UserRole = 'SELLER' | 'ADMIN'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: 'Bearer'
  user: User
}

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

export interface Product {
  id: string
  shopId: string
  categoryId: string | null
  name: string
  slug: string
  description: string | null
  price: string
  availability: string
  isVisible: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}
