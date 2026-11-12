import { api } from '../../lib/api-client'
import type { BusinessCategory, Shop, ShopContact, ShopInput } from './types'

export const getShops = () => api<Shop[]>('/shops')
export const getShop = (id: string) => api<Shop>(`/shops/${id}`)

export const createShop = (input: ShopInput) => api<Shop>('/shops', { method: 'POST', body: JSON.stringify(input) })

export const updateShop = (id: string, input: Partial<ShopInput> & { isPublished?: boolean }) =>
  api<Shop>(`/shops/${id}`, { method: 'PATCH', body: JSON.stringify(input) })

export const getBusinessCategories = () => api<BusinessCategory[]>('/business-categories')

export const getShopContacts = () => api<ShopContact[]>('/shop-contacts')

export const createShopContact = (input: { shopId: string; contactType: string; contactValue: string }) =>
  api<ShopContact>('/shop-contacts', { method: 'POST', body: JSON.stringify(input) })

export const deleteShopContact = (id: string) => api<void>(`/shop-contacts/${id}`, { method: 'DELETE' })
