import { CategoryRepository } from '../../domain/category/category.repository'
import { logger } from '../../shared/config/logger'

export class ListCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute() {
    const categories = await this.categoryRepository.findAll()

    logger.info({ count: categories.length }, 'Categories listed')

    return categories
  }
}
