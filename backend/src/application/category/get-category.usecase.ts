import { CategoryRepository } from '../../domain/category/category.repository'
import { NotFoundError } from '../../shared/errors/not-found-error'
import { logger } from '../../shared/config/logger'

export class GetCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id)
    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found')
      throw new NotFoundError('Category not found')
    }

    logger.info({ categoryId: id }, 'Category retrieved')

    return category
  }
}
