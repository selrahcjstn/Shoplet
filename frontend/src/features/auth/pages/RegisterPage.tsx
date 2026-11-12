import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import PasswordInput from '../../../components/ui/PasswordInput'
import { ApiError, errorMessages } from '../../../lib/api-client'
import { isLoggedIn } from '../../../lib/token'
import { register } from '../api'
import AuthShell from '../components/AuthShell'
import PasswordChecklist from '../components/PasswordChecklist'
import { splitFieldErrors } from '../field-errors'
import { isEmail, passwordMeetsRules } from '../password-rules'

type Field = 'firstName' | 'lastName' | 'email' | 'password'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<Record<Field, string>>({ firstName: '', lastName: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isLoggedIn()) return <Navigate to="/dashboard" replace />

  const bind = (field: Field) => ({
    value: form[field],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value }),
    error: errors[field],
  })

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError('')

    const next: typeof errors = {}
    if (!form.firstName.trim()) next.firstName = 'Enter your first name.'
    if (!form.lastName.trim()) next.lastName = 'Enter your last name.'
    if (!isEmail(form.email)) next.email = 'Enter an email address, like name@example.com.'
    if (!passwordMeetsRules(form.password)) next.password = 'Your password needs to meet every requirement below.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setLoading(true)
    try {
      await register(form)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setErrors({ email: 'An account with this email already exists. Log in instead.' })
      } else if (err instanceof ApiError && err.status === 400) {
        const { fields, general } = splitFieldErrors<Field>(err.messages, {
          firstName: ['first name'],
          lastName: ['last name'],
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
      title="Create your shop"
      description="Make an account to start adding products."
      panelTitle="Set up your shop in an afternoon."
      panelText="Add your first products, then send customers your link."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" autoComplete="given-name" {...bind('firstName')} />
          <Input label="Last name" autoComplete="family-name" {...bind('lastName')} />
        </div>
        <Input label="Email" type="email" autoComplete="email" {...bind('email')} />
        <PasswordInput label="Password" autoComplete="new-password" {...bind('password')} />
        <PasswordChecklist value={form.password} />
        {formError && <Alert tone="error">{formError}</Alert>}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? 'Creating account' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}
