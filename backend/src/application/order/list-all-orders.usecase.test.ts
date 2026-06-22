import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListAllOrdersUseCase } from './list-all-orders.usecase'
import { OrderRepository } from '../../domain/order/order.repository'
import { makeOrder } from '../../test/factories'

describe('ListAllOrdersUseCase', () => {
  let orderRepository: OrderRepository
  let useCase: ListAllOrdersUseCase

  beforeEach(() => {
    orderRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      findAllOrders: vi.fn()
    }
    useCase = new ListAllOrdersUseCase(orderRepository)
  })

  it('deve listar todos os pedidos com paginação', async () => {
    const paginatedResult = {
      data: [makeOrder({ userId: 'u1' }), makeOrder({ id: 'order-2', userId: 'u2' })],
      meta: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
    vi.mocked(orderRepository.findAllOrders).mockResolvedValue(paginatedResult)

    const result = await useCase.execute({ page: 1, limit: 10 })

    expect(result).toBe(paginatedResult)
    expect(orderRepository.findAllOrders).toHaveBeenCalledWith({ page: 1, limit: 10 })
  })
})
