'use client' // 👈 necessário por causa do hook que usa

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/Button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem) // 👈 hook em questao

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="relative h-52 bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sem imagem
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:underline line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(product.price)}
          </span>

          <Button
            size="sm"
            onClick={() => addItem(product)} // 👈 client side que uso
            disabled={product.stock === 0}
            title="Adicionar ao carrinho"
          >
            <ShoppingCart size={16} />
            {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
          </Button>
        </div>
      </div>
    </div>
  )
}