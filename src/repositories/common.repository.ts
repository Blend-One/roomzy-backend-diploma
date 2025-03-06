import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CommonRepository {
    constructor(private prisma: PrismaService) {}

    public async createTransaction(operations: any[]) {
        return this.prisma.$transaction(operations);
    }
}
