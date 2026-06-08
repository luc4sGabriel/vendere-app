import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetCategoryUseCase } from './get-category.usecase'
import { CategoryRepository } from '../../domain/category/category.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { makeCategory } from '../../test/factories'

describe('GetCategoryUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: GetCategoryUseCase

  beforeEach(() => {
    categoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new GetCategoryUseCase(categoryRepository)
  })

  it('deve retornar categoria existente', async () => {
    const category = makeCategory({ id: 'c1' })
    vi.mocked(categoryRepository.findById).mockResolvedValue(category)

    const result = await useCase.execute('c1')

    expect(result).toBe(category)
  })

  it('deve lançar NotFoundError quando categoria não existe', async () => {
    vi.mocked(categoryRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('c1')).rejects.toThrow(new NotFoundError('Category not found'))
  })
})
