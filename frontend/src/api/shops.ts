import type { Shop } from '../types'
import { api } from './client'

export const getShops = () => api<Shop[]>('/shops')
export const getShop = (id: string) => api<Shop>(`/shops/${id}`)

export const createShop = (input: { name: string; slug: string; description?: string }) =>
  api<Shop>('/shops', { method: 'POST', body: JSON.stringify(input) })
