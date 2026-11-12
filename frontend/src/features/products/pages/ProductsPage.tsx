import { Package, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../../components/layout/PageHeader'
import Alert from '../../../components/ui/Alert'
import Button from '../../../components/ui/Button'
import { buttonStyles } from '../../../components/ui/button-styles'
import EmptyState from '../../../components/ui/EmptyState'
import Modal from '../../../components/ui/Modal'
import Spinner from '../../../components/ui/Spinner'
import { cn } from '../../../lib/cn'
import { errorMessages } from '../../../lib/api-client'
import { getMe } from '../../auth/api'
import { getShops } from '../../shops/api'
import type { Shop } from '../../shops/types'
import {
  deleteProduct,
  deleteProductImage,
  getProductCategories,
  getProductImages,
  getProducts,
  updateProduct,
} from '../api'
import { isOutOfStock } from '../availability'
import ProductForm from '../components/ProductForm'
import ProductTile from '../components/ProductTile'
import type { Product, ProductCategory, ProductImage } from '../types'

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready'
      shop: Shop | null
      products: Product[]
      images: ProductImage[]
      categories: ProductCategory[]
    }

const NO_PRODUCTS: Product[] = []

type FilterKey = 'all' | 'visible' | 'hidden' | 'featured' | 'out'

const FILTERS: { key: FilterKey; label: string; test: (product: Product) => boolean }[] = [
  { key: 'all', label: 'All', test: () => true },
  { key: 'visible', label: 'Visible', test: (p) => p.isVisible },
  { key: 'hidden', label: 'Hidden', test: (p) => !p.isVisible },
  { key: 'featured', label: 'Featured', test: (p) => p.isFeatured },
  { key: 'out', label: 'Out of stock', test: (p) => isOutOfStock(p.availability) },
]

/** The picture with the lowest display order is the main one. */
function mainImage(images: ProductImage[], productId: string): ProductImage | undefined {
  return images.filter((image) => image.productId === productId).sort((a, b) => a.displayOrder - b.displayOrder)[0]
}

