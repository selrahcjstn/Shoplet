import type { Product } from '../types'
import { api } from './client'

export const getProducts = () => api<Product[]>('/products')
export const getProduct = (id: string) => api<Product>(`/products/${id}`)
