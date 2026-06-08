import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UpdateCategoryUseCase } from './update-category.usecase'
import { CategoryRepository } from '../../domain/category/category.repository'
import { AppError } from '../../shared/errors/app-error'
import { makeCategory } from '../../test/factories'

describe('UpdateCategoryUseCase', () => {
  let categoryRepository: CategoryRepository
  let useCase: UpdateCategoryUseCase

  beforeEach(() => {
    categoryRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByName: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
    useCase = new UpdateCategoryUseCase(categoryRepository)
  })

  it('deve atualizar categoria existente', async () => {
    const updated = makeCategory({ id: 'c1', name: 'Novo Nome' })

    vi.mocked(categoryRepository.findById).mockResolvedValue(makeCategory({ id: 'c1' }))
    vi.mocked(categoryRepository.update).mockResolvedValue(updated)

    const result = await useCase.execute('c1', 'Novo Nome')

    expect(result).toBe(updated)
    expect(categoryRepository.update).toHaveBeenCalledWith('c1', 'Novo Nome')
  })

  it('deve lançar AppError quando categoria não existe', async () => {
    vi.mocked(categoryRepository.findById).mockResolvedValue(null)

    await expect(useCase.execute('c1', 'Nome')).rejects.toThrow(new AppError('Category not found', 404))
    expect(categoryRepository.update).not.toHaveBeenCalled()
  })
})
