'use client'

import { useEffect, useState } from 'react'
import { Package, Tag, ShoppingBag } from 'lucide-react'
import { adminService } from '@/services/admin.service'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0
  })

  useEffect(() => {
    Promise.all([
      adminService.listProducts(1, 1),
      adminService.listCategories(),
      adminService.listOrders(1, 1)
    ]).then(([products, categories, orders]) => {
      setStats({
        products: products.meta.total,
        categories: categories.length,
        orders: orders.meta.total
      })
    })
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Visão geral</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Package, label: 'Produtos', value: stats.products, color: 'bg-blue-50 text-blue-700' },
          { icon: Tag, label: 'Categorias', value: stats.categories, color: 'bg-green-50 text-green-700' },
          { icon: ShoppingBag, label: 'Pedidos', value: stats.orders, color: 'bg-purple-50 text-purple-700' }
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}