import { api } from '../../lib/api-client'
import type { Product } from './types'

export const getProducts = () => api<Product[]>('/products')
export const getProduct = (id: string) => api<Product>(`/products/${id}`)
