'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '@/stores/cart.store'
import { orderService } from '@/services/order.service'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  address: z.string().min(5, 'Endereço obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  zip: z.string().min(8, 'CEP inválido')
})

type FormData = z.infer<typeof schema>

export function CheckoutForm() {
  const [error, setError] = useState('')
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const hydrated = useCartStore(state => state.hydrated)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  async function onSubmit() {
    try {
      setError('')
      const orderItems = items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity
      }))

      const order = await orderService.create(orderItems)
      clearCart()
      router.push(`/orders/${order.id}?success=true`)
    } catch {
      setError('Erro ao finalizar pedido. Tente novamente.')
    }
  }

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace('/orders')
    }
  }, [hydrated, items.length, router])

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-gray-900">Resumo do pedido</h2>
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between text-sm text-gray-600">
            <span>{product.name} × {quantity}</span>
            <span>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(product.price * quantity)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(total())}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4"
      >
        <h2 className="font-semibold text-gray-900">Dados de entrega</h2>

        <Input
          label="Nome completo"
          placeholder="João Silva"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Endereço"
          placeholder="Rua das Flores, 123"
          error={errors.address?.message}
          {...register('address')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Cidade"
            placeholder="São Paulo"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="CEP"
            placeholder="00000-000"
            error={errors.zip?.message}
            {...register('zip')}
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={isSubmitting}>
          Confirmar pedido
        </Button>
      </form>
    </div>
  )
}