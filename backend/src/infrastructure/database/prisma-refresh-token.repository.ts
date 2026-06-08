import { prisma } from '../lib/prisma'
import { RefreshTokenRepository } from '../../domain/auth/refresh-token.repository'
import { v4 as uuidv4 } from 'uuid'

export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  async create(userId: string, expiresAt: Date) {
    const token = uuidv4()
    await prisma.refreshToken.create({ data: { token, userId, expiresAt } })
    return { token }
  }

  async findByToken(token: string) {
    const refreshToken = await prisma.refreshToken.findUnique({ where: { token } })
    if (!refreshToken) return null
    return {
      token: refreshToken.token,
      userId: refreshToken.userId,
      expiresAt: refreshToken.expiresAt
    }
  }

  async deleteByToken(token: string) {
    await prisma.refreshToken.delete({ where: { token } })
  }

  async deleteAllByUserId(userId: string) {
    await prisma.refreshToken.deleteMany({ where: { userId } })
  }
}