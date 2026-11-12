// The access token lives in localStorage. No global state library needed.
const KEY = 'shoplet_token'

export const getToken = (): string | null => localStorage.getItem(KEY)
export const setToken = (token: string): void => localStorage.setItem(KEY, token)
export const clearToken = (): void => localStorage.removeItem(KEY)
export const isLoggedIn = (): boolean => getToken() !== null
