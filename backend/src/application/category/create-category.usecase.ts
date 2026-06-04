import { CategoryRepository } from '../../domain/category/category.repository'
import { AppError } from '../../shared/errors/app-error'
import { logger } from '../../shared/config/logger'

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(name: string) {
    const exists = await this.categoryRepository.findByName(name)
    if (exists) {
      logger.warn({ name }, 'Category already exists')
      throw new AppError('Category already exists')
    }

    const category = await this.categoryRepository.create(name)

    logger.info({ categoryId: category.id, name }, 'Category created')

    return category
  }
}
