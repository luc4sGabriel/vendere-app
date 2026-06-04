import { CategoryRepository } from '../../domain/category/category.repository'
import { AppError } from '../../shared/errors/app-error'
import { logger } from '../../shared/config/logger'

export class UpdateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(id: string, name: string) {
    const category = await this.categoryRepository.findById(id)
    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found')
      throw new AppError('Category not found', 404)
    }

    const updated = await this.categoryRepository.update(id, name)

    logger.info({ categoryId: id, name }, 'Category updated')

    return updated
  }
}
