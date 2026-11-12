import { Check, Circle, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionCard from '../../../components/ui/SectionCard'

export interface SetupStep {
  label: string
  /** One short line about why the step matters. */
  hint: string
  done: boolean
  to: string
}

/** Setup checklist. Finished steps are marked off; open steps link to where you do them. */
export default function GettingStarted({ steps }: { steps: SetupStep[] }) {
  const doneCount = steps.filter((step) => step.done).length

  return (
    <SectionCard title="Getting started" description={`${doneCount} of ${steps.length} done`} Icon={ListChecks}>
      <div
        role="progressbar"
        aria-label="Setup progress"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={doneCount}
        className="h-2 overflow-hidden rounded-full bg-surface-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-200"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <ul className="mt-4 space-y-1">
        {steps.map((step) => (
          <li key={step.label}>
            {step.done ? (
              <div className="flex items-start gap-3 rounded-md px-2 py-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success text-content-inverse">
                  <Check aria-hidden className="size-3.5" />
                </span>
                <p className="text-sm text-content-secondary">
                  {step.label}
                  <span className="sr-only"> (done)</span>
                </p>
              </div>
            ) : (
              <Link
                to={step.to}
                className="flex items-start gap-3 rounded-md px-2 py-2.5 transition-colors duration-150 hover:bg-surface-muted"
              >
                <Circle aria-hidden className="mt-0.5 size-5 shrink-0 text-border-strong" />
                <span>
                  <span className="block text-sm font-medium text-content">{step.label}</span>
                  <span className="block text-xs text-content-secondary">{step.hint}</span>
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
