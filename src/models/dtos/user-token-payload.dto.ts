import { User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../enums/role.enum';

export class UserTokenPayloadDto {
    constructor(private user: User) {}

    public build() {
        return {
            id: this.user.id,
            avatarImageUrl: this.user.avatarImageUrl,
            email: this.user.email,
            role: this.user.roleId as Role,
            firstName: this.user.firstName,
            secondName: this.user.secondName,
            phone: this.user.phone,
            status: this.user.status,
            jwtid: uuidv4(),
        };
    }
}
