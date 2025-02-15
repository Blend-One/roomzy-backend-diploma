import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma.service';

@Injectable()
export class UserRepository {
    constructor(private prisma: PrismaService) {}

    public async getUserCount() {
        return this.prisma.user.count();
    }
}
