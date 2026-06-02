import { User } from '@prisma/client'
import { UserEntity } from '../../../domain/user/user.entity'
import { Role } from '../../../domain/user/enums/role.enum'

export class UserMapper {
  static toDomain(raw: User): UserEntity {
    return new UserEntity(
      raw.id,
      raw.name,
      raw.email,
      raw.password,
      raw.role as Role,
      raw.createdAt
    )
  }
}