import { productService } from '@/services/product.service'
import { ProductDetail } from '@/components/shared/ProductDetail'
import { notFound } from 'next/navigation'
import type { Product } from '@/types'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  let product: Product
  try {
    product = await productService.getById(id)
  } catch {
    notFound()
  }

  return <ProductDetail product={product} />
}