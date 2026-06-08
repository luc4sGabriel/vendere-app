import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetProductUseCase } from './get-product.usecase'
import { ProductRepository } from '../../domain/product/product.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { makeProduct } from '../../test/factories'

describe('GetProductUseCase', () => {
  let productRepository: ProductRepository
  let useCase: GetProductUseCase

  beforeEach(() => {
    productRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new GetProductUseCase(productRepository)
  })

  it('deve retornar produto existente', async () => {
    const product = makeProduct({ id: 'p1' })
    vi.mocked(productRepository.findById).mockResolvedValue(product)

    const result = await useCase.execute('p1')

    expect(result).toBe(product)
  })

  it('deve lançar NotFoundError quando produto não existe', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('p1')).rejects.toThrow(NotFoundError)
  })
})
