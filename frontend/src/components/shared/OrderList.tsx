'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Order } from '@/types'
import { orderService } from '@/services/order.service'
import { Spinner } from '@/components/ui/Spinner'
import { Package } from 'lucide-react'

const statusLabel = {
  PENDING: 'Pendente',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado'
}

const statusColor = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.list()
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <Package size={48} className="text-gray-300" />
        <p className="text-gray-500">Você ainda não fez nenhum pedido.</p>
        <Link href="/products" className="text-gray-900 font-medium hover:underline">
          Ver produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map(order => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex items-center justify-between gap-4"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-500">
              Pedido #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="font-bold text-gray-900">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(order.total)}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[order.status]}`}>
            {statusLabel[order.status]}
          </span>
        </Link>
      ))}
    </div>
  )
}