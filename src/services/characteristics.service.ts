import { Injectable } from '@nestjs/common';
import { DetailsRepository } from '../repositories/details.repository';
import { Locale } from '../models/enums/locale.enum';
import { calculatePaginationData } from '../utils/calculate-pagination-data.utils';
import {
    CreateCharacteristicRequestDto,
    UpdateCharacteristicRequestDto,
} from '../models/requests-schemas/create-characteristic.request';
import { CharType } from '../models/enums/char-type.enum';
import { CommonRepository } from '../repositories/common.repository';

@Injectable()
export class CharacteristicsService {
    constructor(
        private readonly detailsRepository: DetailsRepository,
        private readonly commonRepository: CommonRepository,
    ) {}

    public async getAllCharacteristics(name: string, page: number, limit: number, locale: Locale) {
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
            'characteristic',
            {
                characteristicNAttributeFields: {
                    select: {
                        attribute: {
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

    public async createCharacteristic(body: CreateCharacteristicRequestDto) {
        const { attributeIds, ...bodyValues } = body;
        return this.detailsRepository.createOne(bodyValues, 'characteristic', {
            type: CharType.OPTIONS,
            characteristicNAttributeFields: {
                create: Array.from(new Set(attributeIds)).map(attributeId => ({
                    attribute: {
                        connect: {
                            id: attributeId,
                        },
                    },
                })),
            },
        });
    }

    public async getCharacteristic(locale: Locale, id: string) {
        return this.detailsRepository.getOne(
            locale,
            id,
            {
                characteristicNAttributeFields: {
                    select: {
                        id: true,
                        attribute: {
                            select: {
                                id: true,
                                [locale]: true,
                            },
                        },
                    },
                },
            },
            'characteristic',
        );
    }

    public async updateCharacteristic(body: UpdateCharacteristicRequestDto, id: string) {
        const { attributeIds, ...bodyValues } = body;
        /* eslint-disable indent */
        const result = await this.commonRepository.createTransactionWithCallback(async prisma => {
            if (!!attributeIds?.length) {
                await this.detailsRepository.deleteMany({
                    tableName: 'characteristicAndAttribute',
                    transactionPrisma: prisma,
                    condition: {
                        characteristicId: id,
                    },
                });
            }
            return await this.detailsRepository.updateOne({
                body: bodyValues,
                id,
                tableName: 'characteristic',
                transactionPrisma: prisma,
                updatedRelations: attributeIds?.length
                    ? {
                          characteristicNAttributeFields: {
                              create: attributeIds.map(attributeId => ({
                                  attribute: {
                                      connect: {
                                          id: attributeId,
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
    public async deleteCharacteristic(id: string) {
        return this.detailsRepository.deleteOne(id, 'characteristic');
    }
}
