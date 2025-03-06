import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { RoomSectionDto } from '../models/dtos/section.dto';
import { SectionAttributeValueDto } from '../models/dtos/section-attribute-value.dto';

@Injectable()
export class SectionsRepository {
    constructor(private prisma: PrismaService) {}

    public async updateSectionAndValues(
        roomId: string,
        section: Omit<RoomSectionDto, 'sectionAttributeValues'>,
        sectionValues: SectionAttributeValueDto[],
    ) {
        return this.prisma.roomSection.update({
            where: {
                id: roomId,
            },
            data: {
                ...section,
                sectionAttributeValues: {
                    update: sectionValues.map(value => {
                        const { attributeId, value: attributeValue } = value;
                        return {
                            where: { id: value.id },
                            data: {
                                value: attributeValue,
                                attributeId,
                            },
                        };
                    }),
                },
            },
        });
    }
}
