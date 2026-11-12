import { Eye, EyeOff, Globe } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../../components/ui/Alert'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import SectionCard from '../../../components/ui/SectionCard'
import { errorMessages } from '../../../lib/api-client'
import { updateShop } from '../api'
import type { Shop } from '../types'

export default function PublishCard({ shop, onChange }: { shop: Shop; onChange: (shop: Shop) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function toggle() {
    setLoading(true)
    setError('')
    try {
      onChange(await updateShop(shop.id, { isPublished: !shop.isPublished }))
    } catch (err) {
      setError(errorMessages(err)[0] ?? '')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionCard
      Icon={Globe}
      title="Visibility"
      aside={
        shop.isPublished ? (
          <Badge tone="success" icon={<Eye aria-hidden className="size-3.5" />}>
            Published
          </Badge>
        ) : (
          <Badge tone="warning" icon={<EyeOff aria-hidden className="size-3.5" />}>
            Draft
          </Badge>
        )
      }
    >
      <p className="text-sm text-content-secondary">
        {shop.isPublished
          ? 'Customers can open your shop link. Unpublish to hide it while you make changes.'
          : 'Only you can see your shop right now. Publish it when your products are ready.'}
      </p>
      {error && (
        <Alert tone="error" className="mt-4">
          {error}
        </Alert>
      )}
      <Button variant={shop.isPublished ? 'outline' : 'primary'} loading={loading} onClick={toggle} className="mt-4">
        {shop.isPublished ? 'Unpublish shop' : 'Publish shop'}
      </Button>
    </SectionCard>
  )
}
