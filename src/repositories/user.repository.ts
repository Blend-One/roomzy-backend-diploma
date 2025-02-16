import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {}

    public async findUserById(id: string) {
        return this.prisma.user.findUnique({ where: { id } });
    }
}
