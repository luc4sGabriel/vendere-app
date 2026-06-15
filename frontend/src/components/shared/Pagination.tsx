'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  meta: {
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export function Pagination({ meta }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/products?${params.toString()}`)
  }

  if (meta.totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => goToPage(meta.page - 1)}
        disabled={!meta.hasPreviousPage}
      >
        <ChevronLeft size={16} />
        Anterior
      </Button>

      <span className="text-sm text-gray-600">
        Página {meta.page} de {meta.totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => goToPage(meta.page + 1)}
        disabled={!meta.hasNextPage}
      >
        Próxima
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}