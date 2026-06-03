import { ProductEntity } from './product.entity'
import { PaginationParams, PaginatedResponse } from '../../shared/types/pagination.types'

export interface CreateProductData {
  name: string
  description?: string
  price: number
  stock: number
  imageUrl?: string
  categoryId: string
}

export interface ProductFilters extends PaginationParams {
  categoryId?: string
  name?: string
}

export interface ProductRepository {
  findAll(filters: ProductFilters): Promise<PaginatedResponse<ProductEntity>>
  findById(id: string): Promise<ProductEntity | null>
  create(data: CreateProductData): Promise<ProductEntity>
  update(id: string, data: Partial<CreateProductData>): Promise<ProductEntity>
  delete(id: string): Promise<void>
}