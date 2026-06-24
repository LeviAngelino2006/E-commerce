import PageTransition from '../components/PageTransition.jsx'
import Seo from '../components/Seo.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Button from '../components/ui/Button.jsx'
import { useWishlistStore } from '../store/wishlistStore.js'
import { useCatalogData } from '../lib/catalog.js'

export default function Favorites() {
  const { products, loading } = useCatalogData()
  const favIds = useWishlistStore((s) => s.items)
  const favProducts = favIds.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  return (
    <PageTransition>
      <Seo title="Mis favoritos" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Mis favoritos</h1>
        {loading ? null : favProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
            <p className="text-gray">Todavía no agregaste favoritos.</p>
            <Button to="/tienda">Ir a la tienda</Button>
          </div>
        ) : (
          <ProductGrid products={favProducts} />
        )}
      </div>
    </PageTransition>
  )
}
