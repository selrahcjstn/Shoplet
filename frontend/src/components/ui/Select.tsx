import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import Field from './Field'
import { controlClasses } from './field-styles'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
}

export default function Select({ label, error, hint, className, children, ...props }: SelectProps) {
  return (
    <Field label={label} error={error} hint={hint}>
      {(control) => (
        <select {...control} className={cn(controlClasses(Boolean(error)), 'h-11', className)} {...props}>
          {children}
        </select>
      )}
    </Field>
  )
}
