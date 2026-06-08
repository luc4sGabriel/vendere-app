import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateProductUseCase } from './update-product.usecase'
import { ProductRepository } from '../../domain/product/product.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { makeProduct } from '../../test/factories'

describe('UpdateProductUseCase', () => {
  let productRepository: ProductRepository
  let useCase: UpdateProductUseCase

  beforeEach(() => {
    productRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new UpdateProductUseCase(productRepository)
  })

  it('deve atualizar produto existente', async () => {
    const updated = makeProduct({ id: 'p1', name: 'Novo Nome' })

    vi.mocked(productRepository.findById).mockResolvedValue(makeProduct({ id: 'p1' }))
    vi.mocked(productRepository.update).mockResolvedValue(updated)

    const result = await useCase.execute('p1', { name: 'Novo Nome' })

    expect(result).toBe(updated)
    expect(productRepository.update).toHaveBeenCalledWith('p1', { name: 'Novo Nome' })
  })

  it('deve lançar NotFoundError quando produto não existe', async () => {
    vi.mocked(productRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('p1', { name: 'Nome' })).rejects.toThrow(NotFoundError)
    expect(productRepository.update).not.toHaveBeenCalled()
  })
})
