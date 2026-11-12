import { useEffect, useState } from 'react'
import PageHeader from '../../../components/layout/PageHeader'
import Alert from '../../../components/ui/Alert'
import Spinner from '../../../components/ui/Spinner'
import { errorMessages } from '../../../lib/api-client'
import { getMe } from '../../auth/api'
import { getBusinessCategories, getShopContacts, getShops } from '../api'
import ContactsCard from '../components/ContactsCard'
import NextSteps from '../components/NextSteps'
import ProfileChecklist from '../components/ProfileChecklist'
import PublishCard from '../components/PublishCard'
import ShopForm from '../components/ShopForm'
import ShopPreview from '../components/ShopPreview'
import type { BusinessCategory, Shop, ShopContact } from '../types'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; shop: Shop | null; categories: BusinessCategory[]; contacts: ShopContact[] }

export default function MyShopPage() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [justCreated, setJustCreated] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([getMe(), getShops(), getBusinessCategories(), getShopContacts()])
      .then(([user, shops, categories, allContacts]) => {
        if (cancelled) return
        const shop = shops.find((s) => s.ownerId === user.id) ?? null
        const contacts = shop ? allContacts.filter((c) => c.shopId === shop.id) : []
        setState({ status: 'ready', shop, categories, contacts })
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', message: errorMessages(error)[0] ?? '' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') {
    return (
      <>
        <PageHeader title="My shop" />
        <Spinner label="Loading your shop" />
      </>
    )
  }

  if (state.status === 'error') {
    return (
      <>
        <PageHeader title="My shop" />
        <Alert tone="error" title="We could not load your shop">
          {state.message} Refresh the page to try again.
        </Alert>
      </>
    )
  }

  const { shop, categories, contacts } = state
  const update = (patch: Partial<Extract<State, { status: 'ready' }>>) =>
    setState((current) => (current.status === 'ready' ? { ...current, ...patch } : current))

  if (!shop) {
    return (
      <>
        <PageHeader title="Open your shop" description="Choose a name and a link to get started." />
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ShopForm
            categories={categories}
            onSaved={(created) => {
              setJustCreated(true)
              update({ shop: created })
            }}
          />
          <NextSteps />
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="My shop" description="Manage how your shop looks to customers." />
      {justCreated && (
        <Alert tone="success" title="Your shop is created" className="mb-6">
          Add your contact details, then publish it when you are ready.
        </Alert>
      )}
      <ShopPreview shop={shop} contactCount={contacts.length} />
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* key resets the form when a different saved version arrives */}
          <ShopForm key={shop.id} shop={shop} categories={categories} onSaved={(saved) => update({ shop: saved })} />
        </div>
        <div className="space-y-6">
          <PublishCard shop={shop} onChange={(changed) => update({ shop: changed })} />
          <ProfileChecklist shop={shop} contactCount={contacts.length} />
          <ContactsCard shopId={shop.id} contacts={contacts} onChange={(next) => update({ contacts: next })} />
        </div>
      </div>
    </>
  )
}
