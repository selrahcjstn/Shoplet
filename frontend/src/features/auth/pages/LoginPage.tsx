import { useState, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import PasswordInput from '../../../components/ui/PasswordInput'
import AuthShell from '../components/AuthShell'
import { isEmail } from '../password-rules'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitted, setSubmitted] = useState(false)

  // Design only: validates the form but does not call the API yet.
  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!isEmail(email)) next.email = 'Enter your email address, like name@example.com.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    setSubmitted(Object.keys(next).length === 0)
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
        {submitted && <Alert tone="info">Design preview: logging in is not connected yet.</Alert>}
        <Button type="submit" size="lg" className="w-full">
          Log in
        </Button>
      </form>
    </AuthShell>
  )
}
