import { useId, type ReactNode } from 'react'

export interface FieldControlProps {
  id: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
}

interface FieldProps {
  label: string
  error?: string
  hint?: string
  children: (control: FieldControlProps) => ReactNode
}

/** Label + control + hint/error. Shared by Input, Textarea and Select. */
export default function Field({ label, error, hint, children }: FieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-content">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': message ? messageId : undefined,
      })}
      {message && (
        <p id={messageId} className={error ? 'text-sm text-error' : 'text-sm text-content-secondary'}>
          {message}
        </p>
      )}
    </div>
  )
}
