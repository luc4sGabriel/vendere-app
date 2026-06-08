import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ListCategoriesUseCase } from './list-categories.usecase'
import { CategoryRepository } from '../../domain/category/category.repository'
import { makeCategory } from '../../test/factories'

describe('ListCategoriesUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: ListCategoriesUseCase

  beforeEach(() => {
    categoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new ListCategoriesUseCase(categoryRepository)
  })

  it('deve listar todas as categorias', async () => {
    const categories = [makeCategory({ id: 'c1' }), makeCategory({ id: 'c2', name: 'Roupas' })]
    vi.mocked(categoryRepository.findAll).mockResolvedValue(categories)

    const result = await useCase.execute()

    expect(result).toBe(categories)
    expect(categoryRepository.findAll).toHaveBeenCalled()
  })
})
