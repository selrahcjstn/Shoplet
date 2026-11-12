import { getToken } from '../lib/token'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

/** Error with the friendly message(s) the backend sends back. */
export class ApiError extends Error {
  status: number
  messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages.join('\n'))
    this.status = status
    this.messages = messages
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.message ?? 'Something went wrong'
    throw new ApiError(response.status, Array.isArray(message) ? message : [message])
  }

  return response.status === 204 ? (undefined as T) : response.json()
}
