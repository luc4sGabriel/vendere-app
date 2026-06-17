import { CartItems } from '@/components/shared/CartItems'

export default function CartPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Carrinho</h1>
      <CartItems />
    </div>
  )
}