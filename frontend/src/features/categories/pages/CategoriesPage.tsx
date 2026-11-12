import { Plus, Tags } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../../components/layout/PageHeader'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import { buttonStyles } from '../../../components/ui/button-styles'
import EmptyState from '../../../components/ui/EmptyState'
import Modal from '../../../components/ui/Modal'
import Spinner from '../../../components/ui/Spinner'
import { errorMessages } from '../../../lib/api-client'
import { getMe } from '../../auth/api'
import { getProductCategories, getProducts, updateProduct } from '../../products/api'
import type { Product, ProductCategory } from '../../products/types'
import { getShops } from '../../shops/api'
import type { Shop } from '../../shops/types'
import { deleteCategory } from '../api'
import CategoryCard from '../components/CategoryCard'
import CategoryForm from '../components/CategoryForm'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; shop: Shop | null; categories: ProductCategory[]; products: Product[] }

export default function CategoriesPage() {
  const [state, setState] = useState<State>({ status: 'loading' })
  // 'new' opens an empty form; a category opens it for editing.
  const [editing, setEditing] = useState<ProductCategory | 'new' | null>(null)
  const [deleting, setDeleting] = useState<ProductCategory | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.all([getMe(), getShops(), getProductCategories(), getProducts()])
      .then(([user, shops, allCategories, allProducts]) => {
        if (cancelled) return
        const shop = shops.find((s) => s.ownerId === user.id) ?? null
        setState({
          status: 'ready',
          shop,
          categories: shop ? allCategories.filter((c) => c.shopId === shop.id) : [],
          products: shop ? allProducts.filter((p) => p.shopId === shop.id) : [],
        })
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
        <PageHeader title="Categories" />
        <Spinner label="Loading your categories" />
      </>
    )
  }

  if (state.status === 'error') {
    return (
      <>
        <PageHeader title="Categories" />
        <Alert tone="error" title="We could not load your categories">
          {state.message} Refresh the page to try again.
        </Alert>
      </>
    )
  }

  const { shop, categories, products } = state
  const update = (patch: Partial<Extract<State, { status: 'ready' }>>) =>
    setState((current) => (current.status === 'ready' ? { ...current, ...patch } : current))

  if (!shop) {
    return (
      <>
        <PageHeader title="Categories" description="Group your products so customers find them faster." />
        <EmptyState
          icon={<Tags aria-hidden className="size-10" />}
          title="Open your shop first"
          description="Categories live inside your shop. Create it, then come back to organize your products."
          action={
            <Link to="/dashboard/shop" className={buttonStyles()}>
              Open your shop
            </Link>
          }
        />
      </>
    )
  }

  const inCategory = (id: string) => products.filter((p) => p.categoryId === id)
  const uncategorized = products.filter((p) => !p.categoryId).length

  function handleSaved(saved: ProductCategory) {
    const exists = categories.some((c) => c.id === saved.id)
    update({ categories: exists ? categories.map((c) => (c.id === saved.id ? saved : c)) : [...categories, saved] })
    setActionError('')
    setEditing(null)
  }

  async function confirmDelete() {
    if (!deleting) return
    setActionError('')
    setDeleteLoading(true)
    try {
      // Products keep existing; they just lose this category.
      const own = inCategory(deleting.id)
      await Promise.all(own.map((p) => updateProduct(p.id, { categoryId: null })))
      await deleteCategory(deleting.id)
      update({
        categories: categories.filter((c) => c.id !== deleting.id),
        products: products.map((p) => (p.categoryId === deleting.id ? { ...p, categoryId: null } : p)),
      })
    } catch (err) {
      setActionError(errorMessages(err)[0] ?? '')
    } finally {
      setDeleting(null)
      setDeleteLoading(false)
    }
  }

  const editingCategory = editing && editing !== 'new' ? editing : undefined
  const deletingCount = deleting ? inCategory(deleting.id).length : 0

  return (
    <>
      <PageHeader
        title="Categories"
        description="Group your products so customers find them faster."
        actions={
          <Button onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" />
            Add category
          </Button>
        }
      />

      {actionError && (
        <Alert tone="error" className="mb-6">
          {actionError}
        </Alert>
      )}

      {categories.length === 0 ? (
        <EmptyState
          icon={<Tags aria-hidden className="size-10" />}
          title="Add your first category"
          description="Categories like Candles or Home decor help customers browse. You can assign products to them when you add or edit a product."
          action={
            <Button onClick={() => setEditing('new')}>
              <Plus aria-hidden className="size-4" />
              Add category
            </Button>
          }
        />
      ) : (
        <>
          {products.length > 0 && (
            <p className="mb-6 text-sm text-content-secondary">
              {uncategorized === 0
                ? 'Every product is in a category.'
                : `${uncategorized} ${uncategorized === 1 ? 'product has' : 'products have'} no category yet. Open a product and choose one.`}
            </p>
          )}
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const own = inCategory(category.id)
              return (
                <li key={category.id}>
                  <CategoryCard
                    category={category}
                    productCount={own.length}
                    sample={own.slice(0, 3).map((p) => p.name)}
                    onEdit={() => setEditing(category)}
                    onDelete={() => setDeleting(category)}
                  />
                </li>
              )
            })}
          </ul>
        </>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editingCategory ? 'Edit category' : 'Add a category'}
      >
        {editing && (
          <CategoryForm
            key={editingCategory?.id ?? 'new'}
            shopId={shop.id}
            category={editingCategory}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <Modal open={deleting !== null} onClose={() => setDeleting(null)} title="Delete this category?" size="sm">
        <p className="text-sm text-content-secondary">
          {deleting?.name} will be removed.{' '}
          {deletingCount > 0
            ? `Its ${deletingCount} ${deletingCount === 1 ? 'product stays' : 'products stay'} in your shop, without a category.`
            : 'No products are in it.'}{' '}
          This cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            Keep category
          </Button>
          <Button variant="destructive" loading={deleteLoading} onClick={confirmDelete}>
            Delete category
          </Button>
        </div>
      </Modal>
    </>
  )
}
