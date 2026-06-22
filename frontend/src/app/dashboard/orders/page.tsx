'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Order } from '@/types'
import { adminService } from '@/services/admin.service'

const statusOptions = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const statusLabel: Record<string, string> = {
  PENDING: 'Pendente',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado'
}

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const data = await adminService.listOrders(1, 100)
    setOrders(data.data)
  }

  useEffect(() => {
    adminService.listOrders(1, 100)
      .then(data => setOrders(data.data))
      .finally(() => setLoading(false))
  }, [])

  async function handleStatus(id: string, status: string) {
    await adminService.updateOrderStatus(id, status)
    toast.success('Status atualizado!')
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>

      {loading ? (
        <p className="text-gray-500 text-sm">Carregando...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Pedido</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Total</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Data</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => handleStatus(order.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${statusColor[order.status]}`}
                    >
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{statusLabel[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}