import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateOrderUseCase } from './create-order.usecase'
import { OrderRepository } from '../../domain/order/order.repository'
import { ProductRepository } from '../../domain/product/product.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { makeOrder, makeProduct } from '../../test/factories'

describe('CreateOrderUseCase', () => {
  let orderRepository: OrderRepository
  let productRepository: ProductRepository
  let useCase: CreateOrderUseCase

  beforeEach(() => {
    orderRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      updateStatus: vi.fn()
    }
    productRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new CreateOrderUseCase(orderRepository, productRepository)
  })

  it('deve criar pedido com total calculado corretamente', async () => {
    const product = makeProduct({ id: 'p1', price: 10, stock: 5 })
    const order = makeOrder({ id: 'o1', userId: 'u1', total: 20 })

    vi.mocked(productRepository.findById).mockResolvedValue(product)
    vi.mocked(orderRepository.create).mockResolvedValue(order)

    const result = await useCase.execute('u1', [{ productId: 'p1', quantity: 2 }])

    expect(result).toBe(order)
    expect(orderRepository.create).toHaveBeenCalledWith({
      userId: 'u1',
      total: 20,
      items: [{ productId: 'p1', quantity: 2, unitPrice: 10 }]
    })
  })

  it('deve lançar NotFoundError quando produto não existe', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('u1', [{ productId: 'invalid', quantity: 1 }])).rejects.toThrow(NotFoundError)
    expect(orderRepository.create).not.toHaveBeenCalled()
  })

  it('deve lançar NotFoundError quando produto está inativo', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(makeProduct({ active: false }))

    await expect(useCase.execute('u1', [{ productId: 'p1', quantity: 1 }])).rejects.toThrow(NotFoundError)
    expect(orderRepository.create).not.toHaveBeenCalled()
  })

  it('deve lançar NotFoundError quando estoque é insuficiente', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(makeProduct({ name: 'Camiseta', stock: 1 }))

    await expect(useCase.execute('u1', [{ productId: 'p1', quantity: 3 }])).rejects.toThrow(
      'Insufficient stock for Camiseta not found'
    )
    expect(orderRepository.create).not.toHaveBeenCalled()
  })
})
