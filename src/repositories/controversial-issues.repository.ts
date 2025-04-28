import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { WithTransactionPrisma } from '../types/transaction-prisma.types';
import { RentStatus } from '../models/enums/rent-status.enum';

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

    public async deleteControversialIssues({ rentId, transactionPrisma }: WithTransactionPrisma<{ rentId: string }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;
        await prismaInstance.controversialIssue.deleteMany({
            where: {
                rentId,
            },
        });
    }

    private getParamsForIssuesQuery = (instanceId: string, userId: string) => ({
        where: {
            id: instanceId,
            userId,
            controversialIssues: {
                some: {},
            },
        },
        include: {
            controversialIssues: true,
        },
    });

    public async getControversialIssuesByRentId(rentId: string, userId: string) {
        const rent = await this.prisma.rent.findUnique(this.getParamsForIssuesQuery(rentId, userId));

        return rent?.controversialIssues ?? null;
    }

    public async getControversialIssuesByRoomId(roomId: string, userId: string) {
        const room = await this.prisma.room.findUnique(this.getParamsForIssuesQuery(roomId, userId));
        return room?.controversialIssues ?? null;
    }

    public async getControversialIssuesForModeration(take: number, skip: number) {
        const rents = await this.prisma.rent.findMany({
            where: {
                rentStatus: RentStatus.ISSUES_ON_CHECK,
                controversialIssues: {
                    some: {},
                },
            },
            include: {
                controversialIssues: true,
            },
            take,
            skip,
        });

        return rents?.map(rent => ({ rentId: rent.id, controversialIssues: rent.controversialIssues })) ?? null;
    }
}
