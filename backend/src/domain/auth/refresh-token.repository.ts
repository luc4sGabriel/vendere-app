export interface RefreshTokenRepository {
    create(userId: string, expiresAt: Date): Promise<{ token: string }>
    findByToken(token: string): Promise<{ token: string; userId: string; expiresAt: Date } | null>
    deleteByToken(token: string): Promise<void>
    deleteAllByUserId(userId: string): Promise<void>
  }