import { Injectable } from '@nestjs/common';
import { Locale } from '../models/enums/locale.enum';
import { PrismaService } from '../services/prisma.service';
import { calculateRelations } from '../utils/calculate-relations.utils';

@Injectable()
export class RoomTypesRepository {
    constructor(private readonly prisma: PrismaService) {}

    public async getRoomTypeById(id: string, locale: Locale) {
        const relationsQuery = calculateRelations(
            [
                {
                    withId: true,
                    withLocale: true,
                    joinedField: 'roomTypeNSectionFields',
                },
                {
                    joinedField: 'sectionType',
                },
                {
                    withId: true,
                    withLocale: true,
                    joinedField: 'characteristicNSectionFields',
                },
                {
                    joinedField: 'characteristic',
                },
                {
                    withId: true,
                    withLocale: true,
                    joinedField: 'characteristicNAttributeFields',
                },
                {
                    joinedField: 'attribute',
                },
                {
                    joinedField: null,
                    withId: true,
                    withLocale: true,
                },
            ],
            locale,
        );

        return this.prisma.roomType.findUnique({
            where: {
                id,
            },
            select: relationsQuery,
        });
    }
}
