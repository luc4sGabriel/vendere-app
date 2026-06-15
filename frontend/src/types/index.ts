export interface User {
    id: string
    name: string
    email: string
    role: 'CUSTOMER' | 'SELLER' | 'ADMIN'
  }
  
  export interface Category {
    id: string
    name: string
  }
  
  export interface Product {
    id: string
    name: string
    description: string | null
    price: number
    stock: number
    imageUrl: string | null
    active: boolean
    categoryId: string
    createdAt: string
  }
  
  export interface OrderItem {
    id: string
    productId: string
    quantity: number
    unitPrice: number
  }
  
  export interface Order {
    id: string
    userId: string
    status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
    total: number
    items: OrderItem[]
    createdAt: string
  }
  
  export interface PaginatedResponse<T> {
    data: T[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNextPage: boolean
      hasPreviousPage: boolean
    }
  }
  
  export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
  }