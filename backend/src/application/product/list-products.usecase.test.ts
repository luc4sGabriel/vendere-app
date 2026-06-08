import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListProductsUseCase } from './list-products.usecase'
import { ProductRepository } from '../../domain/product/product.repository'
import { makeProduct } from '../../test/factories'

describe('ListProductsUseCase', () => {
  let productRepository: ProductRepository
  let useCase: ListProductsUseCase

  beforeEach(() => {
    productRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new ListProductsUseCase(productRepository)
  })

  it('deve listar produtos com filtros', async () => {
    const paginatedResult = {
      data: [makeProduct()],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
    const filters = { categoryId: 'c1', name: 'Camiseta' }

    vi.mocked(productRepository.findAll).mockResolvedValue(paginatedResult)

    const result = await useCase.execute(filters)

    expect(result).toBe(paginatedResult)
    expect(productRepository.findAll).toHaveBeenCalledWith(filters)
  })

  it('deve listar produtos sem filtros', async () => {
    const paginatedResult = {
      data: [],
      meta: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }

    vi.mocked(productRepository.findAll).mockResolvedValue(paginatedResult)

    const result = await useCase.execute()

    expect(result).toBe(paginatedResult)
    expect(productRepository.findAll).toHaveBeenCalledWith({})
  })
})
