import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Locale } from '../models/enums/locale.enum';

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
        return this.prisma[tableName].findMany({
            skip,
            take,
            where: filters,
            select: {
                id: true,
                [locale]: true,
            },
            include,
        });
    }

    public async getOne(locale: Locale, id: string, include: Record<string, any>, tableName: string) {
        return this.prisma[tableName].findUnique({
            where: {
                id,
            },
            select: {
                [locale]: true,
            },
            include,
        });
    }

    public async updateOne<T extends Record<string, any>>(
        body: T,
        id: string,
        tableName: string,
        updatedRelations: Record<string, any>,
    ) {
        return this.prisma[tableName].update({
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

    public async createOne(body: unknown) {}
}
