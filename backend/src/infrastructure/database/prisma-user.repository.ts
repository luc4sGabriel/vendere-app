import { prisma } from '../lib/prisma'
import { UserRepository, CreateUserData } from '../../domain/user/user.repository'
import { UserMapper } from './mappers/user.mapper'
import { UserEntity } from '../../domain/user/user.entity'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? UserMapper.toDomain(user) : null
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? UserMapper.toDomain(user) : null
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await prisma.user.create({ data })
    return UserMapper.toDomain(user)
  }
}