import { productService } from '@/services/product.service'
import { ProductCard } from '@/components/shared/ProductCard'
import { ProductFilters } from '@/components/shared/ProductFilters'
import { Pagination } from '@/components/shared/Pagination'
import { Suspense } from 'react'
import { Spinner } from '@/components/ui/Spinner'

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string
    name?: string
    categoryId?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const { data: products, meta } = await productService.list({
    page: Number(params.page) || 1,
    limit: 12,
    name: params.name,
    categoryId: params.categoryId
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Suspense fallback={<Spinner size="sm" />}>
          <ProductFilters />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Suspense>
        <Pagination meta={meta} />
      </Suspense>
    </div>
  )
}