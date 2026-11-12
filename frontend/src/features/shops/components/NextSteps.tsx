import { Globe, ListChecks, Phone, Store } from 'lucide-react'
import SectionCard from '../../../components/ui/SectionCard'

const STEPS = [
  { Icon: Store, title: 'Create your shop', text: 'Choose a name and a link. This takes a minute.' },
  { Icon: Phone, title: 'Add contact details', text: 'Tell customers how to reach you.' },
  { Icon: Globe, title: 'Publish when ready', text: 'Your shop stays private until you publish it.' },
]

/** Shown beside the create form so the page explains what comes after. */
export default function NextSteps() {
  return (
    <SectionCard Icon={ListChecks} title="What happens next" description="You can change everything later.">
      <ol className="space-y-5">
        {STEPS.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-start gap-3">
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-content-secondary"
            >
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-content">{title}</p>
              <p className="text-sm text-content-secondary">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </SectionCard>
  )
}
