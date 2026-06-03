import { PaginatedResponse, PaginationMeta } from '../types/pagination.types'

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit)
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  }
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  return {
    data,
    meta: buildPaginationMeta(total, page, limit)
  }
}

export function getPrismaSkip(page: number, limit: number): number {
  return (page - 1) * limit
}