export default function ProductsPage() {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')
  // 'new' opens an empty form; a product opens it for editing.
  const [editing, setEditing] = useState<Product | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([getMe(), getShops(), getProducts(), getProductImages(), getProductCategories()])
      .then(([user, shops, allProducts, allImages, allCategories]) => {
        if (cancelled) return
        const shop = shops.find((s) => s.ownerId === user.id) ?? null
        const products = shop ? allProducts.filter((p) => p.shopId === shop.id) : []
        const ids = new Set(products.map((p) => p.id))
        setState({
          status: 'ready',
          shop,
          products,
          images: allImages.filter((image) => ids.has(image.productId)),
          categories: shop ? allCategories.filter((c) => c.shopId === shop.id) : [],
        })
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', message: errorMessages(error)[0] ?? '' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  const products = state.status === 'ready' ? state.products : NO_PRODUCTS

  const visibleProducts = useMemo(() => {
    const test = FILTERS.find((f) => f.key === filter)?.test ?? (() => true)
    const needle = query.trim().toLowerCase()
    return products
      .filter(test)
      .filter((p) => !needle || p.name.toLowerCase().includes(needle))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [products, filter, query])

  if (state.status === 'loading') {
    return (
      <>
        <PageHeader title="Products" />
        <Spinner label="Loading your products" />
      </>
    )
  }

  if (state.status === 'error') {
    return (
      <>
        <PageHeader title="Products" />
        <Alert tone="error" title="We could not load your products">
          {state.message} Refresh the page to try again.
        </Alert>
      </>
    )
  }

  const { shop, images, categories } = state
  const update = (patch: Partial<Extract<State, { status: 'ready' }>>) =>
    setState((current) => (current.status === 'ready' ? { ...current, ...patch } : current))

  if (!shop) {
    return (
      <>
        <PageHeader title="Products" description="Add, edit and organize what you sell." />
        <EmptyState
          icon={<Package aria-hidden className="size-10" />}
          title="Open your shop first"
          description="Products live inside your shop. Create it, then come back to add your first product."
          action={
            <Link to="/dashboard/shop" className={buttonStyles()}>
              Open your shop
            </Link>
          }
        />
      </>
    )
  }

  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name

  function handleSaved(saved: Product, savedImage: ProductImage | null, warning?: string) {
    setActionError(warning ?? '')
    const exists = products.some((p) => p.id === saved.id)
    update({
      products: exists ? products.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...products],
      images: [...images.filter((image) => image.productId !== saved.id), ...(savedImage ? [savedImage] : [])],
    })
    setEditing(null)
  }

  async function toggleVisible(product: Product) {
    setActionError('')
    setBusyId(product.id)
    try {
      const saved = await updateProduct(product.id, { isVisible: !product.isVisible })
      update({ products: products.map((p) => (p.id === saved.id ? saved : p)) })
    } catch (err) {
      setActionError(errorMessages(err)[0] ?? '')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    setActionError('')
    setDeleteLoading(true)
    try {
      const own = images.filter((image) => image.productId === deleting.id)
      await Promise.all(own.map((image) => deleteProductImage(image.id)))
      await deleteProduct(deleting.id)
      update({
        products: products.filter((p) => p.id !== deleting.id),
        images: images.filter((image) => image.productId !== deleting.id),
      })
      setDeleting(null)
    } catch (err) {
      setActionError(errorMessages(err)[0] ?? '')
      setDeleting(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const editingProduct = editing && editing !== 'new' ? editing : undefined
  const counts = Object.fromEntries(FILTERS.map((f) => [f.key, products.filter(f.test).length])) as Record<
    FilterKey,
    number
  >

  return (
    <>
      <PageHeader
        title="Products"
        description="Add, edit and organize what you sell."
        actions={
          <Button onClick={() => setEditing('new')}>
            <Plus aria-hidden className="size-4" />
            Add product
          </Button>
        }
      />

      {actionError && (
        <Alert tone="error" className="mb-6">
          {actionError}
        </Alert>
      )}

      {products.length === 0 ? (
        <EmptyState
          icon={<Package aria-hidden className="size-10" />}
          title="Add your first product"
          description="Give it a name, a price and a photo. You can hide or change it any time."
          action={
            <Button onClick={() => setEditing('new')}>
              <Plus aria-hidden className="size-4" />
              Add product
            </Button>
          }
        />
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div role="group" aria-label="Filter products" className="flex flex-wrap gap-2">
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150',
                    filter === key
                      ? 'border-brand-ink bg-brand-ink text-content-inverse'
                      : 'border-border-strong bg-surface text-content-secondary hover:bg-surface-muted',
                  )}
                >
                  {label}
                  <span className={cn('text-xs', filter === key ? 'text-primary-light/80' : 'text-content-muted')}>
                    {counts[key]}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-content-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                placeholder="Search products"
                className="h-10 w-full rounded-md border border-border-strong bg-surface pl-9 pr-3 text-sm text-content placeholder:text-content-muted focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary"
              />
            </div>
          </div>

          {visibleProducts.length === 0 ? (
            <EmptyState
              title="No products match"
              description="Try a different search or filter."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('')
                    setFilter('all')
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product) => (
                <li key={product.id}>
                  <ProductTile
                    product={product}
                    imageUrl={mainImage(images, product.id)?.imageUrl}
                    categoryName={categoryName(product.categoryId)}
                    busy={busyId === product.id}
                    onEdit={() => setEditing(product)}
                    onToggleVisible={() => toggleVisible(product)}
                    onDelete={() => setDeleting(product)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editingProduct ? 'Edit product' : 'Add a product'}
        size="lg"
      >
        {editing && (
          <ProductForm
            key={editingProduct?.id ?? 'new'}
            shopId={shop.id}
            product={editingProduct}
            image={editingProduct ? mainImage(images, editingProduct.id) : undefined}
            categories={categories}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <Modal open={deleting !== null} onClose={() => setDeleting(null)} title="Delete this product?" size="sm">
        <p className="text-sm text-content-secondary">
          {deleting?.name} will be removed from your shop. This cannot be undone. To keep it but stop customers from
          seeing it, hide it instead.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            Keep product
          </Button>
          <Button variant="destructive" loading={deleteLoading} onClick={confirmDelete}>
            Delete product
          </Button>
        </div>
      </Modal>
    </>
  )
}
