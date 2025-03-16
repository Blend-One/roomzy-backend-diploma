import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Locale } from '../models/enums/locale.enum';
import { calculateRelations } from '../utils/calculate-relations.utils';
import { DEFAULT_SECTION } from '../constants/details.constants';

@Injectable()
export class CharacteristicsRepository {
    constructor(private readonly prisma: PrismaService) {}

    public async getDefaultCharacteristicsByRoomTypeId(roomTypeId: string, locale: Locale) {
        const relationsQuery = calculateRelations(
            [
                {
                    joinedField: 'sectionType',
                },
                {
                    joinedField: 'characteristicNSectionFields',
                },
                {
                    joinedField: 'characteristic',
                },
                {
                    withId: true,
                    withLocale: true,
                    additionalFields: ['type'],
                    joinedField: 'characteristicNAttributeFields',
                },
                {
                    joinedField: 'attribute',
                },
                {
                    withId: true,
                    withLocale: true,
                    joinedField: null,
                },
            ],
            locale,
        );

        return this.prisma.roomTypeAndSection.findFirst({
            where: {
                roomTypeId,
                sectionTypeId: 'BEDROOM',
            },
            select: relationsQuery,
        });
    }
}
