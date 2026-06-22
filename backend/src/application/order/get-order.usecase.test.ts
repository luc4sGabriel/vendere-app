import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetOrderUseCase } from './get-order.usecase'
import { OrderRepository } from '../../domain/order/order.repository'
import { AppError } from '../../shared/errors/app-error'
import { ForbiddenError } from '../../shared/errors/forbidden-error'
import { makeOrder } from '../../test/factories'

describe('GetOrderUseCase', () => {
  let orderRepository: OrderRepository
  let useCase: GetOrderUseCase

  beforeEach(() => {
    orderRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn(),
      findAllOrders: vi.fn()
    }
    useCase = new GetOrderUseCase(orderRepository)
  })

  it('deve retornar pedido quando usuário é o dono', async () => {
    const order = makeOrder({ id: 'o1', userId: 'u1' })
    vi.mocked(orderRepository.findById).mockResolvedValue(order)

    const result = await useCase.execute('o1', 'u1', 'CUSTOMER')

    expect(result).toBe(order)
  })

  it('deve retornar pedido quando usuário é ADMIN', async () => {
    const order = makeOrder({ id: 'o1', userId: 'other-user' })
    vi.mocked(orderRepository.findById).mockResolvedValue(order)

    const result = await useCase.execute('o1', 'u1', 'ADMIN')

    expect(result).toBe(order)
  })

  it('deve lançar AppError quando pedido não existe', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('o1', 'u1', 'CUSTOMER')).rejects.toThrow(new AppError('Order not found', 404))
  })

  it('deve lançar ForbiddenError quando usuário não é dono nem ADMIN', async () => {
    vi.mocked(orderRepository.findById).mockResolvedValue(makeOrder({ userId: 'other-user' }))

    await expect(useCase.execute('o1', 'u1', 'CUSTOMER')).rejects.toThrow(ForbiddenError)
  })
})
