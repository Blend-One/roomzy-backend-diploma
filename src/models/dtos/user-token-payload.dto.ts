import { User } from '@prisma/client';

export class UserTokenPayloadDto {
    constructor(private user: User) {}

    public build() {
        return {
            id: this.user.id,
            avatarImageUrl: this.user.avatarImageUrl,
            email: this.user.email,
            roleId: this.user.roleId,
            firstName: this.user.firstName,
            secondName: this.user.secondName,
            phone: this.user.phone,
        };
    }
}
