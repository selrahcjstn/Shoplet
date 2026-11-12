import type { InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import Field from './Field'
import { controlClasses } from './field-styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export default function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <Field label={label} error={error} hint={hint}>
      {(control) => <input {...control} className={cn(controlClasses(Boolean(error)), 'h-11', className)} {...props} />}
    </Field>
  )
}
