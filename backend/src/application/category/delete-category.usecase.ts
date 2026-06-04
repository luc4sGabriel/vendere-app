import { CategoryRepository } from '../../domain/category/category.repository'
import { logger } from '../../shared/config/logger'
import { NotFoundError } from '../../shared/errors/not-found-error'

export class DeleteCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id)
    if (!category) {
      logger.warn({ categoryId: id }, 'Category not found')
      throw new NotFoundError('Category not found')
    }

    await this.categoryRepository.delete(id)

    logger.info({ categoryId: id }, 'Category deleted')
  }
}
