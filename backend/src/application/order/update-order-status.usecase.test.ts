import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateOrderStatusUseCase } from './update-order-status.usecase'
import { OrderRepository } from '../../domain/order/order.repository'
import { OrderStatus } from '../../domain/order/enums/order-status.enum'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { makeOrder } from '../../test/factories'

describe('UpdateOrderStatusUseCase', () => {
  let orderRepository: OrderRepository
  let useCase: UpdateOrderStatusUseCase

  beforeEach(() => {
    orderRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      findAllOrders: vi.fn()
    }
    useCase = new UpdateOrderStatusUseCase(orderRepository)
  })

  it('deve atualizar status do pedido', async () => {
    const order = makeOrder({ id: 'o1' })
    const updated = makeOrder({ id: 'o1', status: OrderStatus.SHIPPED })

    vi.mocked(orderRepository.findById).mockResolvedValue(order)
    vi.mocked(orderRepository.updateStatus).mockResolvedValue(updated)

    const result = await useCase.execute('o1', OrderStatus.SHIPPED)

    expect(result).toBe(updated)
    expect(orderRepository.updateStatus).toHaveBeenCalledWith('o1', OrderStatus.SHIPPED)
  })

  it('deve lançar NotFoundError quando pedido não existe', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('o1', OrderStatus.SHIPPED)).rejects.toThrow(NotFoundError)
    expect(orderRepository.updateStatus).not.toHaveBeenCalled()
  })
})
