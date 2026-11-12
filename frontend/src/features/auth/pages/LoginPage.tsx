import { useState, type SyntheticEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import PasswordInput from '../../../components/ui/PasswordInput'
import { ApiError, errorMessages } from '../../../lib/api-client'
import { isLoggedIn, setToken } from '../../../lib/token'
import { login } from '../api'
import AuthShell from '../components/AuthShell'
import { splitFieldErrors } from '../field-errors'
import { isEmail } from '../password-rules'

export default function LoginPage() {
  const navigate = useNavigate()
  const justRegistered = (useLocation().state as { registered?: boolean } | null)?.registered
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isLoggedIn()) return <Navigate to="/dashboard" replace />

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')

    const next: typeof errors = {}
    if (!isEmail(email)) next.email = 'Enter your email address, like name@example.com.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    try {
      const { accessToken } = await login(email, password)
      setToken(accessToken)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFormError('That email and password do not match. Check them and try again.')
      } else if (err instanceof ApiError && err.status === 400) {
        const { fields, general } = splitFieldErrors(err.messages, {
          email: ['email', 'please enter a valid email'],
          password: ['password'],
        })
        setErrors(fields)
        setFormError(general.join(' '))
      } else {
        setFormError(errorMessages(err)[0] ?? '')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Log in to your shop"
      description="Welcome back. Pick up where you left off."
      panelTitle="Your shop is open."
      panelText="Check on your products, update a price, or add something new."
      footer={
        <>
          New to Shoplet?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
            Create your shop
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {justRegistered && <Alert tone="success">Your account is ready. Log in to continue.</Alert>}
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        {formError && <Alert tone="error">{formError}</Alert>}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Logging in' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  )
}
