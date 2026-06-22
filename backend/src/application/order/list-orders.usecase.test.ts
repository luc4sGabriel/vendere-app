import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListOrdersUseCase } from './list-orders.usecase'
import { OrderRepository } from '../../domain/order/order.repository'
import { makeOrder } from '../../test/factories'

describe('ListOrdersUseCase', () => {
  let orderRepository: OrderRepository
  let useCase: ListOrdersUseCase

  beforeEach(() => {
    orderRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      findAllOrders: vi.fn()
    }
    useCase = new ListOrdersUseCase(orderRepository)
  })

  it('deve listar pedidos do usuário com paginação', async () => {
    const paginatedResult = {
      data: [makeOrder({ userId: 'u1' })],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
    vi.mocked(orderRepository.findAll).mockResolvedValue(paginatedResult)

    const result = await useCase.execute('u1', { page: 1, limit: 10 })

    expect(result).toBe(paginatedResult)
    expect(orderRepository.findAll).toHaveBeenCalledWith('u1', { page: 1, limit: 10 })
  })
})
