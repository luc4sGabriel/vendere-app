import { CategoryEntity } from './category.entity'

export interface CategoryRepository {
  findAll(): Promise<CategoryEntity[]>
  findById(id: string): Promise<CategoryEntity | null>
  findByName(name: string): Promise<CategoryEntity | null>
  create(name: string): Promise<CategoryEntity>
  update(id: string, name: string): Promise<CategoryEntity>
  delete(id: string): Promise<void>
}