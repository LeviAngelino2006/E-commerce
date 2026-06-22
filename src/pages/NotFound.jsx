import PageTransition from '../components/PageTransition.jsx'
import Button from '../components/ui/Button.jsx'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <PageTransition>
      <Seo title="Página no encontrada" />
      <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-7xl font-bold">404</p>
        <h1 className="mt-4 text-xl">Esta página no existe</h1>
        <p className="mt-2 text-gray">
          Puede que el enlace esté roto o que la prenda ya no esté disponible.
        </p>
        <Button to="/tienda" className="mt-8">
          Ir a la tienda
        </Button>
      </section>
    </PageTransition>
  )
}
