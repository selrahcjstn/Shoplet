import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import Field from './Field'
import { controlClasses } from './field-styles'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
}

export default function Textarea({ label, error, hint, className, rows = 4, ...props }: TextareaProps) {
  return (
    <Field label={label} error={error} hint={hint}>
      {(control) => (
        <textarea
          {...control}
          rows={rows}
          className={cn(controlClasses(Boolean(error)), 'py-2.5', className)}
          {...props}
        />
      )}
    </Field>
  )
}
