import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { WithTransactionPrisma } from '../types/transaction-prisma.types';

@Injectable()
export class ControversialIssuesRepository {
    constructor(private prisma: PrismaService) {}

    public async createControversialIssues({
        transactionPrisma,
        issues,
        rentId,
        roomId,
    }: WithTransactionPrisma<{
        issues: Array<{ description: string; imageId: string }>;
        rentId: string;
        roomId: string;
    }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;
        return prismaInstance.controversialIssue.createManyAndReturn({
            data: issues.map(issue => ({
                description: issue.description,
                imageId: issue.imageId,
                rentId,
                roomId,
                date: new Date().toISOString(),
            })),
        });
    }

    public async getControversialIssuesByRentId() {}

    public async getControversialIssuesByRoomId() {}

    public async getControversialIssuesForModeration() {}
}
