import { CheckoutForm } from '@/components/shared/CheckoutForm'

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Finalizar compra</h1>
      <CheckoutForm />
    </div>
  )
}