'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart.store'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth.store'

export function CartItems() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()

  function handleCheckout() {
    if (!isAuthenticated()) {
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <ShoppingBag size={48} className="text-gray-300" />
        <p className="text-gray-500">Seu carrinho está vazio.</p>
        <Link href="/products">
          <Button variant="secondary">Ver produtos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4"
          >
            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Sem imagem
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/products/${product.id}`}
                  className="font-medium text-gray-900 hover:underline line-clamp-2"
                >
                  {product.name}
                </Link>
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="px-2 py-1 hover:bg-gray-100 text-gray-600 text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-2 py-1 hover:bg-gray-100 text-gray-600 text-sm"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>

                <span className="font-bold text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(product.price * quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold text-xl text-gray-900">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(total())}
          </span>
        </div>

        <Button size="lg" onClick={handleCheckout}>
          Finalizar compra
        </Button>

        <button
          onClick={clearCart}
          className="text-sm text-center text-gray-400 hover:text-red-500 transition-colors"
        >
          Limpar carrinho
        </button>
      </div>
    </div>
  )
}