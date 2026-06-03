import { CategoryRepository } from '../../domain/category/category.repository'
import { AppError } from '../../shared/errors/app-error'
import { NotFoundError } from '../../shared/errors/not-found-error'

export class GetCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(id: string) {
    const category = await this.categoryRepository.findById(id)
    if (!category) throw new NotFoundError('Category not found')
    return category
  }
}