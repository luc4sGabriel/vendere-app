import { UserRepository } from '../../domain/user/user.repository'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../../shared/errors/unauthorized-error'
import { env } from '../../shared/config/env'
import { BadRequestError } from '../../shared/errors/bad-request-error'

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new UnauthorizedError('Invalid credentials')

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) throw new UnauthorizedError('Invalid credentials')

      const secret = env.JWT_SECRET
     if (!secret) {
       throw new BadRequestError('JWT_SECRET environment variable is required')
     }
     const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' })

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    }
  }
}