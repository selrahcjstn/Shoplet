import { clearToken, getToken } from './token'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

/** Error carrying the friendly message(s) the backend sends back. */
export class ApiError extends Error {
  status: number
  messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages.join('\n'))
    this.status = status
    this.messages = messages
  }
}

/** Shared fetch wrapper: JSON in/out, adds the token, throws ApiError. */
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
    // A rejected token means the session expired: sign out and go to the login page.
    // (A failed login has no token yet, so it is not affected.)
    if (response.status === 401 && token) {
      clearToken()
      window.location.assign('/login')
    }
    const body = await response.json().catch(() => null)
    const message = body?.message ?? 'Something went wrong'
    throw new ApiError(response.status, Array.isArray(message) ? message : [message])
  }

  return response.status === 204 ? (undefined as T) : response.json()
}

/** Turns any thrown value into a list of messages to show the user. */
export function errorMessages(error: unknown): string[] {
  return error instanceof ApiError ? error.messages : ['Could not reach the server. Please try again.']
}
