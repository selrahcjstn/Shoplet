import { useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { ApiError } from '../api/client'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { setToken } from '../lib/token'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    try {
      const { accessToken } = await login(email, password)
      setToken(accessToken)
      navigate('/dashboard')
    } catch (err) {
      setErrors(err instanceof ApiError ? err.messages : ['Could not reach the server'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Log in</h1>
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {errors.map((message) => (
        <p key={message} className="text-sm text-red-600">{message}</p>
      ))}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging in...' : 'Log in'}
      </Button>
      <p className="text-sm">
        No account? <Link to="/register" className="text-indigo-600">Sign up</Link>
      </p>
    </form>
  )
}
