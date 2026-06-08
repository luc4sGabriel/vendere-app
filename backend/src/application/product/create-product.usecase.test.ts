import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateProductUseCase } from './create-product.usecase'
import { ProductRepository } from '../../domain/product/product.repository'
import { makeProduct } from '../../test/factories'

describe('CreateProductUseCase', () => {
  let productRepository: ProductRepository
  let useCase: CreateProductUseCase

  beforeEach(() => {
    productRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new CreateProductUseCase(productRepository)
  })

  it('deve criar produto', async () => {
    const data = {
      name: 'Camiseta',
      price: 49.9,
      stock: 10,
      categoryId: 'c1'
    }
    const product = makeProduct({ name: 'Camiseta', price: 49.9, stock: 10, categoryId: 'c1' })

    vi.mocked(productRepository.create).mockResolvedValue(product)

    const result = await useCase.execute(data)

    expect(result).toBe(product)
    expect(productRepository.create).toHaveBeenCalledWith(data)
  })
})
