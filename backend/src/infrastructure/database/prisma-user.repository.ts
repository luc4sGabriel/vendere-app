import { prisma } from '../lib/prisma'
import { UserEntity } from '../../domain/user/user.entity'
import { UserRepository } from '../../domain/user/user.repository'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) return null

    //TODO: Need to do a mapper later
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.createdAt
    )
  }

  async create(data: { name: string; email: string; password: string }): Promise<UserEntity> {
    const user = await prisma.user.create({ data })
    
    //TODO: Need to do a mapper later
    return new UserEntity(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.createdAt
    )
  }
}