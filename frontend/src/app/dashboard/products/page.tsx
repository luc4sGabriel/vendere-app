'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Product, Category } from '@/types'
import { adminService } from '@/services/admin.service'
import { Button } from '@/components/ui/Button'
import { ProductModal } from '@/components/shared/ProductModal'

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  async function load() {
    const [p, c] = await Promise.all([
      adminService.listProducts(1, 100),
      adminService.listCategories()
    ])
    setProducts(p.data)
    setCategories(c)
  }

  useEffect(() => {
    Promise.all([
      adminService.listProducts(1, 100),
      adminService.listCategories()
    ])
      .then(([p, c]) => {
        setProducts(p.data)
        setCategories(c)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Desativar este produto?')) return
    await adminService.deleteProduct(id)
    toast.success('Produto desativado!')
    load()
  }

  function handleEdit(product: Product) {
    setEditing(product)
    setModalOpen(true)
  }

  function handleNew() {
    setEditing(null)
    setModalOpen(true)
  }

  async function handleSave() {
    setModalOpen(false)
    await load()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <Button onClick={handleNew} size="sm">
          <Plus size={16} />
          Novo produto
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Carregando...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Nome</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Preço</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estoque</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-gray-700">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProductModal
          product={editing}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}