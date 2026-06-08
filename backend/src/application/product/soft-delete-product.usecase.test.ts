import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteProductUseCase } from './soft-delete-product.usecase'
import { ProductRepository } from '../../domain/product/product.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { makeProduct } from '../../test/factories'

describe('DeleteProductUseCase', () => {
  let productRepository: ProductRepository
  let useCase: DeleteProductUseCase

  beforeEach(() => {
    productRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new DeleteProductUseCase(productRepository)
  })

  it('deve fazer soft delete de produto existente', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(makeProduct({ id: 'p1' }))
    vi.mocked(productRepository.delete).mockResolvedValue(undefined)

    const result = await useCase.execute('p1')

    expect(result).toBeUndefined()
    expect(productRepository.delete).toHaveBeenCalledWith('p1')
  })

  it('deve lançar NotFoundError quando produto não existe', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('p1')).rejects.toThrow(NotFoundError)
    expect(productRepository.delete).not.toHaveBeenCalled()
  })
})
