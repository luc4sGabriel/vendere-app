'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { Product, Category } from '@/types'
import { adminService } from '@/services/admin.service'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Preço inválido'),
  stock: z.coerce.number().int().nonnegative('Estoque inválido'),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  categoryId: z.string().uuid('Selecione uma categoria')
})

type FormInput = z.input<typeof schema>
type FormOutput = z.output<typeof schema>

interface ProductModalProps {
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}

export function ProductModal({ product, categories, onClose, onSave }: ProductModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      categoryId: product.categoryId
    } : {}
  })

  async function onSubmit(data: FormOutput) {
    const payload = { ...data, imageUrl: data.imageUrl || undefined }
    if (product) {
      await adminService.updateProduct(product.id, payload)
      toast.success('Produto atualizado!')
    } else {
      await adminService.createProduct(payload)
      toast.success('Produto criado!')
    }
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {product ? 'Editar produto' : 'Novo produto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Nome" error={errors.name?.message} {...register('name')} />
          <Input label="Descrição" error={errors.description?.message} {...register('description')} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Preço" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
            <Input label="Estoque" type="number" error={errors.stock?.message} {...register('stock')} />
          </div>

          <Input label="URL da imagem" error={errors.imageUrl?.message} {...register('imageUrl')} />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Categoria</label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-900"
              {...register('categoryId')}
            >
              <option value="">Selecione...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="text-xs text-red-500">{errors.categoryId.message}</span>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" loading={isSubmitting} className="flex-1">
              {product ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}