import { UserEntity } from './user.entity'

export interface CreateUserData {
  name: string
  email: string
  password: string
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>
  findById(id: string): Promise<UserEntity | null>
  create(data: CreateUserData): Promise<UserEntity>
}