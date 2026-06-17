'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/types'
import { orderService } from '@/services/order.service'
import { Spinner } from '@/components/ui/Spinner'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

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

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService.getById(id)
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (!order) {
    return <p className="text-center text-gray-500 py-16">Pedido não encontrado.</p>
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
          <CheckCircle size={20} />
          <span className="font-medium">Pedido realizado com sucesso!</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pedido #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(order.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColor[order.status]}`}>
          {statusLabel[order.status]}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3">
        <h2 className="font-semibold text-gray-900">Itens do pedido</h2>
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between text-sm text-gray-600">
            <span>{item.productId.slice(0, 8)} × {item.quantity}</span>
            <span>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(order.total)}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/pedidos" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            Meus pedidos
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button size="lg" className="w-full">
            Continuar comprando
          </Button>
        </Link>
      </div>
    </div>
  )
}