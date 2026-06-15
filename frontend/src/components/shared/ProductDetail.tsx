'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, ArrowLeft } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore(state => state.addItem)

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/products"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 w-fit"
      >
        <ArrowLeft size={16} />
        Voltar para produtos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-80 md:h-96 bg-gray-100 rounded-xl overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          <span className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(product.price)}
          </span>

          <p className="text-sm text-gray-500">
            {product.stock > 0
              ? `${product.stock} unidades disponíveis`
              : 'Produto esgotado'}
          </p>

          {product.stock > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-100 text-gray-600"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="px-3 py-2 hover:bg-gray-100 text-gray-600"
                >
                  +
                </button>
              </div>

              <Button onClick={handleAdd} size="lg" className="flex-1">
                <ShoppingCart size={18} />
                {added ? 'Adicionado!' : 'Adicionar ao carrinho'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}