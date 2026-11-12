import { Eye, EyeOff } from 'lucide-react'
import { useState, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import Field from './Field'
import { controlClasses } from './field-styles'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  hint?: string
}

/** Password field with a show/hide toggle. */
export default function PasswordInput({ label, error, hint, className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <Field label={label} error={error} hint={hint}>
      {(control) => (
        <div className="relative">
          <input
            {...control}
            type={visible ? 'text' : 'password'}
            className={cn(controlClasses(Boolean(error)), 'h-11 pr-11', className)}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-content-secondary transition-colors hover:text-content"
          >
            {visible ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}
          </button>
        </div>
      )}
    </Field>
  )
}
