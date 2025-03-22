import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Locale } from '../models/enums/locale.enum';
import { WithTransactionPrisma } from '../types/transaction-prisma.types';

@Injectable()
export class DetailsRepository {
    constructor(private prisma: PrismaService) {}

    public async getAll(
        locale: Locale,
        skip: number,
        take: number,
        filters: Record<string, any>,
        tableName: string,
        include: Record<string, any>,
    ) {
        return Promise.all([
            this.prisma[tableName].findMany({
                skip,
                take,
                where: filters,
                select: {
                    id: true,
                    [locale]: true,
                    ...include,
                },
            }),
            this.prisma[tableName].count({ where: filters }),
        ]);
    }

    public async getOne(locale: Locale, id: string, include: Record<string, any>, tableName: string) {
        return this.prisma[tableName].findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                [locale]: true,
                ...include,
            },
        });
    }

    public async updateOne<T extends Record<string, any>>({
        body,
        id,
        tableName,
        updatedRelations,
        transactionPrisma,
    }: WithTransactionPrisma<{
        body: T;
        id: string;
        tableName: string;
        updatedRelations: Record<string, any>;
    }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;
        return prismaInstance[tableName].update({
            where: {
                id,
            },
            data: {
                ...body,
                ...updatedRelations,
            },
        });
    }

    public async deleteOne(id: string, tableName: string) {
        return this.prisma[tableName].delete({
            where: {
                id,
            },
        });
    }

    public async deleteMany({
        tableName,
        condition,
        transactionPrisma,
    }: WithTransactionPrisma<{ tableName: string; condition: Record<string, any> }>) {
        const prismaInstance = transactionPrisma ?? this.prisma;
        return prismaInstance[tableName].deleteMany({
            where: condition,
        });
    }

    public async createOne<T extends Record<string, any>>(
        body: T,
        tableName: string,
        createdRelations: Record<string, any>,
    ) {
        return this.prisma[tableName].create({
            data: {
                ...body,
                ...createdRelations,
            },
        });
    }
}
