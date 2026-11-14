import { PackageOpen, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { cn } from '../../../lib/cn'
import { ApiError } from '../../../lib/api-client'
import { shopUrl } from '../../../lib/shop-url'
import { accentStyle } from '../accent'
import { getStorefront, trackContactClick, trackProductView, trackStoreView } from '../api'
import { sortContacts, type ContactLink } from '../contact-links'
import ContactButtons from '../components/ContactButtons'
import ProductSheet from '../components/ProductSheet'
import { AnnouncementBar, OwnerBar } from '../components/StoreBanners'
import StoreFooter from '../components/StoreFooter'
import StoreHeader from '../components/StoreHeader'
import StoreNotFound from '../components/StoreNotFound'
import StoreProductCard from '../components/StoreProductCard'
import type { Storefront, StoreProduct } from '../types'

type State =
  { status: 'loading' } | { status: 'not-found' } | { status: 'error' } | { status: 'ready'; data: Storefront }

const ALL = 'all'

/** Copies text and reports whether it worked, so the page can say "Link copied" only when true. */
async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export default function StorefrontPage() {
  const { slug = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const [state, setState] = useState<State>({ status: 'loading' })
  const [category, setCategory] = useState(ALL)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    let cancelled = false
    getStorefront(slug)
      .then((data) => {
        if (cancelled) return
        setState({ status: 'ready', data })
        // The owner's own visits would only muddy their numbers.
        if (!data.isOwner) {
          trackStoreView(data.shop.id)
          const linked = data.products.find(
            (p) => p.slug === new URLSearchParams(window.location.search).get('product'),
          )
          if (linked) trackProductView(linked.id)
        }
      })
      .catch((error) => {
        if (cancelled) return
        setState({ status: error instanceof ApiError && error.status === 404 ? 'not-found' : 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const data = state.status === 'ready' ? state.data : null

  useEffect(() => {
    if (data) document.title = `${data.shop.name} · Shoplet`
    return () => {
      document.title = 'Shoplet'
    }
  }, [data])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const contacts = useMemo(() => (data ? sortContacts(data.contacts) : []), [data])

  const shown = useMemo(() => {
    if (!data) return []
    const needle = query.trim().toLowerCase()
    return data.products.filter(
      (p) =>
        (category === ALL || p.categoryId === category) &&
        (!needle || p.name.toLowerCase().includes(needle) || p.description?.toLowerCase().includes(needle)),
    )
  }, [data, category, query])

  if (state.status === 'loading') return <StoreSkeleton />
  if (state.status === 'not-found') return <StoreNotFound />
  if (state.status === 'error' || !data) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <h1 className="text-h3 font-bold text-brand-ink">We could not open this shop</h1>
        <p className="mt-2 text-content-secondary">Check your connection and refresh the page.</p>
      </main>
    )
  }

  const { shop, categories, products, isOwner, isPreview } = data
  const usedCategories = categories
    .map((c) => ({ ...c, count: products.filter((p) => p.categoryId === c.id).length }))
    .filter((c) => c.count > 0)
  const featured = products.filter((p) => p.isFeatured)
  const browsing = category === ALL && !query.trim()
  const open = products.find((p) => p.slug === params.get('product')) ?? null

  function openProduct(product: StoreProduct) {
    // In the address, so the back button closes it and the link can be shared.
    setParams({ product: product.slug })
    if (!isOwner) trackProductView(product.id)
  }

  function handleContact(link: ContactLink, product?: StoreProduct) {
    if (!isOwner) trackContactClick(shop.id, link.type, product?.id)
  }

  async function share() {
    const url = shopUrl(shop.slug)
    if (navigator.share) {
      try {
        await navigator.share({ title: shop.name, url })
        return
      } catch {
        // Cancelled or unsupported: fall back to copying.
      }
    }
    setToast((await copy(url)) ? 'Shop link copied' : url)
  }

  return (
    <div style={accentStyle(shop.accentColor)} className="min-h-screen pb-24 sm:pb-0">
      {isOwner && <OwnerBar isPreview={isPreview} />}
      {shop.announcement && <AnnouncementBar text={shop.announcement} />}

      <main className="mx-auto max-w-[1120px] px-4 pt-4 sm:px-6 sm:pt-6">
        <StoreHeader
          shop={shop}
          productCount={products.length}
          contacts={contacts}
          onContact={handleContact}
          onShare={share}
        />

        {products.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-border-strong px-6 py-16 text-center">
            <PackageOpen aria-hidden className="size-10 text-content-muted" />
            <h2 className="mt-3 text-h4 font-semibold text-brand-ink">New products are on the way</h2>
            <p className="mt-1 max-w-sm text-content-secondary">
              Nothing is listed yet. Message the shop to ask what is available.
            </p>
          </div>
        ) : (
          <>
            {/* Sticky so customers can switch category without scrolling back up */}
            <div className="sticky top-0 z-20 -mx-4 mt-10 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div
                  role="group"
                  aria-label="Categories"
                  className="-mx-1 flex gap-2 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  <CategoryPill
                    active={category === ALL}
                    onClick={() => setCategory(ALL)}
                    label="All"
                    count={products.length}
                  />
                  {usedCategories.map((c) => (
                    <CategoryPill
                      key={c.id}
                      active={category === c.id}
                      onClick={() => setCategory(c.id)}
                      label={c.name}
                      count={c.count}
                    />
                  ))}
                </div>
                <div className="relative md:w-64">
                  <Search
                    aria-hidden
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-content-muted"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`Search ${shop.name}`}
                    aria-label="Search products"
                    className="h-10 w-full rounded-full border border-border-strong bg-surface pl-10 pr-4 text-sm text-content placeholder:text-content-muted focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary"
                  />
                </div>
              </div>
            </div>

            {browsing && featured.length > 0 && (
              <section aria-labelledby="featured-heading" className="mt-10">
                <h2 id="featured-heading" className="text-h4 font-semibold tracking-tight text-brand-ink">
                  Featured
                </h2>
                <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {featured.slice(0, 3).map((product) => (
                    <li key={product.id}>
                      <StoreProductCard product={product} onOpen={() => openProduct(product)} wide />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="products-heading" className="mt-10">
              <div className="flex items-baseline justify-between gap-4">
                <h2 id="products-heading" className="text-h4 font-semibold tracking-tight text-brand-ink">
                  {browsing
                    ? 'All products'
                    : category === ALL
                      ? 'Search results'
                      : usedCategories.find((c) => c.id === category)?.name}
                </h2>
                <p className="text-sm text-content-secondary">
                  {shown.length} {shown.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              {shown.length === 0 ? (
                <div className="mt-6 rounded-3xl bg-surface p-10 text-center">
                  <p className="font-semibold text-brand-ink">Nothing matches “{query.trim()}”</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setCategory(ALL)
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover"
                  >
                    <X aria-hidden className="size-4" />
                    Clear search
                  </button>
                </div>
              ) : (
                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
                  {shown.map((product) => (
                    <li key={product.id}>
                      <StoreProductCard product={product} onOpen={() => openProduct(product)} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>

      <StoreFooter shop={shop} contacts={contacts} onContact={handleContact} />

      {/* On phones, the main way to reach the shop stays within thumb reach */}
      {contacts.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 p-3 backdrop-blur sm:hidden">
          <ContactButtons contacts={contacts.slice(0, 1)} onContact={handleContact} layout="full" />
        </div>
      )}

      <ProductSheet
        product={open}
        categoryName={categories.find((c) => c.id === open?.categoryId)?.name}
        contacts={contacts}
        onClose={() => setParams({})}
        onContact={(link, product) => handleContact(link, product)}
        onCopyLink={(product) => copy(`${shopUrl(shop.slug)}?product=${product.slug}`)}
      />

      <p
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed inset-x-0 bottom-24 z-40 mx-auto w-fit max-w-[90vw] truncate rounded-full bg-brand-ink px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 sm:bottom-8',
          toast ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
        )}
      >
        {toast}
      </p>
    </div>
  )
}

interface CategoryPillProps {
  active: boolean
  onClick: () => void
  label: string
  count: number
}

function CategoryPill({ active, onClick, label, count }: CategoryPillProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        active
          ? 'bg-[var(--shop-accent)] text-[var(--shop-on-accent)]'
          : 'border border-border-strong bg-surface text-content-secondary hover:text-content',
      )}
    >
      {label}
      <span className={active ? 'opacity-75' : 'text-content-muted'}>{count}</span>
    </button>
  )
}

/** Grey shapes in the page's layout while the shop loads, so nothing jumps when it arrives. */
function StoreSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading shop"
      className="mx-auto max-w-[1120px] animate-pulse px-4 pt-4 sm:px-6 sm:pt-6"
    >
      <div className="h-40 rounded-3xl bg-surface-muted sm:h-56 lg:h-64" />
      <div className="-mt-12 ml-1 size-24 rounded-3xl border-4 border-background bg-surface-muted sm:ml-6 sm:size-28" />
      <div className="ml-1 mt-4 h-9 w-64 rounded-lg bg-surface-muted sm:ml-6" />
      <div className="ml-1 mt-3 h-4 w-40 rounded bg-surface-muted sm:ml-6" />
      <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index}>
            <div className="aspect-square rounded-2xl bg-surface-muted" />
            <div className="mt-3 h-4 w-3/4 rounded bg-surface-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
