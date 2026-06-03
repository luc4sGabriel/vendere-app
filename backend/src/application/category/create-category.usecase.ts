import { CategoryRepository } from '../../domain/category/category.repository'
import { AppError } from '../../shared/errors/app-error'

export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute(name: string) {
    const exists = await this.categoryRepository.findByName(name)
    if (exists) throw new AppError('Category already exists')
    return this.categoryRepository.create(name)
  }
}