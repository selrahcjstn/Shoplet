import type { LucideIcon } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import EmptyState from '../../../components/ui/EmptyState'

interface SectionPageProps {
  title: string
  description: string
  Icon: LucideIcon
}

/** Placeholder for dashboard sections that are not built yet. */
export default function SectionPage({ title, description, Icon }: SectionPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={<Icon aria-hidden className="size-10" />}
        title={`${title} is coming soon`}
        description="We are still building this section. It will show up here when it is ready."
      />
    </>
  )
}
