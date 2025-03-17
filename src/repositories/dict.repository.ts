import { Injectable } from '@nestjs/common';
import { Locale } from '../models/enums/locale.enum';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class DictRepository {
    constructor(private prisma: PrismaService) {}

    public async getDictData(tableName: string, locale: Locale, conditions?: Record<string, string>) {
        const query = {
            select: {
                id: true,
                [locale]: true,
            },
        };

        if (conditions) {
            query['where'] = conditions;
        }

        return this.prisma[tableName].findMany(query);
    }
}
