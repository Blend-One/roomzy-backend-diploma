import { Injectable } from '@nestjs/common';
import { DetailsRepository } from 'repositories/details.repository';
import { Locale } from 'models/enums/locale.enum';
import { calculatePaginationData } from 'utils/calculate-pagination-data.utils';
import { CommonRepository } from 'repositories/common.repository';
import {
    CreateSectionTypeRequestDto,
    UpdateSectionTypeRequestDto,
} from 'models/requests-schemas/create-section-type.request';

@Injectable()
export class SectionTypesService {
    constructor(
        private readonly detailsRepository: DetailsRepository,
        private readonly commonRepository: CommonRepository,
    ) {}

    public async getAllSectionTypes(name: string, page: number, limit: number, locale: Locale) {
        const { skip, take } = calculatePaginationData(page, limit);
        return this.detailsRepository.getAll(
            locale,
            skip,
            take,
            {
                [locale]: {
                    contains: name,
                },
            },
            'roomSectionType',
            {
                characteristicNSectionFields: {
                    select: {
                        characteristic: {
                            select: {
                                id: true,
                                [locale]: true,
                            },
                        },
                    },
                },
            },
        );
    }

    public async createSectionType(body: CreateSectionTypeRequestDto) {
        const { characteristicIds, ...bodyValues } = body;
        return this.detailsRepository.createOne(bodyValues, 'roomSectionType', {
            characteristicNSectionFields: {
                create: Array.from(new Set(characteristicIds)).map(characteristicId => ({
                    characteristic: {
                        connect: {
                            id: characteristicId,
                        },
                    },
                })),
            },
        });
    }

    public async getSectionType(locale: Locale, id: string) {
        return this.detailsRepository.getOne(
            locale,
            id,
            {
                characteristicNSectionFields: {
                    select: {
                        id: true,
                        characteristic: {
                            select: {
                                id: true,
                                [locale]: true,
                            },
                        },
                    },
                },
            },
            'roomSectionType',
        );
    }

    public async updateSectionType(body: UpdateSectionTypeRequestDto, id: string) {
        const { characteristicIds, ...bodyValues } = body;
        /* eslint-disable indent */
        const result = await this.commonRepository.createTransactionWithCallback(async prisma => {
            if (!!characteristicIds?.length) {
                await this.detailsRepository.deleteMany({
                    tableName: 'characteristicAndSection',
                    transactionPrisma: prisma,
                    condition: {
                        sectionTypeId: id,
                    },
                });
            }
            return await this.detailsRepository.updateOne({
                body: bodyValues,
                id,
                tableName: 'roomSectionType',
                transactionPrisma: prisma,
                updatedRelations: characteristicIds?.length
                    ? {
                          characteristicNSectionFields: {
                              create: characteristicIds.map(characteristicId => ({
                                  characteristic: {
                                      connect: {
                                          id: characteristicId,
                                      },
                                  },
                              })),
                          },
                      }
                    : {},
            });
        });

        return result;
    }

    /* eslint-enable indent */
    public async deleteSectionType(id: string) {
        return this.detailsRepository.deleteOne(id, 'roomSectionType');
    }
}
