'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Category } from '@/types'
import { categoryService } from '@/services/category.service'
import { Input } from '@/components/ui/Input'

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState(searchParams.get('name') || '')

  useEffect(() => {
    categoryService.list().then(setCategories)
  }, [])

  function handleSearch(value: string) {
    setSearch(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('name', value)
    } else {
      params.delete('name')
    }
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  function handleCategory(categoryId: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set('categoryId', categoryId)
    } else {
      params.delete('categoryId')
    }
    params.delete('page')
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Buscar produtos..."
        value={search}
        onChange={e => handleSearch(e.target.value)}
        className="sm:w-72"
      />
      <select
        onChange={e => handleCategory(e.target.value)}
        defaultValue={searchParams.get('categoryId') || ''}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
      >
        <option value="">Todas as categorias</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  )
}