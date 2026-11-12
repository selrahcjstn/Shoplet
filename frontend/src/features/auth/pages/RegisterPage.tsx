import { useState, type ChangeEvent, type SyntheticEvent } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import PasswordInput from '../../../components/ui/PasswordInput'
import AuthShell from '../components/AuthShell'
import PasswordChecklist from '../components/PasswordChecklist'
import { isEmail, passwordMeetsRules } from '../password-rules'

type Field = 'firstName' | 'lastName' | 'email' | 'password'

export default function RegisterPage() {
  const [form, setForm] = useState<Record<Field, string>>({ firstName: '', lastName: '', email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [submitted, setSubmitted] = useState(false)

  const bind = (field: Field) => ({
    value: form[field],
    onChange: (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value }),
    error: errors[field],
  })

  // Design only: validates the form but does not call the API yet.
  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!form.firstName.trim()) next.firstName = 'Enter your first name.'
    if (!form.lastName.trim()) next.lastName = 'Enter your last name.'
    if (!isEmail(form.email)) next.email = 'Enter an email address, like name@example.com.'
    if (!passwordMeetsRules(form.password)) next.password = 'Your password needs to meet every requirement below.'
    setErrors(next)
    setSubmitted(Object.keys(next).length === 0)
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
        {submitted && <Alert tone="info">Design preview: sign-up is not connected yet.</Alert>}
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
