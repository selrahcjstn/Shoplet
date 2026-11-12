import type { AuthResponse, User } from '../types'
import { api } from './client'

export interface RegisterInput {
  firstName: string
  lastName: string
  email: string
  password: string
}

export const register = (input: RegisterInput) =>
  api<User>('/auth/register', { method: 'POST', body: JSON.stringify(input) })

export const login = (email: string, password: string) =>
  api<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const getMe = () => api<User>('/users/me')
