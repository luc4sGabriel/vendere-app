import { CategoryRepository } from '../../domain/category/category.repository'

export class ListCategoriesUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute() {
    return this.categoryRepository.findAll()
  }
}