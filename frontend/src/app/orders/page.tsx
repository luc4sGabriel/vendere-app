import { OrderList } from '@/components/shared/OrderList'

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus pedidos</h1>
      <OrderList />
    </div>
  )
}