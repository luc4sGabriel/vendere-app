'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2 } from 'lucide-react'
import { Category } from '@/types'
import { adminService } from '@/services/admin.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const data = await adminService.listCategories()
    setCategories(data)
  }

  useEffect(() => {
    adminService.listCategories().then(setCategories)
  }, [])

  async function handleCreate() {
    if (!name.trim()) return
    setLoading(true)
    await adminService.createCategory(name.trim())
    toast.success('Categoria criada!')
    setName('')
    await load()
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar esta categoria?')) return
    await adminService.deleteCategory(id)
    toast.success('Categoria deletada!')
    load()
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>

      <div className="flex gap-3">
        <Input
          placeholder="Nome da categoria"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          className="max-w-xs"
        />
        <Button onClick={handleCreate} loading={loading} size="md">
          <Plus size={16} />
          Criar
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-gray-500 text-sm p-6">Nenhuma categoria ainda.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map(cat => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}