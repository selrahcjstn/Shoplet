import { useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { ApiError } from '../api/client'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const set = (field: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [field]: e.target.value })

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    try {
      await register(form)
      navigate('/login')
    } catch (err) {
      setErrors(err instanceof ApiError ? err.messages : ['Could not reach the server'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Create account</h1>
      <Input label="First name" value={form.firstName} onChange={set('firstName')} required />
      <Input label="Last name" value={form.lastName} onChange={set('lastName')} required />
      <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
      <Input label="Password" type="password" value={form.password} onChange={set('password')} required />
      <p className="text-xs text-gray-500">
        At least 8 characters with an uppercase letter, a lowercase letter, a number and a special character.
      </p>
      {errors.map((message) => (
        <p key={message} className="text-sm text-red-600">{message}</p>
      ))}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Sign up'}
      </Button>
      <p className="text-sm">
        Already have an account? <Link to="/login" className="text-indigo-600">Log in</Link>
      </p>
    </form>
  )
}
