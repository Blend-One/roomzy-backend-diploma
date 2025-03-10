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
import { DetailsService } from './details.service';

@Injectable()
export class CharacteristicsService {
    constructor(
        private readonly detailsRepository: DetailsRepository,
        private readonly commonRepository: CommonRepository,
        private readonly detailsService: DetailsService,
    ) {}

    public async getAllCharacteristics(name: string, page: number, limit: number, locale: Locale) {
        const { skip, take } = calculatePaginationData(page, limit);
        return this.detailsRepository.getAll(
            locale,
            skip,
            take,
            this.detailsService.getNameFilter(locale, name),
            'characteristic',
            this.detailsService.obtainParamsForGetQuery('characteristicNAttributeFields', 'attribute', locale),
        );
    }

    public async createCharacteristic(body: CreateCharacteristicRequestDto) {
        const { attributeIds, ...bodyValues } = body;
        return this.detailsRepository.createOne(
            bodyValues,
            'characteristic',
            this.detailsService.obtainParamsForCreationQuery(
                attributeIds,
                'characteristicNAttributeFields',
                'attribute',
                { type: CharType.OPTIONS },
            ),
        );
    }

    public async getCharacteristic(locale: Locale, id: string) {
        return this.detailsRepository.getOne(
            locale,
            id,
            this.detailsService.obtainParamsForGetQuery('characteristicNAttributeFields', 'attribute', locale),
            'characteristic',
        );
    }

    public async updateCharacteristic(body: UpdateCharacteristicRequestDto, id: string) {
        const { attributeIds, ...bodyValues } = body;
        const result = await this.commonRepository.createTransactionWithCallback(async prisma => {
            if (!!attributeIds?.length) {
                await this.detailsRepository.deleteMany(
                    this.detailsService.obtainParamsForDeleteRelations(
                        prisma,
                        'characteristicAndAttribute',
                        'characteristicId',
                        id,
                    ),
                );
            }
            return await this.detailsRepository.updateOne(
                this.detailsService.obtainParamsForUpdate({
                    body: bodyValues,
                    id,
                    tableName: 'characteristic',
                    prisma,
                    relationField: 'characteristicNAttributeFields',
                    fieldWithinRelation: 'attribute',
                    idsForRelation: attributeIds,
                }),
            );
        });

        return result;
    }

    public async deleteCharacteristic(id: string) {
        return this.detailsRepository.deleteOne(id, 'characteristic');
    }
}
