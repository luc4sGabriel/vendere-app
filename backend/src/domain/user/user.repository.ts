import { UserEntity } from './user.entity'

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>
  create(data: {
    name: string
    email: string
    password: string
  }): Promise<UserEntity>
}