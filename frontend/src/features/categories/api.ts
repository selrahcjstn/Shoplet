import { api } from '../../lib/api-client'
import type { ProductCategory } from '../products/types'

export interface CategoryInput {
  shopId?: string
  name: string
  slug: string
  description?: string | null
}

export const createCategory = (input: CategoryInput) =>
  api<ProductCategory>('/product-categories', { method: 'POST', body: JSON.stringify(input) })

export const updateCategory = (id: string, input: Partial<CategoryInput>) =>
  api<ProductCategory>(`/product-categories/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteCategory = (id: string) => api<void>(`/product-categories/${id}`, { method: 'DELETE' })
