import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { TransactionPrisma } from '../types/transaction-prisma.types';

@Injectable()
export class CommonRepository {
    constructor(private prisma: PrismaService) {}

    public async createTransaction(operations: any[]) {
        return this.prisma.$transaction(operations);
    }

    public async createTransactionWithCallback(cb: (prisma: TransactionPrisma) => any) {
        return this.prisma.$transaction(cb);
    }
}
