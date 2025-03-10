import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { Locale } from '../models/enums/locale.enum';
import { DEFAULT_SECTION } from '../constants/details.constants';

@Injectable()
export class CharacteristicsRepository {
    constructor(private readonly prisma: PrismaService) {}

    public async getDefaultCharacteristicsByRoomTypeId(roomTypeId: string, locale: Locale) {
        return this.prisma.roomTypeAndSection.findFirst({
            where: {
                roomTypeId,
                sectionTypeId: DEFAULT_SECTION,
            },
            select: {
                sectionType: {
                    select: {
                        [locale]: true,
                        characteristicNSectionFields: {
                            select: {
                                characteristic: {
                                    select: {
                                        type: true,
                                        [locale]: true,
                                        characteristicNAttributeFields: {
                                            select: {
                                                attribute: {
                                                    select: {
                                                        [locale]: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}
