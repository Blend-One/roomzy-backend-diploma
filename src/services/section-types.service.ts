import { Injectable } from '@nestjs/common';
import { DetailsRepository } from 'repositories/details.repository';
import { Locale } from 'models/enums/locale.enum';
import { calculatePaginationData } from 'utils/calculate-pagination-data.utils';
import { CommonRepository } from 'repositories/common.repository';
import {
    CreateSectionTypeRequestDto,
    UpdateSectionTypeRequestDto,
} from 'models/requests-schemas/create-section-type.request';
import { DetailsService } from './details.service';

@Injectable()
export class SectionTypesService {
    constructor(
        private readonly detailsRepository: DetailsRepository,
        private readonly commonRepository: CommonRepository,
        private readonly detailsService: DetailsService,
    ) {}

    public async getAllSectionTypes(name: string, page: number, limit: number, locale: Locale) {
        const { skip, take } = calculatePaginationData(page, limit);
        return this.detailsRepository.getAll(
            locale,
            skip,
            take,
            this.detailsService.getNameFilter(locale, name),
            'roomSectionType',
            this.detailsService.obtainParamsForGetQuery('characteristicNSectionFields', 'characteristic', locale),
        );
    }

    public async createSectionType(body: CreateSectionTypeRequestDto) {
        const { characteristicIds, ...bodyValues } = body;
        return this.detailsRepository.createOne(
            bodyValues,
            'roomSectionType',
            this.detailsService.obtainParamsForCreationQuery(
                characteristicIds,
                'characteristicNSectionFields',
                'characteristic',
            ),
        );
    }

    public async getSectionType(locale: Locale, id: string) {
        return this.detailsRepository.getOne(
            locale,
            id,
            this.detailsService.obtainParamsForGetQuery('characteristicNSectionFields', 'characteristic', locale),
            'roomSectionType',
        );
    }

    public async updateSectionType(body: UpdateSectionTypeRequestDto, id: string) {
        const { characteristicIds, ...bodyValues } = body;
        const result = await this.commonRepository.createTransactionWithCallback(async prisma => {
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
        });

        return result;
    }

    public async deleteSectionType(id: string) {
        return this.detailsRepository.deleteOne(id, 'roomSectionType');
    }
}
