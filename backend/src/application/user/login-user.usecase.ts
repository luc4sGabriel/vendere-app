import { UserRepository } from '../../domain/user/user.repository'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../../shared/errors/unauthorized-error'
import { env } from '../../shared/config/env'
import { BadRequestError } from '../../shared/errors/bad-request-error'
import { logger } from '../../shared/config/logger'
import { RefreshTokenRepository } from '../../domain/auth/refresh-token.repository'

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private refreshTokenRepository: RefreshTokenRepository
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      logger.warn({ email }, 'Invalid credentials')
      throw new UnauthorizedError('Invalid credentials')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      logger.warn({ email }, 'Invalid credentials')
      throw new UnauthorizedError('Invalid credentials')
    }

    await this.refreshTokenRepository.deleteAllByUserId(user.id)

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      env.JWT_SECRET as string,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    )

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    const { token: refreshToken } = await this.refreshTokenRepository.create(user.id, expiresAt)

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    }
  }
}
