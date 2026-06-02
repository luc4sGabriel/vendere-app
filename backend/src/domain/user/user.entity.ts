import { Role } from "./enums/role.enum";

export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly password: string,
        public readonly role: Role,
        public readonly createdAt: Date,
    ){}
}