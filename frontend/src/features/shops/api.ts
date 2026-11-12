import { api } from '../../lib/api-client'
import type { Shop } from './types'

export const getShops = () => api<Shop[]>('/shops')
export const getShop = (id: string) => api<Shop>(`/shops/${id}`)

export const createShop = (input: { name: string; slug: string; description?: string }) =>
  api<Shop>('/shops', { method: 'POST', body: JSON.stringify(input) })
