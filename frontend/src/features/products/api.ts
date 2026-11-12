import { api } from '../../lib/api-client'
import type { Product, ProductCategory, ProductImage, ProductInput } from './types'

export const getProducts = () => api<Product[]>('/products')
export const getProduct = (id: string) => api<Product>(`/products/${id}`)

export const createProduct = (input: ProductInput) =>
  api<Product>('/products', { method: 'POST', body: JSON.stringify(input) })

export const updateProduct = (id: string, input: Partial<ProductInput>) =>
  api<Product>(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteProduct = (id: string) => api<void>(`/products/${id}`, { method: 'DELETE' })

export const getProductImages = () => api<ProductImage[]>('/product-images')

export const createProductImage = (input: { productId: string; imageUrl: string; altText?: string }) =>
  api<ProductImage>('/product-images', { method: 'POST', body: JSON.stringify(input) })

export const updateProductImage = (id: string, input: { imageUrl: string }) =>
  api<ProductImage>(`/product-images/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const deleteProductImage = (id: string) => api<void>(`/product-images/${id}`, { method: 'DELETE' })

export const getProductCategories = () => api<ProductCategory[]>('/product-categories')
