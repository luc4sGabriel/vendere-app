import { RefreshTokenRepository } from '../../domain/auth/refresh-token.repository'
import { UserRepository } from '../../domain/user/user.repository'
import { AppError } from '../../shared/errors/app-error'
import { env } from '../../shared/config/env'
import jwt from 'jsonwebtoken'

export class RefreshTokenUseCase {
  constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private userRepository: UserRepository
  ) {}

  async execute(token: string) {
    const refreshToken = await this.refreshTokenRepository.findByToken(token)

    if (!refreshToken) throw new AppError('Invalid refresh token', 401)
    if (refreshToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.deleteByToken(token)
      throw new AppError('Refresh token expired', 401)
    }

    const user = await this.userRepository.findById(refreshToken.userId)
    if (!user) throw new AppError('User not found', 404)

    await this.refreshTokenRepository.deleteByToken(token)

    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET as string,
        { expiresIn: env.JWT_EXPIRES_IN as any }
      )

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    const { token: newRefreshToken } = await this.refreshTokenRepository.create(user.id, expiresAt)

    return { accessToken, refreshToken: newRefreshToken }
  }
}