import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DeleteCategoryUseCase } from './delete-category.usecase'
import { CategoryRepository } from '../../domain/category/category.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { makeCategory } from '../../test/factories'

describe('DeleteCategoryUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: DeleteCategoryUseCase

  beforeEach(() => {
    categoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new DeleteCategoryUseCase(categoryRepository)
  })

  it('deve deletar categoria existente', async () => {
    vi.mocked(categoryRepository.findById).mockResolvedValue(makeCategory({ id: 'c1' }))
    vi.mocked(categoryRepository.delete).mockResolvedValue()

    await useCase.execute('c1')

    expect(categoryRepository.delete).toHaveBeenCalledWith('c1')
  })

  it('deve lançar NotFoundError quando categoria não existe', async () => {
    vi.mocked(categoryRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('c1')).rejects.toThrow(new NotFoundError('Category not found'))
    expect(categoryRepository.delete).not.toHaveBeenCalled()
  })
})
