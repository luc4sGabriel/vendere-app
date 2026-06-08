import { RefreshTokenRepository } from '../../domain/auth/refresh-token.repository'

export class LogoutUserUseCase {
  constructor(private refreshTokenRepository: RefreshTokenRepository) {}

  async execute(userId: string) {
    await this.refreshTokenRepository.deleteAllByUserId(userId)
  }
}