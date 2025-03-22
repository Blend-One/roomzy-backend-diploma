import { BadRequestException, Injectable } from '@nestjs/common';
import { DetailsRepository } from 'repositories/details.repository';
import { Locale } from 'models/enums/locale.enum';
import { calculatePaginationData } from 'utils/calculate-pagination-data.utils';
import { CommonRepository } from 'repositories/common.repository';
import {
    CreateSectionTypeRequestDto,
    UpdateSectionTypeRequestDto,
} from 'models/requests-schemas/create-section-type.request';
import { DetailsService } from './details.service';
import { transformQueryResult } from '../utils/transform-query-result.utils';

@Injectable()
export class SectionTypesService {
    constructor(
        private readonly detailsRepository: DetailsRepository,
        private readonly commonRepository: CommonRepository,
        private readonly detailsService: DetailsService,
    ) {}

    public async getAllSectionTypes(name: string, page: number, limit: number, locale: Locale) {
        const { skip, take } = calculatePaginationData(page, limit);
        const [sectionTypes, count] = await this.detailsRepository.getAll(
            locale,
            skip,
            take,
            this.detailsService.getNameFilter(locale, name),
            'roomSectionType',
            this.detailsService.obtainParamsForGetQuery('characteristicNSectionFields', 'characteristic', locale),
        );
        return {
            sectionTypes: transformQueryResult(
                {
                    renamedFields: {
                        characteristicNSectionFields: 'characteristics',
                        [locale]: 'name',
                    },
                    objectParsingSequence: ['characteristics', 'characteristic'],
                },
                sectionTypes,
            ),
            count,
        };
    }

    public async createSectionType(body: CreateSectionTypeRequestDto) {
        const { characteristicIds, ...bodyValues } = body;
        return this.detailsRepository
            .createOne(
                bodyValues,
                'roomSectionType',
                this.detailsService.obtainParamsForCreationQuery(
                    characteristicIds,
                    'characteristicNSectionFields',
                    'characteristic',
                ),
            )
            .catch(err => {
                throw new BadRequestException(err?.meta?.cause);
            });
    }

    public async getSectionType(locale: Locale, id: string) {
        const sectionType = await this.detailsRepository.getOne(
            locale,
            id,
            this.detailsService.obtainParamsForGetQuery('characteristicNSectionFields', 'characteristic', locale),
            'roomSectionType',
        );

        return transformQueryResult(
            {
                renamedFields: {
                    characteristicNSectionFields: 'characteristics',
                    [locale]: 'name',
                },
                objectParsingSequence: ['characteristics', 'characteristic'],
            },
            sectionType,
        );
    }

    public async updateSectionType(body: UpdateSectionTypeRequestDto, id: string) {
        const { characteristicIds, ...bodyValues } = body;
        const result = await this.commonRepository
            .createTransactionWithCallback(async prisma => {
                if (!!characteristicIds?.length) {
                    await this.detailsRepository.deleteMany(
                        this.detailsService.obtainParamsForDeleteRelations(
                            prisma,
                            'characteristicAndSection',
                            'sectionTypeId',
                            id,
                        ),
                    );
                }
                return await this.detailsRepository.updateOne(
                    this.detailsService.obtainParamsForUpdate({
                        body: bodyValues,
                        id,
                        tableName: 'roomSectionType',
                        prisma,
                        idsForRelation: characteristicIds,
                        relationField: 'characteristicNSectionFields',
                        fieldWithinRelation: 'characteristic',
                    }),
                );
            })
            .catch(err => {
                throw new BadRequestException(err?.meta?.cause);
            });

        return result;
    }

    public async deleteSectionType(id: string) {
        return this.detailsRepository.deleteOne(id, 'roomSectionType').catch(err => {
            throw new BadRequestException(err?.meta?.cause);
        });
    }
}
