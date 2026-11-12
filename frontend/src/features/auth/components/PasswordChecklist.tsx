import { Check, Circle } from 'lucide-react'
import { PASSWORD_RULES } from '../password-rules'

/** Live list of password requirements. Status is shown by icon and by text, not color alone. */
export default function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="grid gap-x-4 gap-y-1.5 sm:grid-cols-2" aria-label="Password requirements">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(value)
        return (
          <li
            key={rule.id}
            className={`flex items-center gap-2 text-sm ${met ? 'text-success' : 'text-content-secondary'}`}
          >
            {met ? <Check aria-hidden className="size-4" /> : <Circle aria-hidden className="size-4" />}
            {rule.label}
            <span className="sr-only">{met ? ' (done)' : ' (not yet)'}</span>
          </li>
        )
      })}
    </ul>
  )
}
