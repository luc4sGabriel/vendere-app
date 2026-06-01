import { UserRepository } from '../../domain/user/user.repository'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '../../domain/errors/unauthorized-error'

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)

    if (!user) throw new UnauthorizedError('Invalid credentials')

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) throw new UnauthorizedError('Invalid credentials')

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    }
  }
}