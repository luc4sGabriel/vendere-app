import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateCategoryUseCase } from './create-category.usecase'
import { CategoryRepository } from '../../domain/category/category.repository'
import { AppError } from '../../shared/errors/app-error'
import { makeCategory } from '../../test/factories'

describe('CreateCategoryUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: CreateCategoryUseCase

  beforeEach(() => {
    categoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new CreateCategoryUseCase(categoryRepository)
  })

  it('deve criar categoria quando nome não existe', async () => {
    const category = makeCategory({ name: 'Eletrônicos' })

    vi.mocked(categoryRepository.findByName).mockResolvedValue(null)
    vi.mocked(categoryRepository.create).mockResolvedValue(category)

    const result = await useCase.execute('Eletrônicos')

    expect(result).toBe(category)
    expect(categoryRepository.create).toHaveBeenCalledWith('Eletrônicos')
  })

  it('deve lançar AppError quando categoria já existe', async () => {
    vi.mocked(categoryRepository.findByName).mockResolvedValue(makeCategory())

    await expect(useCase.execute('Category')).rejects.toThrow(new AppError('Category already exists'))
    expect(categoryRepository.create).not.toHaveBeenCalled()
  })
})
