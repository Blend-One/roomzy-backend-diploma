import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';
import { AuthRequestDto } from 'models/requests-schemas/auth.request';
import { Role } from 'models/enums/role.enum';

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {}

    public async findUserById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    public async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    public async createUser(userInfo: AuthRequestDto) {
        const { email, password } = userInfo;
        return this.prisma.user.create({ data: { email, password, roleId: Role.USER } });
    }
}
