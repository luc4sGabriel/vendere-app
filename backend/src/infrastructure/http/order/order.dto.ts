import { z } from 'zod'
import { OrderStatus } from '../../../domain/order/enums/order-status.enum'

export const createOrderDto = z.object({
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive')
  })).min(1, 'Order must have at least one item')
})

export const updateOrderStatusDto = z.object({
  status: z.nativeEnum(OrderStatus)
})

export const listOrdersDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
})

export type CreateOrderDto = z.infer<typeof createOrderDto>
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusDto>
export type ListOrdersDto = z.infer<typeof listOrdersDto>